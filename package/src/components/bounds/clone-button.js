"use strict";
exports.__esModule = true;
exports.CloneButton = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
var ROTATIONS = {
    right: 0,
    bottomRight: 45,
    bottom: 90,
    bottomLeft: 135,
    left: 180,
    topLeft: 225,
    top: 270,
    topRight: 315
};
function CloneButton(_a) {
    var bounds = _a.bounds, side = _a.side, targetSize = _a.targetSize, size = _a.size;
    var x = {
        left: -44,
        topLeft: -44,
        bottomLeft: -44,
        right: bounds.width + 44,
        topRight: bounds.width + 44,
        bottomRight: bounds.width + 44,
        top: bounds.width / 2,
        bottom: bounds.width / 2
    }[side];
    var y = {
        left: bounds.height / 2,
        right: bounds.height / 2,
        top: -44,
        topLeft: -44,
        topRight: -44,
        bottom: bounds.height + 44,
        bottomLeft: bounds.height + 44,
        bottomRight: bounds.height + 44
    }[side];
    var _b = (0, _hooks_1.useTLContext)(), callbacks = _b.callbacks, inputs = _b.inputs;
    var handleClick = React.useCallback(function (e) {
        var _a;
        e.stopPropagation();
        var info = inputs.pointerDown(e, side);
        (_a = callbacks.onShapeClone) === null || _a === void 0 ? void 0 : _a.call(callbacks, info, e);
    }, [callbacks.onShapeClone]);
    return (<g className="tl-clone-target" transform={"translate(" + x + ", " + y + ")"}>
      <rect className="tl-transparent" width={targetSize * 4} height={targetSize * 4} x={-targetSize * 2} y={-targetSize * 2}/>
      <g className="tl-clone-button-target" onPointerDown={handleClick} transform={"rotate(" + ROTATIONS[side] + ")"}>
        <circle className="tl-transparent " r={targetSize}/>
        <path className="tl-clone-button" d={"M -" + size / 2 + ",-" + size / 2 + " L " + size / 2 + ",0 -" + size / 2 + "," + size / 2 + " Z"} strokeLinejoin="round"/>
      </g>
    </g>);
}
exports.CloneButton = CloneButton;
