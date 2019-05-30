"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LoginButton;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireDefault(require("react"));

var _reactSpinnerChildren = _interopRequireDefault(require("react-spinner-children"));

var _Login = _interopRequireDefault(require("./Login"));

function LoginButton(props) {
  const {
    children,
    className,
    spinner,
    spinnerConfig
  } = props,
        rest = (0, _objectWithoutProperties2.default)(props, ["children", "className", "spinner", "spinnerConfig"]);
  return _react.default.createElement(_Login.default, rest, ({
    loading,
    handleClick
  }) => _react.default.createElement("button", {
    type: "button",
    className: className,
    onClick: handleClick,
    disabled: loading
  }, children, spinner && loading && _react.default.createElement(_reactSpinnerChildren.default, {
    config: spinnerConfig
  })));
}

LoginButton.defaultProps = (0, _objectSpread2.default)({}, _Login.default.defaultProps, {
  className: undefined,
  spinnerConfig: {},
  spinner: true
});
//# sourceMappingURL=LoginButton.js.map