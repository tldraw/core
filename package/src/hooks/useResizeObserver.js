"use strict";
exports.__esModule = true;
exports.useResizeObserver = void 0;
var _hooks_1 = require("+hooks");
var React = require("react");
var _utils_1 = require("+utils");
function useResizeObserver(ref) {
    var _a = (0, _hooks_1.useTLContext)(), inputs = _a.inputs, callbacks = _a.callbacks;
    var rIsMounted = React.useRef(false);
    var forceUpdate = React.useReducer(function (x) { return x + 1; }, 0)[1];
    // When the element resizes, update the bounds (stored in inputs)
    // and broadcast via the onBoundsChange callback prop.
    var updateBounds = React.useCallback(function () {
        var _a, _b;
        if (rIsMounted.current) {
            var rect = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            if (rect) {
                inputs.bounds = {
                    minX: rect.left,
                    maxX: rect.left + rect.width,
                    minY: rect.top,
                    maxY: rect.top + rect.height,
                    width: rect.width,
                    height: rect.height
                };
                (_b = callbacks.onBoundsChange) === null || _b === void 0 ? void 0 : _b.call(callbacks, inputs.bounds);
                // Force an update for a second mount
                forceUpdate();
            }
        }
        else {
            // Skip the first mount
            rIsMounted.current = true;
        }
    }, [ref, forceUpdate, inputs, callbacks.onBoundsChange]);
    React.useEffect(function () {
        var debouncedupdateBounds = _utils_1.Utils.debounce(updateBounds, 100);
        window.addEventListener('scroll', debouncedupdateBounds);
        window.addEventListener('resize', debouncedupdateBounds);
        return function () {
            window.removeEventListener('scroll', debouncedupdateBounds);
            window.removeEventListener('resize', debouncedupdateBounds);
        };
    }, []);
    React.useEffect(function () {
        var resizeObserver = new ResizeObserver(function (entries) {
            if (inputs.isPinching) {
                return;
            }
            if (entries[0].contentRect) {
                updateBounds();
            }
        });
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }
        return function () {
            resizeObserver.disconnect();
        };
    }, [ref, inputs]);
    React.useEffect(function () {
        updateBounds();
    }, [ref]);
}
exports.useResizeObserver = useResizeObserver;
