"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* --------------------- Primary -------------------- */
exports.__esModule = true;
exports.SnapPoints = exports.TLBoundsCorner = exports.TLBoundsEdge = void 0;
var TLBoundsEdge;
(function (TLBoundsEdge) {
    TLBoundsEdge["Top"] = "top_edge";
    TLBoundsEdge["Right"] = "right_edge";
    TLBoundsEdge["Bottom"] = "bottom_edge";
    TLBoundsEdge["Left"] = "left_edge";
})(TLBoundsEdge = exports.TLBoundsEdge || (exports.TLBoundsEdge = {}));
var TLBoundsCorner;
(function (TLBoundsCorner) {
    TLBoundsCorner["TopLeft"] = "top_left_corner";
    TLBoundsCorner["TopRight"] = "top_right_corner";
    TLBoundsCorner["BottomRight"] = "bottom_right_corner";
    TLBoundsCorner["BottomLeft"] = "bottom_left_corner";
})(TLBoundsCorner = exports.TLBoundsCorner || (exports.TLBoundsCorner = {}));
var SnapPoints;
(function (SnapPoints) {
    SnapPoints["minX"] = "minX";
    SnapPoints["midX"] = "midX";
    SnapPoints["maxX"] = "maxX";
    SnapPoints["minY"] = "minY";
    SnapPoints["midY"] = "midY";
    SnapPoints["maxY"] = "maxY";
})(SnapPoints = exports.SnapPoints || (exports.SnapPoints = {}));
