"use strict";
exports.__esModule = true;
exports.useSelection = void 0;
var React = require("react");
var _utils_1 = require("+utils");
var _hooks_1 = require("+hooks");
function canvasToScreen(point, camera) {
    return [(point[0] + camera.point[0]) * camera.zoom, (point[1] + camera.point[1]) * camera.zoom];
}
function getShapeUtils(shapeUtils, shape) {
    return shapeUtils[shape.type];
}
function useSelection(page, pageState, shapeUtils) {
    var rSelectionBounds = (0, _hooks_1.useTLContext)().rSelectionBounds;
    var selectedIds = pageState.selectedIds;
    var rPrevBounds = React.useRef();
    var bounds = undefined;
    var rotation = 0;
    var isLocked = false;
    var isLinked = false;
    if (selectedIds.length === 1) {
        var id = selectedIds[0];
        var shape = page.shapes[id];
        rotation = shape.rotation || 0;
        isLocked = shape.isLocked || false;
        bounds = getShapeUtils(shapeUtils, shape).getBounds(shape);
    }
    else if (selectedIds.length > 1) {
        var selectedShapes = selectedIds.map(function (id) { return page.shapes[id]; });
        rotation = 0;
        isLocked = selectedShapes.every(function (shape) { return shape.isLocked; });
        bounds = selectedShapes.reduce(function (acc, shape, i) {
            if (i === 0) {
                return getShapeUtils(shapeUtils, shape).getRotatedBounds(shape);
            }
            return _utils_1["default"].getExpandedBounds(acc, getShapeUtils(shapeUtils, shape).getRotatedBounds(shape));
        }, {});
    }
    if (bounds) {
        var _a = canvasToScreen([bounds.minX, bounds.minY], pageState.camera), minX = _a[0], minY = _a[1];
        var _b = canvasToScreen([bounds.maxX, bounds.maxY], pageState.camera), maxX = _b[0], maxY = _b[1];
        isLinked = !!Object.values(page.bindings).find(function (binding) { return selectedIds.includes(binding.toId) || selectedIds.includes(binding.fromId); });
        rSelectionBounds.current = {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    else {
        rSelectionBounds.current = null;
    }
    var prevBounds = rPrevBounds.current;
    if (!prevBounds || !bounds) {
        rPrevBounds.current = bounds;
    }
    else if (bounds) {
        if (prevBounds.minX === bounds.minX &&
            prevBounds.minY === bounds.minY &&
            prevBounds.maxX === bounds.maxX &&
            prevBounds.maxY === bounds.maxY) {
            bounds = rPrevBounds.current;
        }
    }
    return { bounds: bounds, rotation: rotation, isLocked: isLocked, isLinked: isLinked };
}
exports.useSelection = useSelection;
