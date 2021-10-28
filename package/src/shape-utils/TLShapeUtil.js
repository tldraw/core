"use strict";
exports.__esModule = true;
exports.TLShapeUtil = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var _utils_1 = require("+utils");
var intersect_1 = require("@tldraw/intersect");
var TLShapeUtil = /** @class */ (function () {
    function TLShapeUtil() {
        var _this = this;
        this.refMap = new Map();
        this.boundsCache = new WeakMap();
        this.canEdit = false;
        this.canBind = false;
        this.canClone = false;
        this.showBounds = true;
        this.isStateful = false;
        this.isAspectRatioLocked = false;
        this.shouldRender = function () { return true; };
        this.getRef = function (shape) {
            if (!_this.refMap.has(shape.id)) {
                _this.refMap.set(shape.id, React.createRef());
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return _this.refMap.get(shape.id);
        };
        this.hitTest = function (shape, point) {
            var bounds = _this.getBounds(shape);
            return shape.rotation
                ? _utils_1["default"].pointInPolygon(point, _utils_1["default"].getRotatedCorners(bounds, shape.rotation))
                : _utils_1["default"].pointInBounds(point, bounds);
        };
        this.hitTestBounds = function (shape, bounds) {
            var shapeBounds = _this.getBounds(shape);
            if (!shape.rotation) {
                return (_utils_1["default"].boundsContain(bounds, shapeBounds) ||
                    _utils_1["default"].boundsContain(shapeBounds, bounds) ||
                    _utils_1["default"].boundsCollide(shapeBounds, bounds));
            }
            var corners = _utils_1["default"].getRotatedCorners(shapeBounds, shape.rotation);
            return (corners.every(function (point) { return _utils_1["default"].pointInBounds(point, bounds); }) ||
                (0, intersect_1.intersectPolylineBounds)(corners, bounds).length > 0);
        };
        this.getRotatedBounds = function (shape) {
            return _utils_1["default"].getBoundsFromPoints(_utils_1["default"].getRotatedCorners(_this.getBounds(shape), shape.rotation));
        };
    }
    return TLShapeUtil;
}());
exports.TLShapeUtil = TLShapeUtil;
