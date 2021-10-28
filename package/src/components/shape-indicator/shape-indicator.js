"use strict";
exports.__esModule = true;
exports.ShapeIndicator = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var _hooks_1 = require("+hooks");
exports.ShapeIndicator = React.memo(function (_a) {
    var _b = _a.isHovered, isHovered = _b === void 0 ? false : _b, _c = _a.isSelected, isSelected = _c === void 0 ? false : _c, shape = _a.shape, color = _a.color, meta = _a.meta;
    var shapeUtils = (0, _hooks_1.useTLContext)().shapeUtils;
    var utils = shapeUtils[shape.type];
    var bounds = utils.getBounds(shape);
    var rPositioned = (0, _hooks_1.usePosition)(bounds, shape.rotation);
    return (<div ref={rPositioned} className={'tl-indicator tl-absolute ' + (color ? '' : isSelected ? 'tl-selected' : 'tl-hovered')}>
        <svg width="100%" height="100%">
          <g className="tl-centered-g" stroke={color}>
            <utils.Indicator shape={shape} meta={meta} isSelected={isSelected} isHovered={isHovered}/>
          </g>
        </svg>
      </div>);
});
