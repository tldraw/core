"use strict";
var _a;
exports.__esModule = true;
exports.EdgeHandle = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
var _types_1 = require("+types");
var edgeClassnames = (_a = {},
    _a[_types_1.TLBoundsEdge.Top] = 'tl-cursor-ns',
    _a[_types_1.TLBoundsEdge.Right] = 'tl-cursor-ew',
    _a[_types_1.TLBoundsEdge.Bottom] = 'tl-cursor-ns',
    _a[_types_1.TLBoundsEdge.Left] = 'tl-cursor-ew',
    _a);
exports.EdgeHandle = React.memo(function (_a) {
    var size = _a.size, isHidden = _a.isHidden, bounds = _a.bounds, edge = _a.edge;
    var events = (0, _hooks_1.useBoundsHandleEvents)(edge);
    var isHorizontal = edge === _types_1.TLBoundsEdge.Top || edge === _types_1.TLBoundsEdge.Bottom;
    var isFarEdge = edge === _types_1.TLBoundsEdge.Right || edge === _types_1.TLBoundsEdge.Bottom;
    var height = bounds.height, width = bounds.width;
    return (<rect pointerEvents={isHidden ? 'none' : 'all'} className={'tl-transparent tl-edge-handle ' + (isHidden ? '' : edgeClassnames[edge])} opacity={isHidden ? 0 : 1} x={isHorizontal ? size / 2 : (isFarEdge ? width + 1 : -1) - size / 2} y={isHorizontal ? (isFarEdge ? height + 1 : -1) - size / 2 : size / 2} width={isHorizontal ? Math.max(0, width + 1 - size) : size} height={isHorizontal ? size : Math.max(0, height + 1 - size)} {...events}/>);
});
