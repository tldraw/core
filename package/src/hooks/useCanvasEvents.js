"use strict";
exports.__esModule = true;
exports.useCanvasEvents = void 0;
var React = require("react");
var useTLContext_1 = require("./useTLContext");
function useCanvasEvents() {
    var _a = (0, useTLContext_1.useTLContext)(), callbacks = _a.callbacks, inputs = _a.inputs;
    var onPointerDown = React.useCallback(function (e) {
        var _a, _b;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        e.currentTarget.setPointerCapture(e.pointerId);
        var info = inputs.pointerDown(e, 'canvas');
        if (e.button === 0) {
            (_a = callbacks.onPointCanvas) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
            (_b = callbacks.onPointerDown) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        }
    }, [callbacks, inputs]);
    var onPointerMove = React.useCallback(function (e) {
        var _a, _b;
        if (!inputs.pointerIsValid(e))
            return;
        var info = inputs.pointerMove(e, 'canvas');
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = callbacks.onDragCanvas) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
        }
        (_b = callbacks.onPointerMove) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
    }, [callbacks, inputs]);
    var onPointerUp = React.useCallback(function (e) {
        var _a, _b, _c, _d;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        var isDoubleClick = inputs.isDoubleClick();
        var info = inputs.pointerUp(e, 'canvas');
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
        }
        if (isDoubleClick && !(info.altKey || info.metaKey)) {
            (_b = callbacks.onDoubleClickCanvas) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        }
        (_c = callbacks.onReleaseCanvas) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
        (_d = callbacks.onPointerUp) === null || _d === void 0 ? void 0 : _d.call(callbacks, info, e);
    }, [callbacks, inputs]);
    return {
        onPointerDown: onPointerDown,
        onPointerMove: onPointerMove,
        onPointerUp: onPointerUp
    };
}
exports.useCanvasEvents = useCanvasEvents;
