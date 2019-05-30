"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _Parser = _interopRequireDefault(require("./Parser"));

class CustomChat extends _react.PureComponent {
  componentDidUpdate() {
    const {
      handleParse
    } = this.props;
    handleParse();
  }

  render() {
    const {
      minimized,
      children,
      pageId,
      themeColor,
      loggedInGreeting,
      loggedOutGreeting,
      dataRef
    } = this.props;
    return _react.default.createElement("div", {
      className: "fb-customerchat",
      page_id: pageId,
      minimized: minimized,
      theme_color: themeColor,
      logged_in_greeting: loggedInGreeting,
      logged_out_greeting: loggedOutGreeting,
      "data-ref": dataRef
    }, children);
  }

}

(0, _defineProperty2.default)(CustomChat, "defaultProps", {
  minimized: undefined,
  children: undefined,
  themeColor: undefined,
  loggedInGreeting: undefined,
  loggedOutGreeting: undefined,
  dataRef: undefined
});

var _default = (0, _react.forwardRef)((props, ref) => _react.default.createElement(_Parser.default, null, ({
  handleParse
}) => _react.default.createElement(CustomChat, (0, _extends2.default)({}, props, {
  handleParse: handleParse,
  ref: ref
}))));

exports.default = _default;
//# sourceMappingURL=CustomChat.js.map