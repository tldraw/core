"use strict";
exports.__esModule = true;
exports.Binding = void 0;
var React = require("react");
function Binding(_a) {
    var _b = _a.point, x = _b[0], y = _b[1], type = _a.type;
    return (<g pointerEvents="none">
      {type === 'center' && <circle className="tl-binding" cx={x} cy={y} r={8}/>}
      {type !== 'pin' && <use className="tl-binding" href="#cross" x={x} y={y}/>}
    </g>);
}
exports.Binding = Binding;
