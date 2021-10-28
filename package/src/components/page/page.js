"use strict";
exports.__esModule = true;
exports.Page = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var _hooks_1 = require("+hooks");
var bounds_1 = require("+components/bounds");
var bounds_bg_1 = require("+components/bounds/bounds-bg");
var handles_1 = require("+components/handles");
var shape_1 = require("+components/shape");
var shape_indicator_1 = require("+components/shape-indicator");
/**
 * The Page component renders the current page.
 */
exports.Page = React.memo(function Page(_a) {
    var page = _a.page, pageState = _a.pageState, hideBounds = _a.hideBounds, hideHandles = _a.hideHandles, hideIndicators = _a.hideIndicators, hideBindingHandles = _a.hideBindingHandles, hideCloneHandles = _a.hideCloneHandles, hideRotateHandle = _a.hideRotateHandle, meta = _a.meta;
    var _b = (0, _hooks_1.useTLContext)(), callbacks = _b.callbacks, shapeUtils = _b.shapeUtils, inputs = _b.inputs;
    var shapeTree = (0, _hooks_1.useShapeTree)(page, pageState, shapeUtils, [inputs.bounds.width, inputs.bounds.height], meta, callbacks.onRenderCountChange);
    var _c = (0, _hooks_1.useSelection)(page, pageState, shapeUtils), bounds = _c.bounds, isLinked = _c.isLinked, isLocked = _c.isLocked, rotation = _c.rotation;
    var selectedIds = pageState.selectedIds, hoveredId = pageState.hoveredId, zoom = pageState.camera.zoom;
    var _hideCloneHandles = true;
    // Does the selected shape have handles?
    var shapeWithHandles = undefined;
    var selectedShapes = selectedIds.map(function (id) { return page.shapes[id]; });
    if (selectedShapes.length === 1) {
        var shape = selectedShapes[0];
        var utils = shapeUtils[shape.type];
        _hideCloneHandles = hideCloneHandles || !utils.canClone;
        if (shape.handles !== undefined) {
            shapeWithHandles = shape;
        }
    }
    return (<>
      {bounds && <bounds_bg_1.BoundsBg bounds={bounds} rotation={rotation} isHidden={hideBounds}/>}
      {shapeTree.map(function (node) { return (<shape_1.ShapeNode key={node.shape.id} utils={shapeUtils} {...node}/>); })}
      {!hideIndicators &&
            selectedShapes.map(function (shape) { return (<shape_indicator_1.ShapeIndicator key={'selected_' + shape.id} shape={shape} meta={meta} isSelected/>); })}
      {!hideIndicators && hoveredId && (<shape_indicator_1.ShapeIndicator key={'hovered_' + hoveredId} shape={page.shapes[hoveredId]} meta={meta} isHovered/>)}
      {bounds && (<bounds_1.Bounds zoom={zoom} bounds={bounds} viewportWidth={inputs.bounds.width} isLocked={isLocked} rotation={rotation} isHidden={hideBounds} hideRotateHandle={hideRotateHandle} hideBindingHandles={hideBindingHandles || !isLinked} hideCloneHandles={_hideCloneHandles}/>)}
      {!hideHandles && shapeWithHandles && <handles_1.Handles shape={shapeWithHandles} zoom={zoom}/>}
    </>);
});
