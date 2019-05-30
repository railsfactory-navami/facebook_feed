"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ShareButton;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _Share = _interopRequireDefault(require("./Share"));

function ShareButton(props) {
  const {
    className,
    children
  } = props,
        rest = (0, _objectWithoutProperties2.default)(props, ["className", "children"]);
  return _react.default.createElement(_Share.default, rest, ({
    loading,
    handleClick
  }) => _react.default.createElement("button", {
    type: "button",
    disabled: loading,
    className: className,
    onClick: handleClick
  }, children));
}

ShareButton.defaultProps = (0, _objectSpread2.default)({}, _Share.default.defaultProps, {
  className: undefined
});
//# sourceMappingURL=ShareButton.js.map