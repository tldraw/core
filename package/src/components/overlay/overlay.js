"use strict";
exports.__esModule = true;
exports.Overlay = void 0;
var React = require("react");
function Overlay(_a) {
    var camera = _a.camera, children = _a.children;
    var l = 2.5 / camera.zoom;
    return (<svg className="tl-overlay">
      <defs>
        <g id="tl-snap-point">
          <path className="tl-snap-point" d={"M " + -l + "," + -l + " L " + l + "," + l + " M " + -l + "," + l + " L " + l + "," + -l}/>
        </g>
      </defs>
      <g transform={"scale(" + camera.zoom + ") translate(" + camera.point + ")"}>{children}</g>
    </svg>);
}
exports.Overlay = Overlay;
