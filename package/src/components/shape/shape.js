"use strict";
exports.__esModule = true;
exports.Shape = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
var _hooks_1 = require("+hooks");
var rendered_shape_1 = require("./rendered-shape");
var container_1 = require("+components/container");
var _hooks_2 = require("+hooks");
var useForceUpdate_1 = require("+hooks/useForceUpdate");
exports.Shape = React.memo(function (_a) {
    var shape = _a.shape, utils = _a.utils, isEditing = _a.isEditing, isBinding = _a.isBinding, isHovered = _a.isHovered, isSelected = _a.isSelected, isCurrentParent = _a.isCurrentParent, meta = _a.meta;
    var callbacks = (0, _hooks_2.useTLContext)().callbacks;
    var bounds = utils.getBounds(shape);
    var events = (0, _hooks_1.useShapeEvents)(shape.id, isCurrentParent);
    (0, useForceUpdate_1.useForceUpdate)();
    return (<container_1.Container id={shape.id} bounds={bounds} rotation={shape.rotation}>
        <rendered_shape_1.RenderedShape shape={shape} isBinding={isBinding} isCurrentParent={isCurrentParent} isEditing={isEditing} isHovered={isHovered} isSelected={isSelected} utils={utils} meta={meta} events={events} onShapeChange={callbacks.onShapeChange} onShapeBlur={callbacks.onShapeBlur}/>
      </container_1.Container>);
});
