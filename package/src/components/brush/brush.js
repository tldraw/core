"use strict";
exports.__esModule = true;
exports.Brush = void 0;
var _components_1 = require("+components");
var container_1 = require("+components/container");
var React = require("react");
exports.Brush = React.memo(function (_a) {
    var brush = _a.brush;
    return (<container_1.Container bounds={brush} rotation={0}>
      <_components_1.SVGContainer>
        <rect className="tl-brush" opacity={1} x={0} y={0} width={brush.width} height={brush.height}/>
      </_components_1.SVGContainer>
    </container_1.Container>);
});
