"use strict";
exports.__esModule = true;
exports.usePreventNavigation = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
var React = require("react");
function usePreventNavigation(rCanvas, width) {
    React.useEffect(function () {
        var preventGestureNavigation = function (event) {
            event.preventDefault();
        };
        var preventNavigation = function (event) {
            // Center point of the touch area
            var touchXPosition = event.touches[0].pageX;
            // Size of the touch area
            var touchXRadius = event.touches[0].radiusX || 0;
            // We set a threshold (10px) on both sizes of the screen,
            // if the touch area overlaps with the screen edges
            // it's likely to trigger the navigation. We prevent the
            // touchstart event in that case.
            if (touchXPosition - touchXRadius < 10 || touchXPosition + touchXRadius > width - 10) {
                event.preventDefault();
            }
        };
        var elm = rCanvas.current;
        if (!elm)
            return function () { return void null; };
        elm.addEventListener('touchstart', preventGestureNavigation);
        // @ts-ignore
        elm.addEventListener('gestureend', preventGestureNavigation);
        // @ts-ignore
        elm.addEventListener('gesturechange', preventGestureNavigation);
        // @ts-ignore
        elm.addEventListener('gesturestart', preventGestureNavigation);
        // @ts-ignore
        elm.addEventListener('touchstart', preventNavigation);
        return function () {
            if (elm) {
                elm.removeEventListener('touchstart', preventGestureNavigation);
                // @ts-ignore
                elm.removeEventListener('gestureend', preventGestureNavigation);
                // @ts-ignore
                elm.removeEventListener('gesturechange', preventGestureNavigation);
                // @ts-ignore
                elm.removeEventListener('gesturestart', preventGestureNavigation);
                // @ts-ignore
                elm.removeEventListener('touchstart', preventNavigation);
            }
        };
    }, [rCanvas, width]);
}
exports.usePreventNavigation = usePreventNavigation;
