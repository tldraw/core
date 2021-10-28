"use strict";
exports.__esModule = true;
exports.renderWithSvg = void 0;
var React = require("react");
var react_1 = require("@testing-library/react");
var context_wrapper_1 = require("./context-wrapper");
var renderWithSvg = function (children) {
    return (0, react_1.render)(<context_wrapper_1.ContextWrapper>
      <svg>{children}</svg>
    </context_wrapper_1.ContextWrapper>);
};
exports.renderWithSvg = renderWithSvg;
