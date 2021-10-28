"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.Renderer = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var canvas_1 = require("../canvas");
var inputs_1 = require("../../inputs");
var hooks_1 = require("../../hooks");
/**
 * The Renderer component is the main component of the library. It
 * accepts the current `page`, the `shapeUtils` needed to interpret
 * and render the shapes and bindings on the `page`, and the current
 * `pageState`.
 * @param props
 * @returns
 */
function Renderer(_a) {
    var _b = _a.id, id = _b === void 0 ? 'tl' : _b, shapeUtils = _a.shapeUtils, page = _a.page, pageState = _a.pageState, users = _a.users, userId = _a.userId, theme = _a.theme, meta = _a.meta, snapLines = _a.snapLines, containerRef = _a.containerRef, _c = _a.hideHandles, hideHandles = _c === void 0 ? false : _c, _d = _a.hideIndicators, hideIndicators = _d === void 0 ? false : _d, _e = _a.hideCloneHandles, hideCloneHandles = _e === void 0 ? false : _e, _f = _a.hideBindingHandles, hideBindingHandles = _f === void 0 ? false : _f, _g = _a.hideRotateHandles, hideRotateHandles = _g === void 0 ? false : _g, _h = _a.hideBounds, hideBounds = _h === void 0 ? false : _h, onMount = _a.onMount, rest = __rest(_a, ["id", "shapeUtils", "page", "pageState", "users", "userId", "theme", "meta", "snapLines", "containerRef", "hideHandles", "hideIndicators", "hideCloneHandles", "hideBindingHandles", "hideRotateHandles", "hideBounds", "onMount"]);
    (0, hooks_1.useTLTheme)(theme, '#' + id);
    var rSelectionBounds = React.useRef(null);
    var rPageState = React.useRef(pageState);
    React.useEffect(function () {
        rPageState.current = pageState;
    }, [pageState]);
    var context = React.useState(function () { return ({
        callbacks: rest,
        shapeUtils: shapeUtils,
        rSelectionBounds: rSelectionBounds,
        rPageState: rPageState,
        inputs: new inputs_1.Inputs()
    }); })[0];
    React.useEffect(function () {
        onMount === null || onMount === void 0 ? void 0 : onMount(context.inputs);
    }, [context]);
    return (<hooks_1.TLContext.Provider value={context}>
      <canvas_1.Canvas id={id} page={page} pageState={pageState} snapLines={snapLines} users={users} userId={userId} externalContainerRef={containerRef} hideBounds={hideBounds} hideIndicators={hideIndicators} hideHandles={hideHandles} hideCloneHandles={hideCloneHandles} hideBindingHandles={hideBindingHandles} hideRotateHandle={hideRotateHandles} meta={meta}/>
    </hooks_1.TLContext.Provider>);
}
exports.Renderer = Renderer;
