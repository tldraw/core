"use strict";
var _a;
exports.__esModule = true;
exports.CornerHandle = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
var _types_1 = require("+types");
var cornerBgClassnames = (_a = {},
    _a[_types_1.TLBoundsCorner.TopLeft] = 'tl-cursor-nwse',
    _a[_types_1.TLBoundsCorner.TopRight] = 'tl-cursor-nesw',
    _a[_types_1.TLBoundsCorner.BottomRight] = 'tl-cursor-nwse',
    _a[_types_1.TLBoundsCorner.BottomLeft] = 'tl-cursor-nesw',
    _a);
exports.CornerHandle = React.memo(function (_a) {
    var size = _a.size, targetSize = _a.targetSize, isHidden = _a.isHidden, corner = _a.corner, bounds = _a.bounds;
    var events = (0, _hooks_1.useBoundsHandleEvents)(corner);
    var isTop = corner === _types_1.TLBoundsCorner.TopLeft || corner === _types_1.TLBoundsCorner.TopRight;
    var isLeft = corner === _types_1.TLBoundsCorner.TopLeft || corner === _types_1.TLBoundsCorner.BottomLeft;
    return (<g opacity={isHidden ? 0 : 1}>
        <rect className={'tl-transparent ' + (isHidden ? '' : cornerBgClassnames[corner])} x={(isLeft ? -1 : bounds.width + 1) - targetSize} y={(isTop ? -1 : bounds.height + 1) - targetSize} width={targetSize * 2} height={targetSize * 2} pointerEvents={isHidden ? 'none' : 'all'} {...events}/>
        <rect className="tl-corner-handle" x={(isLeft ? -1 : bounds.width + 1) - size / 2} y={(isTop ? -1 : bounds.height + 1) - size / 2} width={size} height={size} pointerEvents="none"/>
      </g>);
});
