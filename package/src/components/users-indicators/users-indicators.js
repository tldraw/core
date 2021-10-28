"use strict";
exports.__esModule = true;
exports.UsersIndicators = void 0;
var React = require("react");
/* eslint-disable @typescript-eslint/no-explicit-any */
var shape_indicator_1 = require("+components/shape-indicator");
var _utils_1 = require("+utils");
var _hooks_1 = require("+hooks");
function UsersIndicators(_a) {
    var userId = _a.userId, users = _a.users, meta = _a.meta, page = _a.page;
    var shapeUtils = (0, _hooks_1.useTLContext)().shapeUtils;
    return (<>
      {Object.values(users)
            .filter(Boolean)
            .filter(function (user) { return user.id !== userId && user.selectedIds.length > 0; })
            .map(function (user) {
            var shapes = user.selectedIds.map(function (id) { return page.shapes[id]; }).filter(Boolean);
            if (shapes.length === 0)
                return null;
            var bounds = _utils_1["default"].getCommonBounds(shapes.map(function (shape) { return shapeUtils[shape.type].getBounds(shape); }));
            return (<React.Fragment key={user.id + '_shapes'}>
              <div className="tl-absolute tl-user-indicator-bounds" style={{
                    backgroundColor: user.color + '0d',
                    borderColor: user.color + '78',
                    transform: "translate(" + bounds.minX + "px, " + bounds.minY + "px)",
                    width: bounds.width,
                    height: bounds.height,
                    pointerEvents: 'none'
                }}/>
              {shapes.map(function (shape) { return (<shape_indicator_1.ShapeIndicator key={user.id + "_" + shape.id + "_indicator"} shape={shape} color={user.color} meta={meta} isHovered/>); })}
            </React.Fragment>);
        })}
    </>);
}
exports.UsersIndicators = UsersIndicators;
