"use strict";
exports.__esModule = true;
exports.RotateHandle = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
exports.RotateHandle = React.memo(function (_a) {
    var bounds = _a.bounds, targetSize = _a.targetSize, size = _a.size, isHidden = _a.isHidden;
    var events = (0, _hooks_1.useBoundsHandleEvents)('rotate');
    return (<g cursor="grab" opacity={isHidden ? 0 : 1}>
        <circle className="tl-transparent" cx={bounds.width / 2} cy={size * -2} r={targetSize} pointerEvents={isHidden ? 'none' : 'all'} {...events}/>
        <circle className="tl-rotate-handle" cx={bounds.width / 2} cy={size * -2} r={size / 2} pointerEvents="none"/>
      </g>);
});
