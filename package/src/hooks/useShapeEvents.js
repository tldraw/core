"use strict";
exports.__esModule = true;
exports.useShapeEvents = void 0;
var React = require("react");
var _utils_1 = require("+utils");
var _hooks_1 = require("+hooks");
function useShapeEvents(id, disable) {
    if (disable === void 0) { disable = false; }
    var _a = React.useContext(_hooks_1.TLContext), rPageState = _a.rPageState, rSelectionBounds = _a.rSelectionBounds, callbacks = _a.callbacks, inputs = _a.inputs;
    var onPointerDown = React.useCallback(function (e) {
        var _a, _b, _c, _d, _e, _f;
        if (disable)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        if (e.button === 2) {
            (_a = callbacks.onRightPointShape) === null || _a === void 0 ? void 0 : _a.call(callbacks, inputs.pointerDown(e, id), e);
            return;
        }
        if (e.button !== 0)
            return;
        var info = inputs.pointerDown(e, id);
        e.stopPropagation();
        (_b = e.currentTarget) === null || _b === void 0 ? void 0 : _b.setPointerCapture(e.pointerId);
        // If we click "through" the selection bounding box to hit a shape that isn't selected,
        // treat the event as a bounding box click. Unfortunately there's no way I know to pipe
        // the event to the actual bounds background element.
        if (rSelectionBounds.current &&
            _utils_1.Utils.pointInBounds(info.point, rSelectionBounds.current) &&
            !rPageState.current.selectedIds.includes(id)) {
            (_c = callbacks.onPointBounds) === null || _c === void 0 ? void 0 : _c.call(callbacks, inputs.pointerDown(e, 'bounds'), e);
            (_d = callbacks.onPointShape) === null || _d === void 0 ? void 0 : _d.call(callbacks, info, e);
            return;
        }
        (_e = callbacks.onPointShape) === null || _e === void 0 ? void 0 : _e.call(callbacks, info, e);
        (_f = callbacks.onPointerDown) === null || _f === void 0 ? void 0 : _f.call(callbacks, info, e);
    }, [inputs, callbacks, id, disable]);
    var onPointerUp = React.useCallback(function (e) {
        var _a, _b, _c, _d;
        if (e.button !== 0)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        if (disable)
            return;
        e.stopPropagation();
        var isDoubleClick = inputs.isDoubleClick();
        var info = inputs.pointerUp(e, id);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.releasePointerCapture(e.pointerId);
        }
        if (isDoubleClick && !(info.altKey || info.metaKey)) {
            (_b = callbacks.onDoubleClickShape) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
        }
        (_c = callbacks.onReleaseShape) === null || _c === void 0 ? void 0 : _c.call(callbacks, info, e);
        (_d = callbacks.onPointerUp) === null || _d === void 0 ? void 0 : _d.call(callbacks, info, e);
    }, [inputs, callbacks, id, disable]);
    var onPointerMove = React.useCallback(function (e) {
        var _a, _b;
        if (!inputs.pointerIsValid(e))
            return;
        if (disable)
            return;
        e.stopPropagation();
        if (inputs.pointer && e.pointerId !== inputs.pointer.pointerId)
            return;
        var info = inputs.pointerMove(e, id);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            (_a = callbacks.onDragShape) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
        }
        (_b = callbacks.onPointerMove) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, e);
    }, [inputs, callbacks, id, disable]);
    var onPointerEnter = React.useCallback(function (e) {
        var _a;
        if (!inputs.pointerIsValid(e))
            return;
        if (disable)
            return;
        var info = inputs.pointerEnter(e, id);
        (_a = callbacks.onHoverShape) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
    }, [inputs, callbacks, id, disable]);
    var onPointerLeave = React.useCallback(function (e) {
        var _a;
        if (disable)
            return;
        if (!inputs.pointerIsValid(e))
            return;
        var info = inputs.pointerEnter(e, id);
        (_a = callbacks.onUnhoverShape) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
    }, [inputs, callbacks, id, disable]);
    return {
        onPointerDown: onPointerDown,
        onPointerUp: onPointerUp,
        onPointerEnter: onPointerEnter,
        onPointerMove: onPointerMove,
        onPointerLeave: onPointerLeave
    };
}
exports.useShapeEvents = useShapeEvents;
