"use strict";
exports.__esModule = true;
exports.useCameraCss = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
function useCameraCss(layerRef, containerRef, pageState) {
    // Update the tl-zoom CSS variable when the zoom changes
    var rZoom = React.useRef(pageState.camera.zoom);
    var rPoint = React.useRef(pageState.camera.point);
    React.useLayoutEffect(function () {
        var _a = pageState.camera, zoom = _a.zoom, point = _a.point;
        var didZoom = zoom !== rZoom.current;
        var didPan = point !== rPoint.current;
        rZoom.current = zoom;
        rPoint.current = point;
        if (didZoom || didPan) {
            var layer = layerRef.current;
            var container = containerRef.current;
            // If we zoomed, set the CSS variable for the zoom
            if (didZoom) {
                if (container) {
                    container.style.setProperty('--tl-zoom', zoom.toString());
                }
            }
            // Either way, position the layer
            if (layer) {
                layer.style.setProperty('transform', "scale(" + zoom + ") translateX(" + point[0] + "px) translateY(" + point[1] + "px)");
            }
        }
    }, [pageState.camera]);
}
exports.useCameraCss = useCameraCss;
