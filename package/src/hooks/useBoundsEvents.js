"use strict";
exports.__esModule = true;
exports.useBoundsEvents = void 0;
var React = require("react");
var useTLContext_1 = require("./useTLContext");
function useBoundsEvents() {
    var _a = (0, useTLContext_1.useTLContext)(), callbacks = _a.callbacks, inputs = _a.inputs;
    var onPointerDown = React.useCallback(function (e) {
        var _a, _b, _c;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        e.stopPropagation();
        (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture(e.pointerId);
        var info = inputs.pointerDown(e, 'bounds');
        (_b = callbacks.onPointBounds) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        (_c = callbacks.onPointerDown) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
    }, [callbacks, inputs]);
    var onPointerUp = React.useCallback(function (e) {
        var _a, _b, _c, _d;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        e.stopPropagation();
        var isDoubleClick = inputs.isDoubleClick();
        var info = inputs.pointerUp(e, 'bounds');
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
        }
        if (isDoubleClick && !(info.altKey || info.metaKey)) {
            (_b = callbacks.onDoubleClickBounds) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        }
        (_c = callbacks.onReleaseBounds) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
        (_d = callbacks.onPointerUp) === null || _d === void 0 ? void 0 : _d.call(callbacks, info, e);
    }, [callbacks, inputs]);
    var onPointerMove = React.useCallback(function (e) {
        var _a, _b;
        if (!inputs.pointerIsValid(e))
            return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = callbacks.onDragBounds) === null || _a === void 0 ? void 0 : _a.call(callbacks, inputs.pointerMove(e, 'bounds'), e);
        }
        var info = inputs.pointerMove(e, 'bounds');
        (_b = callbacks.onPointerMove) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
    }, [callbacks, inputs]);
    var onPointerEnter = React.useCallback(function (e) {
        var _a;
        if (!inputs.pointerIsValid(e))
            return;
        (_a = callbacks.onHoverBounds) === null || _a === void 0 ? void 0 : _a.call(callbacks, inputs.pointerEnter(e, 'bounds'), e);
    }, [callbacks, inputs]);
    var onPointerLeave = React.useCallback(function (e) {
        var _a;
        if (!inputs.pointerIsValid(e))
            return;
        (_a = callbacks.onUnhoverBounds) === null || _a === void 0 ? void 0 : _a.call(callbacks, inputs.pointerEnter(e, 'bounds'), e);
    }, [callbacks, inputs]);
    return {
        onPointerDown: onPointerDown,
        onPointerUp: onPointerUp,
        onPointerEnter: onPointerEnter,
        onPointerMove: onPointerMove,
        onPointerLeave: onPointerLeave
    };
}
exports.useBoundsEvents = useBoundsEvents;
