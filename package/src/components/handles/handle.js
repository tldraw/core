"use strict";
exports.__esModule = true;
exports.Handle = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
var container_1 = require("+components/container");
var _utils_1 = require("+utils");
var svg_container_1 = require("+components/svg-container");
exports.Handle = React.memo(function (_a) {
    var id = _a.id, point = _a.point;
    var events = (0, _hooks_1.useHandleEvents)(id);
    return (<container_1.Container bounds={_utils_1["default"].translateBounds({
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            width: 0,
            height: 0
        }, point)}>
      <svg_container_1.SVGContainer>
        <g className="tl-handle" {...events}>
          <circle className="tl-handle-bg" pointerEvents="all"/>
          <circle className="tl-counter-scaled tl-handle" pointerEvents="none" r={4}/>
        </g>
      </svg_container_1.SVGContainer>
    </container_1.Container>);
});
