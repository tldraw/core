"use strict";
exports.__esModule = true;
exports.SnapLine = exports.SnapLines = void 0;
var React = require("react");
var _utils_1 = require("+utils");
function SnapLines(_a) {
    var snapLines = _a.snapLines;
    return (<>
      {snapLines.map(function (snapLine, i) { return (<SnapLine key={i} snapLine={snapLine}/>); })}
    </>);
}
exports.SnapLines = SnapLines;
function SnapLine(_a) {
    var snapLine = _a.snapLine;
    var bounds = _utils_1["default"].getBoundsFromPoints(snapLine);
    return (<>
      <line className="tl-snap-line" x1={bounds.minX} y1={bounds.minY} x2={bounds.maxX} y2={bounds.maxY}/>
      {snapLine.map(function (_a, i) {
            var x = _a[0], y = _a[1];
            return (<use key={i} href="#tl-snap-point" x={x} y={y}/>);
        })}
    </>);
}
exports.SnapLine = SnapLine;
