"use strict";
exports.__esModule = true;
exports.BoundsBg = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
var React = require("react");
var _hooks_1 = require("+hooks");
var container_1 = require("+components/container");
var svg_container_1 = require("+components/svg-container");
exports.BoundsBg = React.memo(function (_a) {
    var bounds = _a.bounds, rotation = _a.rotation, isHidden = _a.isHidden;
    var events = (0, _hooks_1.useBoundsEvents)();
    return (<container_1.Container bounds={bounds} rotation={rotation}>
      <svg_container_1.SVGContainer>
        <rect className="tl-bounds-bg" width={bounds.width} height={bounds.height} opacity={isHidden ? 0 : 1} {...events}/>
      </svg_container_1.SVGContainer>
    </container_1.Container>);
});
