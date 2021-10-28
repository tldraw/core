"use strict";
exports.__esModule = true;
exports.usePosition = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
function usePosition(bounds, rotation) {
    if (rotation === void 0) { rotation = 0; }
    var rBounds = React.useRef(null);
    // Update the transform
    React.useLayoutEffect(function () {
        var elm = rBounds.current;
        var transform = "\n    translate(\n      calc(" + bounds.minX + "px - var(--tl-padding)),\n      calc(" + bounds.minY + "px - var(--tl-padding))\n    )\n    rotate(" + (rotation + (bounds.rotation || 0)) + "rad)";
        elm.style.setProperty('transform', transform);
        elm.style.setProperty('width', "calc(" + Math.floor(bounds.width) + "px + (var(--tl-padding) * 2))");
        elm.style.setProperty('height', "calc(" + Math.floor(bounds.height) + "px + (var(--tl-padding) * 2))");
        // elm.style.setProperty('z-index', zIndex + '')
    }, [bounds, rotation]);
    return rBounds;
}
exports.usePosition = usePosition;
