"use strict";
exports.__esModule = true;
exports.Handles = void 0;
var React = require("react");
var vec_1 = require("@tldraw/vec");
var handle_1 = require("./handle");
exports.Handles = React.memo(function (_a) {
    var shape = _a.shape, zoom = _a.zoom;
    if (shape.handles === undefined) {
        return null;
    }
    var prev = null;
    var handlesToShow = Object.values(shape.handles).reduce(function (acc, cur) {
        var point = vec_1.Vec.add(cur.point, shape.point);
        if (!prev || vec_1.Vec.dist(point, prev) * zoom >= 32) {
            acc.push(cur);
            prev = point;
        }
        return acc;
    }, []);
    if (handlesToShow.length === 1)
        return null;
    return (<>
      {handlesToShow.map(function (handle) { return (<handle_1.Handle key={shape.id + '_' + handle.id} id={handle.id} point={vec_1.Vec.add(handle.point, shape.point)}/>); })}
    </>);
});
