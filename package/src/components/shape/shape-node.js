"use strict";
exports.__esModule = true;
exports.ShapeNode = void 0;
var React = require("react");
var shape_1 = require("./shape");
exports.ShapeNode = React.memo(function (_a) {
    var shape = _a.shape, utils = _a.utils, children = _a.children, isEditing = _a.isEditing, isBinding = _a.isBinding, isHovered = _a.isHovered, isSelected = _a.isSelected, isCurrentParent = _a.isCurrentParent, meta = _a.meta;
    return (<>
        <shape_1.Shape shape={shape} isEditing={isEditing} isBinding={isBinding} isHovered={isHovered} isSelected={isSelected} isCurrentParent={isCurrentParent} utils={utils[shape.type]} meta={meta}/>
        {children &&
            children.map(function (childNode) { return (<exports.ShapeNode key={childNode.shape.id} utils={utils} {...childNode}/>); })}
      </>);
});
