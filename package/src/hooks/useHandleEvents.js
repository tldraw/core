"use strict";
exports.__esModule = true;
exports.useHandleEvents = void 0;
var React = require("react");
var useTLContext_1 = require("./useTLContext");
function useHandleEvents(id) {
    var _a = (0, useTLContext_1.useTLContext)(), inputs = _a.inputs, callbacks = _a.callbacks;
    var onPointerDown = React.useCallback(function (e) {
        var _a, _b, _c;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        e.stopPropagation();
        (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.setPointerCapture(e.pointerId);
        var info = inputs.pointerDown(e, id);
        (_b = callbacks.onPointHandle) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        (_c = callbacks.onPointerDown) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
    }, [inputs, callbacks, id]);
    var onPointerUp = React.useCallback(function (e) {
        var _a, _b, _c, _d;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        e.stopPropagation();
        var isDoubleClick = inputs.isDoubleClick();
        var info = inputs.pointerUp(e, id);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
            if (isDoubleClick && !(info.altKey || info.metaKey)) {
                (_b = callbacks.onDoubleClickHandle) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
            }
            (_c = callbacks.onReleaseHandle) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
        }
        (_d = callbacks.onPointerUp) === null || _d === void 0 ? void 0 : _d.call(callbacks, info, e);
    }, [inputs, callbacks]);
    var onPointerMove = React.useCallback(function (e) {
        var _a, _b;
        if (!inputs.pointerIsValid(e))
            return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            var info_1 = inputs.pointerMove(e, id);
            (_a = callbacks.onDragHandle) === null || _a === void 0 ? void 0 : _a.call(callbacks, info_1, e);
        }
        var info = inputs.pointerMove(e, id);
        (_b = callbacks.onPointerMove) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
    }, [inputs, callbacks, id]);
    var onPointerEnter = React.useCallback(function (e) {
        var _a;
        if (!inputs.pointerIsValid(e))
            return;
        var info = inputs.pointerEnter(e, id);
        (_a = callbacks.onHoverHandle) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
    }, [inputs, callbacks, id]);
    var onPointerLeave = React.useCallback(function (e) {
        var _a;
        if (!inputs.pointerIsValid(e))
            return;
        var info = inputs.pointerEnter(e, id);
        (_a = callbacks.onUnhoverHandle) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
    }, [inputs, callbacks, id]);
    return {
        onPointerDown: onPointerDown,
        onPointerUp: onPointerUp,
        onPointerEnter: onPointerEnter,
        onPointerMove: onPointerMove,
        onPointerLeave: onPointerLeave
    };
}
exports.useHandleEvents = useHandleEvents;
