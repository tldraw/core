"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.useZoomEvents = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var React = require("react");
var useTLContext_1 = require("./useTLContext");
var react_1 = require("@use-gesture/react");
var vec_1 = require("@tldraw/vec");
// Capture zoom gestures (pinches, wheels and pans)
function useZoomEvents(zoom, ref) {
    var rOriginPoint = React.useRef(undefined);
    var rPinchPoint = React.useRef(undefined);
    var rDelta = React.useRef([0, 0]);
    var _a = (0, useTLContext_1.useTLContext)(), inputs = _a.inputs, callbacks = _a.callbacks;
    React.useEffect(function () {
        var preventGesture = function (event) {
            event.preventDefault();
        };
        // @ts-ignore
        document.addEventListener('gesturestart', preventGesture);
        // @ts-ignore
        document.addEventListener('gesturechange', preventGesture);
        return function () {
            // @ts-ignore
            document.removeEventListener('gesturestart', preventGesture);
            // @ts-ignore
            document.removeEventListener('gesturechange', preventGesture);
        };
    }, []);
    (0, react_1.useGesture)({
        onWheel: function (_a) {
            var _b, _c, _d, _e;
            var delta = _a.delta, e = _a.event;
            if (e.altKey && e.buttons === 0) {
                var point = (_c = (_b = inputs.pointer) === null || _b === void 0 ? void 0 : _b.point) !== null && _c !== void 0 ? _c : [inputs.bounds.width / 2, inputs.bounds.height / 2];
                var info_1 = inputs.pinch(point, point);
                (_d = callbacks.onZoom) === null || _d === void 0 ? void 0 : _d.call(callbacks, __assign(__assign({}, info_1), { delta: __spreadArray(__spreadArray([], point, true), [-e.deltaY], false) }), e);
                return;
            }
            e.preventDefault();
            if (inputs.isPinching)
                return;
            if (vec_1.Vec.isEqual(delta, [0, 0]))
                return;
            var info = inputs.pan(delta, e);
            (_e = callbacks.onPan) === null || _e === void 0 ? void 0 : _e.call(callbacks, info, e);
        },
        onPinchStart: function (_a) {
            var _b;
            var origin = _a.origin, event = _a.event;
            var elm = ref.current;
            if (!elm || !(event.target === elm || elm.contains(event.target)))
                return;
            var info = inputs.pinch(origin, origin);
            inputs.isPinching = true;
            (_b = callbacks.onPinchStart) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, event);
            rPinchPoint.current = info.point;
            rOriginPoint.current = info.origin;
            rDelta.current = [0, 0];
        },
        onPinchEnd: function (_a) {
            var _b;
            var origin = _a.origin, event = _a.event;
            var elm = ref.current;
            if (!(event.target === elm || (elm === null || elm === void 0 ? void 0 : elm.contains(event.target))))
                return;
            var info = inputs.pinch(origin, origin);
            inputs.isPinching = false;
            (_b = callbacks.onPinchEnd) === null || _b === void 0 ? void 0 : _b.call(callbacks, info, event);
            rPinchPoint.current = undefined;
            rOriginPoint.current = undefined;
            rDelta.current = [0, 0];
        },
        onPinch: function (_a) {
            var _b;
            var origin = _a.origin, offset = _a.offset, event = _a.event;
            var elm = ref.current;
            if (!(event.target === elm || (elm === null || elm === void 0 ? void 0 : elm.contains(event.target))))
                return;
            if (!rOriginPoint.current)
                return;
            var info = inputs.pinch(origin, rOriginPoint.current);
            var trueDelta = vec_1.Vec.sub(info.delta, rDelta.current);
            rDelta.current = info.delta;
            (_b = callbacks.onPinch) === null || _b === void 0 ? void 0 : _b.call(callbacks, __assign(__assign({}, info), { point: info.point, origin: rOriginPoint.current, delta: __spreadArray(__spreadArray([], trueDelta, true), [offset[0]], false) }), event);
            rPinchPoint.current = origin;
        }
    }, {
        target: ref,
        eventOptions: { passive: false },
        pinch: {
            from: zoom,
            scaleBounds: function () { return ({ from: inputs.zoom, max: 5, min: 0.1 }); }
        }
    });
}
exports.useZoomEvents = useZoomEvents;
