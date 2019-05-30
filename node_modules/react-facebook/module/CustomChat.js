import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { PureComponent, forwardRef } from 'react';
import Parser from './Parser';

class CustomChat extends PureComponent {
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
    return React.createElement("div", {
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

_defineProperty(CustomChat, "defaultProps", {
  minimized: undefined,
  children: undefined,
  themeColor: undefined,
  loggedInGreeting: undefined,
  loggedOutGreeting: undefined,
  dataRef: undefined
});

export default forwardRef((props, ref) => React.createElement(Parser, null, ({
  handleParse
}) => React.createElement(CustomChat, _extends({}, props, {
  handleParse: handleParse,
  ref: ref
}))));
//# sourceMappingURL=CustomChat.js.map