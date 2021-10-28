"use strict";
exports.__esModule = true;
exports.CenterHandle = void 0;
var React = require("react");
exports.CenterHandle = React.memo(function (_a) {
    var bounds = _a.bounds, isLocked = _a.isLocked, isHidden = _a.isHidden;
    return (<rect className={isLocked ? 'tl-bounds-center tl-dashed' : 'tl-bounds-center'} x={-1} y={-1} width={bounds.width + 2} height={bounds.height + 2} opacity={isHidden ? 0 : 1} pointerEvents="none"/>);
});
