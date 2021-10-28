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
exports.__esModule = true;
exports.useShapeTree = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
var _utils_1 = require("+utils");
var vec_1 = require("@tldraw/vec");
function addToShapeTree(shape, branch, shapes, pageState, meta) {
    // Create a node for this shape
    var node = {
        shape: shape,
        meta: meta,
        isCurrentParent: pageState.currentParentId === shape.id,
        isEditing: pageState.editingId === shape.id,
        isBinding: pageState.bindingTargetId === shape.id,
        isSelected: pageState.selectedIds.includes(shape.id),
        isHovered: 
        // The shape is hovered..
        pageState.hoveredId === shape.id ||
            // Or the shape has children and...
            (shape.children !== undefined &&
                // One of the children is hovered
                ((pageState.hoveredId && shape.children.includes(pageState.hoveredId)) ||
                    // Or one of the children is selected
                    shape.children.some(function (childId) { return pageState.selectedIds.includes(childId); })))
    };
    // Add the node to the branch
    branch.push(node);
    // If the shape has children, add nodes for each child to the node's children array
    if (shape.children) {
        node.children = [];
        shape.children
            .map(function (id) { return shapes[id]; })
            .sort(function (a, b) { return a.childIndex - b.childIndex; })
            .forEach(function (childShape) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return addToShapeTree(childShape, node.children, shapes, pageState, meta);
        });
    }
}
function shapeIsInViewport(bounds, viewport) {
    return _utils_1.Utils.boundsContain(viewport, bounds) || _utils_1.Utils.boundsCollide(viewport, bounds);
}
function useShapeTree(page, pageState, shapeUtils, size, meta, onRenderCountChange) {
    var rTimeout = React.useRef();
    var rPreviousCount = React.useRef(0);
    var rShapesIdsToRender = React.useRef(new Set());
    var rShapesToRender = React.useRef(new Set());
    var selectedIds = pageState.selectedIds, camera = pageState.camera;
    // Filter the page's shapes down to only those that:
    // - are the direct child of the page
    // - collide with or are contained by the viewport
    // - OR are selected
    var _a = vec_1.Vec.sub(vec_1.Vec.div([0, 0], camera.zoom), camera.point), minX = _a[0], minY = _a[1];
    var _b = vec_1.Vec.sub(vec_1.Vec.div(size, camera.zoom), camera.point), maxX = _b[0], maxY = _b[1];
    var viewport = {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        height: maxX - minX,
        width: maxY - minY
    };
    var shapesToRender = rShapesToRender.current;
    var shapesIdsToRender = rShapesIdsToRender.current;
    shapesToRender.clear();
    shapesIdsToRender.clear();
    Object.values(page.shapes)
        .filter(function (shape) {
        // Always render shapes that are flagged as stateful
        return shapeUtils[shape.type].isStateful ||
            // Always render selected shapes (this preserves certain drag interactions)
            selectedIds.includes(shape.id) ||
            // Otherwise, only render shapes that are in view
            shapeIsInViewport(shapeUtils[shape.type].getBounds(shape), viewport);
    })
        .sort(function (a, b) { return a.childIndex - b.childIndex; })
        .forEach(function (shape) {
        // If the shape's parent is the page, add it to our sets of shapes to render
        if (shape.parentId === page.id) {
            shapesIdsToRender.add(shape.id);
            shapesToRender.add(shape);
            return;
        }
        // If the shape's parent is a different shape (e.g. a group),
        // add the parent to the sets of shapes to render. The parent's
        // children will all be rendered.
        shapesIdsToRender.add(shape.parentId);
        shapesToRender.add(page.shapes[shape.parentId]);
    });
    // Call onChange callback when number of rendering shapes changes
    if (shapesToRender.size !== rPreviousCount.current) {
        // Use a timeout to clear call stack, in case the onChange handler
        // produces a new state change, which could cause nested state
        // changes, which is bad in React.
        if (rTimeout.current) {
            clearTimeout(rTimeout.current);
        }
        rTimeout.current = requestAnimationFrame(function () {
            onRenderCountChange === null || onRenderCountChange === void 0 ? void 0 : onRenderCountChange(Array.from(shapesIdsToRender.values()));
        });
        rPreviousCount.current = shapesToRender.size;
    }
    var bindingTargetId = pageState.bindingId ? page.bindings[pageState.bindingId].toId : undefined;
    // Populate the shape tree
    var tree = [];
    var info = __assign(__assign({}, pageState), { bindingTargetId: bindingTargetId });
    shapesToRender.forEach(function (shape) { return addToShapeTree(shape, tree, page.shapes, info, meta); });
    return tree;
}
exports.useShapeTree = useShapeTree;
