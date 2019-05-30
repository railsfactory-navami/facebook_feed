import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import React from 'react';
import Spinner from 'react-spinner-children';
import Login from './Login';
export default function LoginButton(props) {
  const {
    children,
    className,
    spinner,
    spinnerConfig
  } = props,
        rest = _objectWithoutProperties(props, ["children", "className", "spinner", "spinnerConfig"]);

  return React.createElement(Login, rest, ({
    loading,
    handleClick
  }) => React.createElement("button", {
    type: "button",
    className: className,
    onClick: handleClick,
    disabled: loading
  }, children, spinner && loading && React.createElement(Spinner, {
    config: spinnerConfig
  })));
}
LoginButton.defaultProps = _objectSpread({}, Login.defaultProps, {
  className: undefined,
  spinnerConfig: {},
  spinner: true
});
//# sourceMappingURL=LoginButton.js.map