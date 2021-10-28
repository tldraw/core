"use strict";
exports.__esModule = true;
exports.RenderedShape = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
exports.RenderedShape = React.memo(function (_a) {
    var shape = _a.shape, utils = _a.utils, isEditing = _a.isEditing, isBinding = _a.isBinding, isHovered = _a.isHovered, isSelected = _a.isSelected, isCurrentParent = _a.isCurrentParent, onShapeChange = _a.onShapeChange, onShapeBlur = _a.onShapeBlur, events = _a.events, meta = _a.meta;
    var ref = utils.getRef(shape);
    // consider using layout effect to update bounds cache if the ref is filled
    return (<utils.Component ref={ref} shape={shape} isEditing={isEditing} isBinding={isBinding} isHovered={isHovered} isSelected={isSelected} isCurrentParent={isCurrentParent} meta={meta} events={events} onShapeChange={onShapeChange} onShapeBlur={onShapeBlur}/>);
}, function (prev, next) {
    // If these have changed, then definitely render
    if (prev.isHovered !== next.isHovered ||
        prev.isSelected !== next.isSelected ||
        prev.isEditing !== next.isEditing ||
        prev.isBinding !== next.isBinding ||
        prev.meta !== next.meta ||
        prev.isCurrentParent !== next.isCurrentParent) {
        return false;
    }
    // If not, and if the shape has changed, ask the shape's class
    // whether it should render
    if (next.shape !== prev.shape) {
        return !next.utils.shouldRender(next.shape, prev.shape);
    }
    return true;
});
