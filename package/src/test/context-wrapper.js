"use strict";
exports.__esModule = true;
exports.ContextWrapper = void 0;
var React = require("react");
var mockDocument_1 = require("./mockDocument");
var mockUtils_1 = require("./mockUtils");
var hooks_1 = require("../hooks");
var _inputs_1 = require("+inputs");
var ContextWrapper = function (_a) {
    var children = _a.children;
    (0, hooks_1.useTLTheme)();
    var rSelectionBounds = React.useRef(null);
    var rPageState = React.useRef(mockDocument_1.mockDocument.pageState);
    var context = React.useState(function () { return ({
        callbacks: {},
        shapeUtils: mockUtils_1.mockUtils,
        rSelectionBounds: rSelectionBounds,
        rPageState: rPageState,
        inputs: new _inputs_1.Inputs()
    }); })[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <hooks_1.TLContext.Provider value={context}>{children}</hooks_1.TLContext.Provider>;
};
exports.ContextWrapper = ContextWrapper;
