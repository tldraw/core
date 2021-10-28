"use strict";
exports.__esModule = true;
exports.Bounds = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
var _types_1 = require("+types");
var center_handle_1 = require("./center-handle");
var rotate_handle_1 = require("./rotate-handle");
var corner_handle_1 = require("./corner-handle");
var edge_handle_1 = require("./edge-handle");
var clone_buttons_1 = require("./clone-buttons");
var container_1 = require("+components/container");
var svg_container_1 = require("+components/svg-container");
var link_handle_1 = require("./link-handle");
exports.Bounds = React.memo(function (_a) {
    var zoom = _a.zoom, bounds = _a.bounds, viewportWidth = _a.viewportWidth, rotation = _a.rotation, isHidden = _a.isHidden, isLocked = _a.isLocked, hideCloneHandles = _a.hideCloneHandles, hideRotateHandle = _a.hideRotateHandle, hideBindingHandles = _a.hideBindingHandles;
    // Touch target size
    var targetSize = (viewportWidth < 768 ? 16 : 8) / zoom;
    // Handle size
    var size = 8 / zoom;
    var smallDimension = Math.min(bounds.width, bounds.height) * zoom;
    // If the bounds are small, don't show the rotate handle
    var showRotateHandle = !hideRotateHandle && !isHidden && !isLocked && smallDimension > 32;
    // If the bounds are very small, don't show the edge handles
    var showEdgeHandles = !isHidden && !isLocked && smallDimension > 24;
    // If the bounds are very very small, don't show the corner handles
    var showCornerHandles = !isHidden && !isLocked && smallDimension > 20;
    // If the bounds are very small, don't show the clone handles
    var showCloneHandles = !hideCloneHandles && smallDimension > 24;
    return (<container_1.Container bounds={bounds} rotation={rotation}>
        <svg_container_1.SVGContainer>
          <center_handle_1.CenterHandle bounds={bounds} isLocked={isLocked} isHidden={isHidden}/>
          <edge_handle_1.EdgeHandle targetSize={targetSize} size={size} bounds={bounds} edge={_types_1.TLBoundsEdge.Top} isHidden={!showEdgeHandles}/>
          <edge_handle_1.EdgeHandle targetSize={targetSize} size={size} bounds={bounds} edge={_types_1.TLBoundsEdge.Right} isHidden={!showEdgeHandles}/>
          <edge_handle_1.EdgeHandle targetSize={targetSize} size={size} bounds={bounds} edge={_types_1.TLBoundsEdge.Bottom} isHidden={!showEdgeHandles}/>
          <edge_handle_1.EdgeHandle targetSize={targetSize} size={size} bounds={bounds} edge={_types_1.TLBoundsEdge.Left} isHidden={!showEdgeHandles}/>
          <corner_handle_1.CornerHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={isHidden || !showCornerHandles} corner={_types_1.TLBoundsCorner.TopLeft}/>
          <corner_handle_1.CornerHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={isHidden || !showCornerHandles} corner={_types_1.TLBoundsCorner.TopRight}/>
          <corner_handle_1.CornerHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={isHidden || !showCornerHandles} corner={_types_1.TLBoundsCorner.BottomRight}/>
          <corner_handle_1.CornerHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={isHidden || !showCornerHandles} corner={_types_1.TLBoundsCorner.BottomLeft}/>
          {showRotateHandle && (<rotate_handle_1.RotateHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={!showEdgeHandles}/>)}
          {showCloneHandles && <clone_buttons_1.CloneButtons bounds={bounds} targetSize={targetSize} size={size}/>}
          {!hideBindingHandles && (<link_handle_1.LinkHandle targetSize={targetSize} size={size} bounds={bounds} isHidden={!showEdgeHandles}/>)}
        </svg_container_1.SVGContainer>
      </container_1.Container>);
});
