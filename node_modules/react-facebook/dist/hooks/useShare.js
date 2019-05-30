"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _clearUndefinedProperties = _interopRequireDefault(require("../utils/clearUndefinedProperties"));

var _useApi = _interopRequireDefault(require("./useApi"));

var _default = () => {
  const [, prepareApi] = (0, _useApi.default)();

  function handleShare(_x) {
    return _handleShare.apply(this, arguments);
  }

  function _handleShare() {
    _handleShare = (0, _asyncToGenerator2.default)(function* (options) {
      const {
        href,
        display,
        hashtag,
        redirectUri,
        quote,
        mobileIframe
      } = options,
            rest = (0, _objectWithoutProperties2.default)(options, ["href", "display", "hashtag", "redirectUri", "quote", "mobileIframe"]);
      const api = yield prepareApi();
      return api.ui((0, _clearUndefinedProperties.default)((0, _objectSpread2.default)({
        method: 'share',
        href,
        display,
        app_id: api.getAppId(),
        hashtag,
        redirect_uri: redirectUri,
        quote,
        mobile_iframe: mobileIframe
      }, rest)));
    });
    return _handleShare.apply(this, arguments);
  }

  return handleShare;
};

exports.default = _default;
//# sourceMappingURL=useShare.js.map