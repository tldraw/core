"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.inputs = exports.Inputs = void 0;
var utils_1 = require("./utils");
var vec_1 = require("@tldraw/vec");
var DOUBLE_CLICK_DURATION = 250;
var Inputs = /** @class */ (function () {
    function Inputs() {
        var _this = this;
        this.keys = {};
        this.isPinching = false;
        this.bounds = {
            minX: 0,
            maxX: 640,
            minY: 0,
            maxY: 480,
            width: 640,
            height: 480
        };
        this.zoom = 1;
        this.pointerUpTime = 0;
        this.panStart = function (e) {
            var _a, _b;
            var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
            var info = {
                target: 'wheel',
                pointerId: ((_a = _this.pointer) === null || _a === void 0 ? void 0 : _a.pointerId) || 0,
                origin: ((_b = _this.pointer) === null || _b === void 0 ? void 0 : _b.origin) || [0, 0],
                delta: [0, 0],
                pressure: 0.5,
                point: Inputs.getPoint(e, _this.bounds),
                shiftKey: shiftKey,
                ctrlKey: ctrlKey,
                metaKey: metaKey,
                altKey: altKey,
                spaceKey: _this.keys[' ']
            };
            _this.pointer = info;
            return info;
        };
        this.pan = function (delta, e) {
            if (!_this.pointer || _this.pointer.target !== 'wheel') {
                return _this.panStart(e);
            }
            var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
            var prev = _this.pointer;
            var point = Inputs.getPoint(e, _this.bounds);
            var info = __assign(__assign({}, prev), { target: 'wheel', delta: delta, point: point, shiftKey: shiftKey, ctrlKey: ctrlKey, metaKey: metaKey, altKey: altKey, spaceKey: _this.keys[' '] });
            _this.pointer = info;
            return info;
        };
        this.keydown = function (e) {
            var _a, _b;
            var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
            _this.keys[e.key] = true;
            return {
                point: ((_a = _this.pointer) === null || _a === void 0 ? void 0 : _a.point) || [0, 0],
                origin: ((_b = _this.pointer) === null || _b === void 0 ? void 0 : _b.origin) || [0, 0],
                key: e.key,
                keys: Object.keys(_this.keys),
                shiftKey: shiftKey,
                ctrlKey: ctrlKey,
                metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
                altKey: altKey
            };
        };
        this.keyup = function (e) {
            var _a, _b;
            var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
            delete _this.keys[e.key];
            return {
                point: ((_a = _this.pointer) === null || _a === void 0 ? void 0 : _a.point) || [0, 0],
                origin: ((_b = _this.pointer) === null || _b === void 0 ? void 0 : _b.origin) || [0, 0],
                key: e.key,
                keys: Object.keys(_this.keys),
                shiftKey: shiftKey,
                ctrlKey: ctrlKey,
                metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
                altKey: altKey
            };
        };
    }
    Inputs.prototype.pointerIsValid = function (e) {
        if ('pointerId' in e) {
            if (this.activePointer && this.activePointer !== e.pointerId)
                return false;
        }
        if ('touches' in e) {
            var touch = e.changedTouches[0];
            if (this.activePointer && this.activePointer !== touch.identifier)
                return false;
        }
        return true;
    };
    Inputs.prototype.touchStart = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var touch = e.changedTouches[0];
        this.activePointer = touch.identifier;
        var info = {
            target: target,
            pointerId: touch.identifier,
            origin: Inputs.getPoint(touch, this.bounds),
            delta: [0, 0],
            point: Inputs.getPoint(touch, this.bounds),
            pressure: Inputs.getPressure(touch),
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
            altKey: altKey,
            spaceKey: this.keys[' ']
        };
        this.pointer = info;
        return info;
    };
    Inputs.prototype.touchEnd = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var touch = e.changedTouches[0];
        var info = {
            target: target,
            pointerId: touch.identifier,
            origin: Inputs.getPoint(touch, this.bounds),
            delta: [0, 0],
            point: Inputs.getPoint(touch, this.bounds),
            pressure: Inputs.getPressure(touch),
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
            altKey: altKey,
            spaceKey: this.keys[' ']
        };
        this.pointer = info;
        this.activePointer = undefined;
        return info;
    };
    Inputs.prototype.touchMove = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var touch = e.changedTouches[0];
        var prev = this.pointer;
        var point = Inputs.getPoint(touch, this.bounds);
        var delta = (prev === null || prev === void 0 ? void 0 : prev.point) ? vec_1.Vec.sub(point, prev.point) : [0, 0];
        var info = __assign(__assign({ origin: point }, prev), { target: target, pointerId: touch.identifier, point: point, delta: delta, pressure: Inputs.getPressure(touch), shiftKey: shiftKey, ctrlKey: ctrlKey, metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey, altKey: altKey, spaceKey: this.keys[' '] });
        this.pointer = info;
        return info;
    };
    Inputs.prototype.pointerDown = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var point = Inputs.getPoint(e, this.bounds);
        this.activePointer = e.pointerId;
        var info = {
            target: target,
            pointerId: e.pointerId,
            origin: point,
            point: point,
            delta: [0, 0],
            pressure: Inputs.getPressure(e),
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
            altKey: altKey,
            spaceKey: this.keys[' ']
        };
        this.pointer = info;
        return info;
    };
    Inputs.prototype.pointerEnter = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var point = Inputs.getPoint(e, this.bounds);
        var info = {
            target: target,
            pointerId: e.pointerId,
            origin: point,
            delta: [0, 0],
            point: point,
            pressure: Inputs.getPressure(e),
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
            altKey: altKey,
            spaceKey: this.keys[' ']
        };
        this.pointer = info;
        return info;
    };
    Inputs.prototype.pointerMove = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var prev = this.pointer;
        var point = Inputs.getPoint(e, this.bounds);
        var delta = (prev === null || prev === void 0 ? void 0 : prev.point) ? vec_1.Vec.sub(point, prev.point) : [0, 0];
        var info = __assign(__assign({ origin: point }, prev), { target: target, pointerId: e.pointerId, point: point, delta: delta, pressure: Inputs.getPressure(e), shiftKey: shiftKey, ctrlKey: ctrlKey, metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey, altKey: altKey, spaceKey: this.keys[' '] });
        this.pointer = info;
        return info;
    };
    Inputs.prototype.pointerUp = function (e, target) {
        var shiftKey = e.shiftKey, ctrlKey = e.ctrlKey, metaKey = e.metaKey, altKey = e.altKey;
        var prev = this.pointer;
        var point = Inputs.getPoint(e, this.bounds);
        var delta = (prev === null || prev === void 0 ? void 0 : prev.point) ? vec_1.Vec.sub(point, prev.point) : [0, 0];
        this.activePointer = undefined;
        var info = __assign(__assign({ origin: point }, prev), { target: target, pointerId: e.pointerId, point: point, delta: delta, pressure: Inputs.getPressure(e), shiftKey: shiftKey, ctrlKey: ctrlKey, metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey, altKey: altKey, spaceKey: this.keys[' '] });
        this.pointer = info;
        this.pointerUpTime = Date.now();
        return info;
    };
    Inputs.prototype.isDoubleClick = function () {
        if (!this.pointer)
            return false;
        var _a = this.pointer, origin = _a.origin, point = _a.point;
        return Date.now() - this.pointerUpTime < DOUBLE_CLICK_DURATION && vec_1.Vec.dist(origin, point) < 4;
    };
    Inputs.prototype.clear = function () {
        this.pointer = undefined;
    };
    Inputs.prototype.resetDoubleClick = function () {
        this.pointerUpTime = 0;
    };
    Inputs.prototype.pinch = function (point, origin) {
        var _a = this.keys, shiftKey = _a.shiftKey, ctrlKey = _a.ctrlKey, metaKey = _a.metaKey, altKey = _a.altKey;
        var delta = vec_1.Vec.sub(origin, point);
        var info = {
            pointerId: 0,
            target: 'pinch',
            origin: origin,
            delta: delta,
            point: vec_1.Vec.sub(vec_1.Vec.round(point), [this.bounds.minX, this.bounds.minY]),
            pressure: 0.5,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey,
            metaKey: utils_1.Utils.isDarwin() ? metaKey : ctrlKey,
            altKey: altKey,
            spaceKey: this.keys[' ']
        };
        this.pointer = info;
        return info;
    };
    Inputs.prototype.reset = function () {
        this.pointerUpTime = 0;
        this.pointer = undefined;
        this.keyboard = undefined;
        this.activePointer = undefined;
        this.keys = {};
    };
    Inputs.getPoint = function (e, bounds) {
        return [+e.clientX.toFixed(2) - bounds.minX, +e.clientY.toFixed(2) - bounds.minY];
    };
    Inputs.getPressure = function (e) {
        return 'pressure' in e ? +e.pressure.toFixed(2) || 0.5 : 0.5;
    };
    Inputs.commandKey = function () {
        return utils_1.Utils.isDarwin() ? '⌘' : 'Ctrl';
    };
    return Inputs;
}());
exports.Inputs = Inputs;
exports.inputs = new Inputs();
