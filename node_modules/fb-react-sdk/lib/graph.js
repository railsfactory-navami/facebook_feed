/**
 * Module Dependencies
 */

var superagent   = require('superagent')
  , qs           = require('qs')
  , url          = require('url')
  , crypto       = require('crypto')
  , lodash       = require('lodash')
  , noop         = function(){};

/**
 * @private
 */

var accessToken          = null
  , appSecret            = null
  , graphUrl             = 'https://graph.facebook.com'
  , graphVersion         = '2.5' // default to the oldest version
  , oauthDialogUrl       = "http://www.facebook.com/v" + graphVersion + "/dialog/oauth?"
  , oauthDialogUrlMobile = "http://m.facebook.com/v" + graphVersion + "/dialog/oauth?"
  , requestOptions       = {};

/**
 * Library version
 */

exports.version = '1.0.4';

/**
 * Graph Stream
 *
 * @param {String} method
 * @param {String} url
 * @param {object/function} - postData
 * - object to be used for post
 * - assumed to be a callback function if callback is undefined
 * @param {function/undefined} - callback function
 */

function Graph(method, url, postData, callback) {
  if (typeof callback === 'undefined') {
    callback  = postData;
    postData  = {};
  }

  url           = this.prepareUrl(url);
  this.callback = callback || noop;
  this.postData = postData;

  this.options          = lodash.extend({}, requestOptions);
  this.options.encoding = this.options.encoding || 'utf-8';

  // these particular set of options should be immutable
  this.options.method         = method;
  this.options.uri            = url;
  this.options.followRedirect = false;

  this.request = this[method.toLowerCase()]();

  return this;
}


/**
 * "Prepares" given url string
 * - adds protocol and host prefix if none is given
 * @param {string} url string
 */
Graph.prototype.prepareUrl = function(url) {
  url = this.cleanUrl(url);

  if (url.substr(0,4) !== 'http') {
    url = graphUrl + '/v' + graphVersion + url;
  }

  return url;
};

/**
 * "Cleans" given url string
 * - adds lading slash
 * - adds access token if we have one
 * - adds appsecret_proof if we have an accessToken and appSecret
 * @param {string} url string
 */

Graph.prototype.cleanUrl = function(url) {
  url = url.trim();

  // prep access token in url for appsecret proofing
  var regex = /access_token=([^&]*)/;
  var results = regex.exec(url);
  var sessionAccessToken = results ? results[1] : accessToken;

  // add leading slash
  if (url.charAt(0) !== '/' && url.substr(0,4) !== 'http') url = '/' + url;

  // add access token to url
  if (accessToken && url.indexOf('access_token=') === -1) {
    url += ~url.indexOf('?') ? '&' : '?';
    url += "access_token=" + accessToken;
  }

  // add appsecret_proof to the url
  if (sessionAccessToken && appSecret && url.indexOf('appsecret_proof') === -1) {
    var hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(sessionAccessToken);

    url += ~url.indexOf('?') ? '&' : '?';
    url += "appsecret_proof=" + hmac.digest('hex');
  }

  return url;
};

/**
 * Gets called on response.end
 * @param {String|Object} body
 */

Graph.prototype.end = function (body) {
  var json = typeof body === 'string' ? null : body
    , err  = null;

  if (!json) {
    try {

      // this accounts for `real` json strings
      if (~body.indexOf('{') && ~body.indexOf('}')) {
        json = JSON.parse(body);

      } else {
        // this accounts for responses that are plain strings
        // access token responses have format of "accessToken=....&..."
        // but facebook has random responses that just return "true"
        // so we'll convert those to { data: true }
        if (!~body.indexOf('='))    body = 'data=' + body;
        if (body.charAt(0) !== '?') body = '?' + body;

        json = url.parse(body, true).query;
      }

    } catch (e) {
      err = {
          message: 'Error parsing json'
        , exception: e
      };
    }
  }

  if (!err && (json && json.error)) err = json.error;

  this.callback(err, json);
};


/**
 * https.get request wrapper
 */

Graph.prototype.get = function () {
  var self = this;

  return superagent.get(this.options.uri)
    .end(function(err, res) {
      if (err) {
        return self.callback({
            message: 'Error processing request'
          , exception: err
        }, null);
      }

      if (~res.headers['content-type'].indexOf('image')) {
        return self.end({
          image: true,
          location: res.headers.location
        });
      }

      self.end(res.body);
    });
};


/**
 * https.post request wrapper
 */

Graph.prototype.post = function() {

  var self     = this;

  return superagent.post(this.options.uri)
    .send(this.postData)
    .end(function (err, res) {
      if (err) {
        return self.callback({
            message: 'Error processing request'
          , exception: err
        }, null);
      }

      return self.end(res.body);
    });
};

/**
 * https.del request wrapper
 */

Graph.prototype.del = function() {

  var self     = this;

  return superagent.del(this.options.uri)
    .send(this.postData)
    .end(function (err, res) {
      if (err) {
        return self.callback({
          message: 'Error processing request'
          , exception: err
        }, null);
      }

      return self.end(res.body);
    });
};

/**
 * Accepts an url an returns facebook
 * json data to the callback provided
 *
 * if the response is an image
 * ( FB redirects profile image requests directly to the image )
 * We'll send back json containing  {image: true, location: imageLocation }
 *
 * Ex:
 *
 *    Passing params directly in the url
 *
 *      graph.get("zuck?fields=picture", callback)
 *
 *    OR
 *
 *      var params = { fields: picture };
 *      graph.get("zuck", params, callback);
 *
 *    GraphApi calls that redirect directly to an image
 *    will return a json response with relavant fields
 *
 *      graph.get("/zuck/picture", callback);
 *
 *      {
 *        image: true,
 *        location: "http://profile.ak.fbcdn.net/hprofile-ak-snc4/157340_4_3955636_q.jpg"
 *      }
 *
 *
 * @param {object} params
 * @param {string} url
 * @param {function} callback
 */

exports.get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params   = null;
  }

  if (typeof url !== 'string') {
    return callback({ message: 'Graph api url must be a string' }, null);
  }

  if (params)  {
    url += ~url.indexOf('?') ? '&' : '?';
    url += qs.stringify(params);
  }

  return new Graph('GET', url, callback);
};

/**
 * Publish to the facebook graph
 * access token will be needed for posts
 * Ex:
 *
 *    var wallPost = { message: "heyooo budday" };
 *    graph.post(friendID + "/feed", wallPost, callback);
 *
 * @param {string} url
 * @param {object} postData
 * @param {function} callback
 */

exports.post = function (url, postData, callback) {
  if (typeof url !== 'string') {
    return callback({ message: 'Graph api url must be a string' }, null);
  }

  if (typeof postData === 'function') {
    callback = postData;
    postData = url.indexOf('access_token') !== -1 ? {} : {access_token: accessToken};
  }

  return new Graph('POST', url, postData, callback);
};

/**
 * Deletes an object from the graph api
 * by sending a "DELETE" request
 *
 * @param {string} url
 * @param {object} postData (optional)
 * @param {function} callback
 */

exports.del = function (url, postData, callback) {
  if (typeof postData === 'function') {
    callback = postData;
    postData = url.indexOf('access_token') !== -1 ? {} : {access_token: accessToken};
  }

  return new Graph('DEL', url, postData, callback);
};


/**
 * Perform a search on the graph api
 *
 * @param {object} options (search options)
 * @param {function} callback
 */

exports.search = function (options, callback) {
  options = options || {};
  var url = '/search?' + qs.stringify(options);
  return this.get(url, callback);
};

/**
 * Perform a batch query on the graph api
 *
 * @param  {Array}    reqs     An array containing queries
 * @param  {[Object]} additionalData Additional data to send, e.g. attachments or the `include_headers` parameter.
 * @param  {Function} callback
 *
 * @see https://developers.facebook.com/docs/graph-api/making-multiple-requests
 */

exports.batch = function (reqs, additionalData, callback) {
  if (!(reqs instanceof Array)) {
    return callback({ message: 'Graph api batch requests must be an array' }, null);
  }

  if (typeof additionalData === 'function') {
    callback = additionalData;
    additionalData = {};
  }

  return new Graph('POST', '', lodash.extend({}, {
    access_token: accessToken,
    batch: JSON.stringify(reqs)
  }, additionalData), callback);
};


/**
 * Perform a fql query or mutliquery
 * multiqueries are done by sending in
 * an object :
 *
 *     var query = {
 *         name:         "SELECT name FROM user WHERE uid = me()"
 *       , permissions:  "SELECT " + FBConfig.scope + " FROM permissions WHERE uid = me()"
 *     };
 *
 * @param {string/object} query
 * @param {object} params
 * @param {function} callback
 */
exports.fql = function (query, params, callback) {
  if (typeof query !== 'string') query = JSON.stringify(query);

  var url = '/fql?q=' + encodeURIComponent(query);

  if (typeof params === 'function') {
    callback = params;
    params = null;
    return this.get(url, callback);
  } else {
    return this.get(url, params, callback);
  }
};


/**
 * @param {object} params containing:
 *   - client_id
 *   - redirect_uri
 * @param {object} opts  Options hash. { mobile: true } will return mobile oAuth URL
 * @returns the oAuthDialogUrl based on params
 */
exports.getOauthUrl = function (params, opts) {
  var url = (opts && opts.mobile) ? oauthDialogUrlMobile : oauthDialogUrl;
  return url + qs.stringify(params);
};

/**
 * Authorizes user and sets the
 * accessToken if everything worked out
 *
 * @param {object} params containing:
 *   - client_id
 *   - redirect_uri
 *   - client_secret
 *   - code
 * @param {function} callback
 */

exports.authorize = function (params, callback) {
  var self = this;

  return this.get("/oauth/access_token", params, function(err, res) {
    if (!err) self.setAccessToken(res.access_token);

    callback(err, res);
  });
};

/**
 * Extends the expiration time of accessToken
 *
 * @param {object} params containing:
 *   - client_id
 *   - client_secret
 *   - access_token (optional)
 * @param {function} callback
 */

exports.extendAccessToken = function (params, callback) {
    var self = this;

    params.grant_type        = 'fb_exchange_token';
    params.fb_exchange_token = params.access_token ? params.access_token : this.getAccessToken();

    return this.get("/oauth/access_token", params, function(err, res) {
      if (!err && !params.access_token) {
        self.setAccessToken(res.access_token);
      }

      callback(err, res);
    });
};

/**
 * Set request options.
 * These are mapped directly to the
 * `request` module options object
 * @param {Object} options
 */

exports.setOptions = function (options) {
  if (typeof options === 'object')  requestOptions = options;

  return this;
};

/**
 * @returns the request options object
 */

exports.getOptions = function() {
  return requestOptions;
};

/**
 * Sets the access token
 * @param {string} token
 */

exports.setAccessToken = function(token) {
  accessToken = token;
  return this;
};

/**
 * @returns the access token
 */

exports.getAccessToken = function () {
  return accessToken;
};

/**
 * Set's the Graph API version.
 * Note that you don't need to specify the 'v', just
 * add '2.1', '1.1' etc
 * @param {string} version
 */
exports.setVersion = function (version) {
  // set version
  graphVersion = version;

  // update auth urls
  oauthDialogUrl       = "http://www.facebook.com/v"+version+"/dialog/oauth?"; // oldest version for auth
  oauthDialogUrlMobile = "http://m.facebook.com/v"+version+"/dialog/oauth?";   // oldest version for auth

  return this;
};


/**
 * Sets the app secret, used to verify all API calls if provided
 * @param {string} token
 */

exports.setAppSecret = function(token) {
  appSecret = token;
  return this;
};

/**
 * @returns the app secret
 */

exports.getAppSecret = function () {
  return appSecret;
};

/**
 * sets graph url
 */

exports.setGraphUrl = function (url) {
  graphUrl = url;
  return this;
};

/**
 * @returns string graphUrl
 */

exports.getGraphUrl = function() {
  return graphUrl;
};
