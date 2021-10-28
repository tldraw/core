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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Utils = void 0;
var types_1 = require("../types");
var vec_1 = require("@tldraw/vec");
require("./polyfills");
var TAU = Math.PI * 2;
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /* -------------------------------------------------- */
    /*                    Math & Geometry                 */
    /* -------------------------------------------------- */
    Utils.filterObject = function (obj, fn) {
        return Object.fromEntries(Object.entries(obj).filter(fn));
    };
    /**
     * Linear interpolation betwen two numbers.
     * @param y1
     * @param y2
     * @param mu
     */
    Utils.lerp = function (y1, y2, mu) {
        mu = Utils.clamp(mu, 0, 1);
        return y1 * (1 - mu) + y2 * mu;
    };
    /**
     * Linear interpolation between two colors.
     *
     * ### Example
     *
     *```ts
     * lerpColor("#000000", "#0099FF", .25)
     *```
     */
    Utils.lerpColor = function (color1, color2, factor) {
        if (factor === void 0) { factor = 0.5; }
        function h2r(hex) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
        }
        function r2h(rgb) {
            return '#' + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
        }
        var c1 = h2r(color1) || [0, 0, 0];
        var c2 = h2r(color2) || [0, 0, 0];
        var result = c1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (c2[i] - c1[i]));
        }
        return r2h(result);
    };
    /**
     * Modulate a value between two ranges.
     * @param value
     * @param rangeA from [low, high]
     * @param rangeB to [low, high]
     * @param clamp
     */
    Utils.modulate = function (value, rangeA, rangeB, clamp) {
        if (clamp === void 0) { clamp = false; }
        var fromLow = rangeA[0], fromHigh = rangeA[1];
        var v0 = rangeB[0], v1 = rangeB[1];
        var result = v0 + ((value - fromLow) / (fromHigh - fromLow)) * (v1 - v0);
        return clamp
            ? v0 < v1
                ? Math.max(Math.min(result, v1), v0)
                : Math.max(Math.min(result, v0), v1)
            : result;
    };
    Utils.clamp = function (n, min, max) {
        return Math.max(min, typeof max !== 'undefined' ? Math.min(n, max) : n);
    };
    // TODO: replace with a string compression algorithm
    Utils.compress = function (s) {
        return s;
    };
    // TODO: replace with a string decompression algorithm
    Utils.decompress = function (s) {
        return s;
    };
    /**
     * Recursively clone an object or array.
     * @param obj
     */
    Utils.deepClone = function (obj) {
        if (obj === null)
            return obj;
        if (Array.isArray(obj)) {
            return __spreadArray([], obj, true);
        }
        if (typeof obj === 'object') {
            var clone_1 = __assign({}, obj);
            Object.keys(clone_1).forEach(function (key) {
                return (clone_1[key] =
                    typeof obj[key] === 'object'
                        ? Utils.deepClone(obj[key])
                        : obj[key]);
            });
            return clone_1;
        }
        return obj;
    };
    /**
     * Seeded random number generator, using [xorshift](https://en.wikipedia.org/wiki/Xorshift).
     * The result will always be betweeen -1 and 1.
     *
     * Adapted from [seedrandom](https://github.com/davidbau/seedrandom).
     */
    Utils.rng = function (seed) {
        if (seed === void 0) { seed = ''; }
        var x = 0;
        var y = 0;
        var z = 0;
        var w = 0;
        function next() {
            var t = x ^ (x << 11);
            x = y;
            y = z;
            z = w;
            w ^= ((w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
            return w / 0x100000000;
        }
        for (var k = 0; k < seed.length + 64; k++) {
            x ^= seed.charCodeAt(k) | 0;
            next();
        }
        return next;
    };
    /* ---------------------- Boxes --------------------- */
    Utils.getRectangleSides = function (point, size, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var center = [point[0] + size[0] / 2, point[1] + size[1] / 2];
        var tl = vec_1.Vec.rotWith(point, center, rotation);
        var tr = vec_1.Vec.rotWith(vec_1.Vec.add(point, [size[0], 0]), center, rotation);
        var br = vec_1.Vec.rotWith(vec_1.Vec.add(point, size), center, rotation);
        var bl = vec_1.Vec.rotWith(vec_1.Vec.add(point, [0, size[1]]), center, rotation);
        return [
            ['top', [tl, tr]],
            ['right', [tr, br]],
            ['bottom', [br, bl]],
            ['left', [bl, tl]],
        ];
    };
    Utils.getBoundsSides = function (bounds) {
        return this.getRectangleSides([bounds.minX, bounds.minY], [bounds.width, bounds.height]);
    };
    Utils.shallowEqual = function (objA, objB) {
        if (objA === objB)
            return true;
        if (!objA || !objB)
            return false;
        var aKeys = Object.keys(objA);
        var bKeys = Object.keys(objB);
        var len = aKeys.length;
        if (bKeys.length !== len)
            return false;
        for (var i = 0; i < len; i++) {
            var key = aKeys[i];
            if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
                return false;
            }
        }
        return true;
    };
    /* --------------- Circles and Angles --------------- */
    /**
     * Get the outer of between a circle and a point.
     * @param C The circle's center.
     * @param r The circle's radius.
     * @param P The point.
     * @param side
     */
    Utils.getCircleTangentToPoint = function (C, r, P, side) {
        var B = vec_1.Vec.lrp(C, P, 0.5);
        var r1 = vec_1.Vec.dist(C, B);
        var delta = vec_1.Vec.sub(B, C);
        var d = vec_1.Vec.len(delta);
        if (!(d <= r + r1 && d >= Math.abs(r - r1))) {
            return null;
        }
        var a = (r * r - r1 * r1 + d * d) / (2.0 * d);
        var n = 1 / d;
        var p = vec_1.Vec.add(C, vec_1.Vec.mul(delta, a * n));
        var h = Math.sqrt(r * r - a * a);
        var k = vec_1.Vec.mul(vec_1.Vec.per(delta), h * n);
        return side === 0 ? vec_1.Vec.add(p, k) : vec_1.Vec.sub(p, k);
    };
    /**
     * Get outer tangents of two circles.
     * @param x0
     * @param y0
     * @param r0
     * @param x1
     * @param y1
     * @param r1
     * @returns [lx0, ly0, lx1, ly1, rx0, ry0, rx1, ry1]
     */
    Utils.getOuterTangentsOfCircles = function (C0, r0, C1, r1) {
        var a0 = vec_1.Vec.angle(C0, C1);
        var d = vec_1.Vec.dist(C0, C1);
        // Circles are overlapping, no tangents
        if (d < Math.abs(r1 - r0)) {
            return null;
        }
        var a1 = Math.acos((r0 - r1) / d);
        var t0 = a0 + a1;
        var t1 = a0 - a1;
        return [
            [C0[0] + r0 * Math.cos(t1), C0[1] + r0 * Math.sin(t1)],
            [C1[0] + r1 * Math.cos(t1), C1[1] + r1 * Math.sin(t1)],
            [C0[0] + r0 * Math.cos(t0), C0[1] + r0 * Math.sin(t0)],
            [C1[0] + r1 * Math.cos(t0), C1[1] + r1 * Math.sin(t0)],
        ];
    };
    /**
     * Get the closest point on the perimeter of a circle to a given point.
     * @param C The circle's center.
     * @param r The circle's radius.
     * @param P The point.
     */
    Utils.getClosestPointOnCircle = function (C, r, P) {
        var v = vec_1.Vec.sub(C, P);
        return vec_1.Vec.sub(C, vec_1.Vec.mul(vec_1.Vec.div(v, vec_1.Vec.len(v)), r));
    };
    /**
     * Get a circle from three points.
     * @param A
     * @param B
     * @param C
     * @returns [x, y, r]
     */
    Utils.circleFromThreePoints = function (A, B, C) {
        var x1 = A[0], y1 = A[1];
        var x2 = B[0], y2 = B[1];
        var x3 = C[0], y3 = C[1];
        var a = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
        var b = (x1 * x1 + y1 * y1) * (y3 - y2) +
            (x2 * x2 + y2 * y2) * (y1 - y3) +
            (x3 * x3 + y3 * y3) * (y2 - y1);
        var c = (x1 * x1 + y1 * y1) * (x2 - x3) +
            (x2 * x2 + y2 * y2) * (x3 - x1) +
            (x3 * x3 + y3 * y3) * (x1 - x2);
        var x = -b / (2 * a);
        var y = -c / (2 * a);
        return [x, y, Math.hypot(x - x1, y - y1)];
    };
    /**
     * Find the approximate perimeter of an ellipse.
     * @param rx
     * @param ry
     */
    Utils.perimeterOfEllipse = function (rx, ry) {
        var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
        var p = Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
        return p;
    };
    /**
     * Get the short angle distance between two angles.
     * @param a0
     * @param a1
     */
    Utils.shortAngleDist = function (a0, a1) {
        var max = Math.PI * 2;
        var da = (a1 - a0) % max;
        return ((2 * da) % max) - da;
    };
    /**
     * Get the long angle distance between two angles.
     * @param a0
     * @param a1
     */
    Utils.longAngleDist = function (a0, a1) {
        return Math.PI * 2 - Utils.shortAngleDist(a0, a1);
    };
    /**
     * Interpolate an angle between two angles.
     * @param a0
     * @param a1
     * @param t
     */
    Utils.lerpAngles = function (a0, a1, t) {
        return a0 + Utils.shortAngleDist(a0, a1) * t;
    };
    /**
     * Get the short distance between two angles.
     * @param a0
     * @param a1
     */
    Utils.angleDelta = function (a0, a1) {
        return Utils.shortAngleDist(a0, a1);
    };
    /**
     * Get the "sweep" or short distance between two points on a circle's perimeter.
     * @param C
     * @param A
     * @param B
     */
    Utils.getSweep = function (C, A, B) {
        return Utils.angleDelta(vec_1.Vec.angle(C, A), vec_1.Vec.angle(C, B));
    };
    /**
     * Rotate a point around a center.
     * @param x The x-axis coordinate of the point.
     * @param y The y-axis coordinate of the point.
     * @param cx The x-axis coordinate of the point to rotate round.
     * @param cy The y-axis coordinate of the point to rotate round.
     * @param angle The distance (in radians) to rotate.
     */
    Utils.rotatePoint = function (A, B, angle) {
        var s = Math.sin(angle);
        var c = Math.cos(angle);
        var px = A[0] - B[0];
        var py = A[1] - B[1];
        var nx = px * c - py * s;
        var ny = px * s + py * c;
        return [nx + B[0], ny + B[1]];
    };
    /**
     * Clamp radians within 0 and 2PI
     * @param r
     */
    Utils.clampRadians = function (r) {
        return (Math.PI * 2 + r) % (Math.PI * 2);
    };
    /**
     * Clamp rotation to even segments.
     * @param r
     * @param segments
     */
    Utils.snapAngleToSegments = function (r, segments) {
        var seg = (Math.PI * 2) / segments;
        return Math.floor((Utils.clampRadians(r) + seg / 2) / seg) * seg;
    };
    /**
     * Is angle c between angles a and b?
     * @param a
     * @param b
     * @param c
     */
    Utils.isAngleBetween = function (a, b, c) {
        if (c === a || c === b)
            return true;
        var AB = (b - a + TAU) % TAU;
        var AC = (c - a + TAU) % TAU;
        return AB <= Math.PI !== AC > AB;
    };
    /**
     * Convert degrees to radians.
     * @param d
     */
    Utils.degreesToRadians = function (d) {
        return (d * Math.PI) / 180;
    };
    /**
     * Convert radians to degrees.
     * @param r
     */
    Utils.radiansToDegrees = function (r) {
        return (r * 180) / Math.PI;
    };
    /**
     * Get the length of an arc between two points on a circle's perimeter.
     * @param C
     * @param r
     * @param A
     * @param B
     */
    Utils.getArcLength = function (C, r, A, B) {
        var sweep = Utils.getSweepFlag(C, A, B);
        return r * (2 * Math.PI) * (sweep / (2 * Math.PI));
    };
    Utils.getSweepFlag = function (A, B, C) {
        var angleAC = vec_1.Vec.angle(A, C);
        var angleAB = vec_1.Vec.angle(A, B);
        var angleCAB = ((angleAB - angleAC + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return angleCAB > 0 ? 0 : 1;
    };
    Utils.getLargeArcFlag = function (A, C, P) {
        var anglePA = vec_1.Vec.angle(P, A);
        var anglePC = vec_1.Vec.angle(P, C);
        var angleAPC = ((anglePC - anglePA + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Math.abs(angleAPC) > Math.PI / 2 ? 0 : 1;
    };
    /**
     * Get a dash offset for an arc, based on its length.
     * @param C
     * @param r
     * @param A
     * @param B
     * @param step
     */
    Utils.getArcDashOffset = function (C, r, A, B, step) {
        var del0 = Utils.getSweepFlag(C, A, B);
        var len0 = Utils.getArcLength(C, r, A, B);
        var off0 = del0 < 0 ? len0 : 2 * Math.PI * C[2] - len0;
        return -off0 / 2 + step;
    };
    /**
     * Get a dash offset for an ellipse, based on its length.
     * @param A
     * @param step
     */
    Utils.getEllipseDashOffset = function (A, step) {
        var c = 2 * Math.PI * A[2];
        return -c / 2 + -step;
    };
    /* --------------- Curves and Splines --------------- */
    /**
     * Get bezier curve segments that pass through an array of points.
     * @param points
     * @param tension
     */
    Utils.getTLBezierCurveSegments = function (points, tension) {
        if (tension === void 0) { tension = 0.4; }
        var len = points.length;
        var cpoints = __spreadArray([], points, true);
        if (len < 2) {
            throw Error('Curve must have at least two points.');
        }
        for (var i = 1; i < len - 1; i++) {
            var p0 = points[i - 1];
            var p1 = points[i];
            var p2 = points[i + 1];
            var pdx = p2[0] - p0[0];
            var pdy = p2[1] - p0[1];
            var pd = Math.hypot(pdx, pdy);
            var nx = pdx / pd; // normalized x
            var ny = pdy / pd; // normalized y
            var dp = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); // Distance to previous
            var dn = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]); // Distance to next
            cpoints[i] = [
                // tangent start
                p1[0] - nx * dp * tension,
                p1[1] - ny * dp * tension,
                // tangent end
                p1[0] + nx * dn * tension,
                p1[1] + ny * dn * tension,
                // normal
                nx,
                ny,
            ];
        }
        // TODO: Reflect the nearest control points, not average them
        var d0 = Math.hypot(points[0][0] + cpoints[1][0]);
        cpoints[0][2] = (points[0][0] + cpoints[1][0]) / 2;
        cpoints[0][3] = (points[0][1] + cpoints[1][1]) / 2;
        cpoints[0][4] = (cpoints[1][0] - points[0][0]) / d0;
        cpoints[0][5] = (cpoints[1][1] - points[0][1]) / d0;
        var d1 = Math.hypot(points[len - 1][1] + cpoints[len - 1][1]);
        cpoints[len - 1][0] = (points[len - 1][0] + cpoints[len - 2][2]) / 2;
        cpoints[len - 1][1] = (points[len - 1][1] + cpoints[len - 2][3]) / 2;
        cpoints[len - 1][4] = (cpoints[len - 2][2] - points[len - 1][0]) / -d1;
        cpoints[len - 1][5] = (cpoints[len - 2][3] - points[len - 1][1]) / -d1;
        var results = [];
        for (var i = 1; i < cpoints.length; i++) {
            results.push({
                start: points[i - 1].slice(0, 2),
                tangentStart: cpoints[i - 1].slice(2, 4),
                normalStart: cpoints[i - 1].slice(4, 6),
                pressureStart: 2 + ((i - 1) % 2 === 0 ? 1.5 : 0),
                end: points[i].slice(0, 2),
                tangentEnd: cpoints[i].slice(0, 2),
                normalEnd: cpoints[i].slice(4, 6),
                pressureEnd: 2 + (i % 2 === 0 ? 1.5 : 0)
            });
        }
        return results;
    };
    /**
     * Find a point along a curve segment, via pomax.
     * @param t
     * @param points [cpx1, cpy1, cpx2, cpy2, px, py][]
     */
    Utils.computePointOnCurve = function (t, points) {
        // shortcuts
        if (t === 0) {
            return points[0];
        }
        var order = points.length - 1;
        if (t === 1) {
            return points[order];
        }
        var mt = 1 - t;
        var p = points; // constant?
        if (order === 0) {
            return points[0];
        } // linear?
        if (order === 1) {
            return [mt * p[0][0] + t * p[1][0], mt * p[0][1] + t * p[1][1]];
        } // quadratic/cubic curve?
        // if (order < 4) {
        var mt2 = mt * mt;
        var t2 = t * t;
        var a;
        var b;
        var c;
        var d = 0;
        if (order === 2) {
            p = [p[0], p[1], p[2], [0, 0]];
            a = mt2;
            b = mt * t * 2;
            c = t2;
            // } else if (order === 3) {
        }
        else {
            a = mt2 * mt;
            b = mt2 * t * 3;
            c = mt * t2 * 3;
            d = t * t2;
        }
        return [
            a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
            a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
        ];
        // } // higher order curves: use de Casteljau's computation
    };
    /**
     * Evaluate a 2d cubic bezier at a point t on the x axis.
     * @param tx
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    Utils.cubicBezier = function (tx, x1, y1, x2, y2) {
        // Inspired by Don Lancaster's two articles
        // http://www.tinaja.com/glib/cubemath.pdf
        // http://www.tinaja.com/text/bezmath.html
        // Set start and end point
        var x0 = 0;
        var y0 = 0;
        var x3 = 1;
        var y3 = 1;
        // Convert the coordinates to equation space
        var A = x3 - 3 * x2 + 3 * x1 - x0;
        var B = 3 * x2 - 6 * x1 + 3 * x0;
        var C = 3 * x1 - 3 * x0;
        var D = x0;
        var E = y3 - 3 * y2 + 3 * y1 - y0;
        var F = 3 * y2 - 6 * y1 + 3 * y0;
        var G = 3 * y1 - 3 * y0;
        var H = y0;
        // Variables for the loop below
        var iterations = 5;
        var i;
        var slope;
        var x;
        var t = tx;
        // Loop through a few times to get a more accurate time value, according to the Newton-Raphson method
        // http://en.wikipedia.org/wiki/Newton's_method
        for (i = 0; i < iterations; i++) {
            // The curve's x equation for the current time value
            x = A * t * t * t + B * t * t + C * t + D;
            // The slope we want is the inverse of the derivate of x
            slope = 1 / (3 * A * t * t + 2 * B * t + C);
            // Get the next estimated time value, which will be more accurate than the one before
            t -= (x - tx) * slope;
            t = t > 1 ? 1 : t < 0 ? 0 : t;
        }
        // Find the y value through the curve's y equation, with the now more accurate time value
        return Math.abs(E * t * t * t + F * t * t + G * t * H);
    };
    /**
     * Get a bezier curve data for a spline that fits an array of points.
     * @param points An array of points formatted as [x, y]
     * @param k Tension
     */
    Utils.getSpline = function (pts, k) {
        if (k === void 0) { k = 0.5; }
        var p0;
        var p1 = pts[0], p2 = pts[1], p3 = pts[2];
        var results = [];
        for (var i = 1, len = pts.length; i < len; i++) {
            p0 = p1;
            p1 = p2;
            p2 = p3;
            p3 = pts[i + 2] ? pts[i + 2] : p2;
            results.push({
                cp1x: p1[0] + ((p2[0] - p0[0]) / 6) * k,
                cp1y: p1[1] + ((p2[1] - p0[1]) / 6) * k,
                cp2x: p2[0] - ((p3[0] - p1[0]) / 6) * k,
                cp2y: p2[1] - ((p3[1] - p1[1]) / 6) * k,
                px: pts[i][0],
                py: pts[i][1]
            });
        }
        return results;
    };
    /**
     * Get a bezier curve data for a spline that fits an array of points.
     * @param pts
     * @param tension
     * @param isClosed
     * @param numOfSegments
     */
    Utils.getCurvePoints = function (pts, tension, isClosed, numOfSegments) {
        if (tension === void 0) { tension = 0.5; }
        if (isClosed === void 0) { isClosed = false; }
        if (numOfSegments === void 0) { numOfSegments = 3; }
        var _pts = __spreadArray([], pts, true);
        var len = pts.length;
        var res = []; // results
        var t1x, // tension Vectors
        t2x, t1y, t2y, c1, // cardinal points
        c2, c3, c4, st, st2, st3;
        // The algorithm require a previous and next point to the actual point array.
        // Check if we will draw closed or open curve.
        // If closed, copy end points to beginning and first points to end
        // If open, duplicate first points to befinning, end points to end
        if (isClosed) {
            _pts.unshift(_pts[len - 1]);
            _pts.push(_pts[0]);
        }
        else {
            // copy 1. point and insert at beginning
            _pts.unshift(_pts[0]);
            _pts.push(_pts[len - 1]);
            // _pts.push(_pts[len - 1])
        }
        // For each point, calculate a segment
        for (var i = 1; i < _pts.length - 2; i++) {
            // Calculate points along segment and add to results
            for (var t = 0; t <= numOfSegments; t++) {
                // Step
                st = t / numOfSegments;
                st2 = Math.pow(st, 2);
                st3 = Math.pow(st, 3);
                // Cardinals
                c1 = 2 * st3 - 3 * st2 + 1;
                c2 = -(2 * st3) + 3 * st2;
                c3 = st3 - 2 * st2 + st;
                c4 = st3 - st2;
                // Tension
                t1x = (_pts[i + 1][0] - _pts[i - 1][0]) * tension;
                t2x = (_pts[i + 2][0] - _pts[i][0]) * tension;
                t1y = (_pts[i + 1][1] - _pts[i - 1][1]) * tension;
                t2y = (_pts[i + 2][1] - _pts[i][1]) * tension;
                // Control points
                res.push([
                    c1 * _pts[i][0] + c2 * _pts[i + 1][0] + c3 * t1x + c4 * t2x,
                    c1 * _pts[i][1] + c2 * _pts[i + 1][1] + c3 * t1y + c4 * t2y,
                ]);
            }
        }
        res.push(pts[pts.length - 1]);
        return res;
    };
    /**
     * Simplify a line (using Ramer-Douglas-Peucker algorithm).
     * @param points An array of points as [x, y, ...][]
     * @param tolerance The minimum line distance (also called epsilon).
     * @returns Simplified array as [x, y, ...][]
     */
    Utils.simplify = function (points, tolerance) {
        if (tolerance === void 0) { tolerance = 1; }
        var len = points.length;
        var a = points[0];
        var b = points[len - 1];
        var x1 = a[0], y1 = a[1];
        var x2 = b[0], y2 = b[1];
        if (len > 2) {
            var distance = 0;
            var index = 0;
            var max = Math.hypot(y2 - y1, x2 - x1);
            for (var i = 1; i < len - 1; i++) {
                var _a = points[i], x0 = _a[0], y0 = _a[1];
                var d = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / max;
                if (distance > d)
                    continue;
                distance = d;
                index = i;
            }
            if (distance > tolerance) {
                var l0 = Utils.simplify(points.slice(0, index + 1), tolerance);
                var l1 = Utils.simplify(points.slice(index + 1), tolerance);
                return l0.concat(l1.slice(1));
            }
        }
        return [a, b];
    };
    /**
     * Get whether a point is inside of a circle.
     * @param A
     * @param b
     * @returns
     */
    Utils.pointInCircle = function (A, C, r) {
        return vec_1.Vec.dist(A, C) <= r;
    };
    /**
     * Get whether a point is inside of an ellipse.
     * @param point
     * @param center
     * @param rx
     * @param ry
     * @param rotation
     * @returns
     */
    Utils.pointInEllipse = function (A, C, rx, ry, rotation) {
        if (rotation === void 0) { rotation = 0; }
        rotation = rotation || 0;
        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);
        var delta = vec_1.Vec.sub(A, C);
        var tdx = cos * delta[0] + sin * delta[1];
        var tdy = sin * delta[0] - cos * delta[1];
        return (tdx * tdx) / (rx * rx) + (tdy * tdy) / (ry * ry) <= 1;
    };
    /**
     * Get whether a point is inside of a rectangle.
     * @param point
     * @param size
     */
    Utils.pointInRect = function (point, size) {
        return !(point[0] < size[0] ||
            point[0] > point[0] + size[0] ||
            point[1] < size[1] ||
            point[1] > point[1] + size[1]);
    };
    Utils.pointInPolygon = function (p, points) {
        var wn = 0; // winding number
        points.forEach(function (a, i) {
            var b = points[(i + 1) % points.length];
            if (a[1] <= p[1]) {
                if (b[1] > p[1] && vec_1.Vec.cross(a, b, p) > 0) {
                    wn += 1;
                }
            }
            else if (b[1] <= p[1] && vec_1.Vec.cross(a, b, p) < 0) {
                wn -= 1;
            }
        });
        return wn !== 0;
    };
    /* --------------------- Bounds --------------------- */
    /**
     * Expand a bounding box by a delta.
     *
     * ### Example
     *
     *```ts
     * expandBounds(myBounds, [100, 100])
     *```
     */
    Utils.expandBounds = function (bounds, delta) {
        return {
            minX: bounds.minX - delta,
            minY: bounds.minY - delta,
            maxX: bounds.maxX + delta,
            maxY: bounds.maxY + delta,
            width: bounds.width + delta * 2,
            height: bounds.height + delta * 2
        };
    };
    /**
     * Get whether a point is inside of a bounds.
     * @param A
     * @param b
     * @returns
     */
    Utils.pointInBounds = function (A, b) {
        return !(A[0] < b.minX || A[0] > b.maxX || A[1] < b.minY || A[1] > b.maxY);
    };
    /**
     * Get whether two bounds collide.
     * @param a Bounds
     * @param b Bounds
     * @returns
     */
    Utils.boundsCollide = function (a, b) {
        return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY);
    };
    /**
     * Get whether the bounds of A contain the bounds of B. A perfect match will return true.
     * @param a Bounds
     * @param b Bounds
     * @returns
     */
    Utils.boundsContain = function (a, b) {
        return a.minX < b.minX && a.minY < b.minY && a.maxY > b.maxY && a.maxX > b.maxX;
    };
    /**
     * Get whether the bounds of A are contained by the bounds of B.
     * @param a Bounds
     * @param b Bounds
     * @returns
     */
    Utils.boundsContained = function (a, b) {
        return Utils.boundsContain(b, a);
    };
    /**
     * Get whether two bounds are identical.
     * @param a Bounds
     * @param b Bounds
     * @returns
     */
    Utils.boundsAreEqual = function (a, b) {
        return !(b.maxX !== a.maxX || b.minX !== a.minX || b.maxY !== a.maxY || b.minY !== a.minY);
    };
    /**
     * Find a bounding box from an array of points.
     * @param points
     * @param rotation (optional) The bounding box's rotation.
     */
    Utils.getBoundsFromPoints = function (points, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        if (points.length < 2) {
            minX = 0;
            minY = 0;
            maxX = 1;
            maxY = 1;
        }
        else {
            for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
                var _a = points_1[_i], x = _a[0], y = _a[1];
                minX = Math.min(x, minX);
                minY = Math.min(y, minY);
                maxX = Math.max(x, maxX);
                maxY = Math.max(y, maxY);
            }
        }
        if (rotation !== 0) {
            return Utils.getBoundsFromPoints(points.map(function (pt) { return vec_1.Vec.rotWith(pt, [(minX + maxX) / 2, (minY + maxY) / 2], rotation); }));
        }
        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: Math.max(1, maxX - minX),
            height: Math.max(1, maxY - minY)
        };
    };
    /**
     * Center a bounding box around a given point.
     * @param bounds
     * @param center
     */
    Utils.centerBounds = function (bounds, point) {
        var boundsCenter = this.getBoundsCenter(bounds);
        var dx = point[0] - boundsCenter[0];
        var dy = point[1] - boundsCenter[1];
        return this.translateBounds(bounds, [dx, dy]);
    };
    /**
     * Move a bounding box without recalculating it.
     * @param bounds
     * @param delta
     * @returns
     */
    Utils.translateBounds = function (bounds, delta) {
        return {
            minX: bounds.minX + delta[0],
            minY: bounds.minY + delta[1],
            maxX: bounds.maxX + delta[0],
            maxY: bounds.maxY + delta[1],
            width: bounds.width,
            height: bounds.height
        };
    };
    /**
     * Rotate a bounding box.
     * @param bounds
     * @param center
     * @param rotation
     */
    Utils.rotateBounds = function (bounds, center, rotation) {
        var _a = vec_1.Vec.rotWith([bounds.minX, bounds.minY], center, rotation), minX = _a[0], minY = _a[1];
        var _b = vec_1.Vec.rotWith([bounds.maxX, bounds.maxY], center, rotation), maxX = _b[0], maxY = _b[1];
        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY,
            width: bounds.width,
            height: bounds.height
        };
    };
    /**
     * Get the rotated bounds of an ellipse.
     * @param x
     * @param y
     * @param rx
     * @param ry
     * @param rotation
     */
    Utils.getRotatedEllipseBounds = function (x, y, rx, ry, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var c = Math.cos(rotation);
        var s = Math.sin(rotation);
        var w = Math.hypot(rx * c, ry * s);
        var h = Math.hypot(rx * s, ry * c);
        return {
            minX: x + rx - w,
            minY: y + ry - h,
            maxX: x + rx + w,
            maxY: y + ry + h,
            width: w * 2,
            height: h * 2
        };
    };
    /**
     * Get a bounding box that includes two bounding boxes.
     * @param a Bounding box
     * @param b Bounding box
     * @returns
     */
    Utils.getExpandedBounds = function (a, b) {
        var minX = Math.min(a.minX, b.minX);
        var minY = Math.min(a.minY, b.minY);
        var maxX = Math.max(a.maxX, b.maxX);
        var maxY = Math.max(a.maxY, b.maxY);
        var width = Math.abs(maxX - minX);
        var height = Math.abs(maxY - minY);
        return { minX: minX, minY: minY, maxX: maxX, maxY: maxY, width: width, height: height };
    };
    /**
     * Get the common bounds of a group of bounds.
     * @returns
     */
    Utils.getCommonBounds = function (bounds) {
        if (bounds.length < 2)
            return bounds[0];
        var result = bounds[0];
        for (var i = 1; i < bounds.length; i++) {
            result = Utils.getExpandedBounds(result, bounds[i]);
        }
        return result;
    };
    Utils.getRotatedCorners = function (b, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var center = [b.minX + b.width / 2, b.minY + b.height / 2];
        return [
            [b.minX, b.minY],
            [b.maxX, b.minY],
            [b.maxX, b.maxY],
            [b.minX, b.maxY],
        ].map(function (point) { return vec_1.Vec.rotWith(point, center, rotation); });
    };
    Utils.getTransformedBoundingBox = function (bounds, handle, delta, rotation, isAspectRatioLocked) {
        var _a, _b, _c, _d;
        if (rotation === void 0) { rotation = 0; }
        if (isAspectRatioLocked === void 0) { isAspectRatioLocked = false; }
        // Create top left and bottom right corners.
        var _e = [bounds.minX, bounds.minY], ax0 = _e[0], ay0 = _e[1];
        var _f = [bounds.maxX, bounds.maxY], ax1 = _f[0], ay1 = _f[1];
        // Create a second set of corners for the new box.
        var _g = [bounds.minX, bounds.minY], bx0 = _g[0], by0 = _g[1];
        var _h = [bounds.maxX, bounds.maxY], bx1 = _h[0], by1 = _h[1];
        // If the drag is on the center, just translate the bounds.
        if (handle === 'center') {
            return {
                minX: bx0 + delta[0],
                minY: by0 + delta[1],
                maxX: bx1 + delta[0],
                maxY: by1 + delta[1],
                width: bx1 - bx0,
                height: by1 - by0,
                scaleX: 1,
                scaleY: 1
            };
        }
        // Counter rotate the delta. This lets us make changes as if
        // the (possibly rotated) boxes were axis aligned.
        var _j = vec_1.Vec.rot(delta, -rotation), dx = _j[0], dy = _j[1];
        /*
    1. Delta
    
    Use the delta to adjust the new box by changing its corners.
    The dragging handle (corner or edge) will determine which
    corners should change.
    */
        switch (handle) {
            case types_1.TLBoundsEdge.Top:
            case types_1.TLBoundsCorner.TopLeft:
            case types_1.TLBoundsCorner.TopRight: {
                by0 += dy;
                break;
            }
            case types_1.TLBoundsEdge.Bottom:
            case types_1.TLBoundsCorner.BottomLeft:
            case types_1.TLBoundsCorner.BottomRight: {
                by1 += dy;
                break;
            }
        }
        switch (handle) {
            case types_1.TLBoundsEdge.Left:
            case types_1.TLBoundsCorner.TopLeft:
            case types_1.TLBoundsCorner.BottomLeft: {
                bx0 += dx;
                break;
            }
            case types_1.TLBoundsEdge.Right:
            case types_1.TLBoundsCorner.TopRight:
            case types_1.TLBoundsCorner.BottomRight: {
                bx1 += dx;
                break;
            }
        }
        var aw = ax1 - ax0;
        var ah = ay1 - ay0;
        var scaleX = (bx1 - bx0) / aw;
        var scaleY = (by1 - by0) / ah;
        var flipX = scaleX < 0;
        var flipY = scaleY < 0;
        var bw = Math.abs(bx1 - bx0);
        var bh = Math.abs(by1 - by0);
        /*
    2. Aspect ratio
    
    If the aspect ratio is locked, adjust the corners so that the
    new box's aspect ratio matches the original aspect ratio.
    */
        if (isAspectRatioLocked) {
            var ar = aw / ah;
            var isTall = ar < bw / bh;
            var tw = bw * (scaleY < 0 ? 1 : -1) * (1 / ar);
            var th = bh * (scaleX < 0 ? 1 : -1) * ar;
            switch (handle) {
                case types_1.TLBoundsCorner.TopLeft: {
                    if (isTall)
                        by0 = by1 + tw;
                    else
                        bx0 = bx1 + th;
                    break;
                }
                case types_1.TLBoundsCorner.TopRight: {
                    if (isTall)
                        by0 = by1 + tw;
                    else
                        bx1 = bx0 - th;
                    break;
                }
                case types_1.TLBoundsCorner.BottomRight: {
                    if (isTall)
                        by1 = by0 - tw;
                    else
                        bx1 = bx0 - th;
                    break;
                }
                case types_1.TLBoundsCorner.BottomLeft: {
                    if (isTall)
                        by1 = by0 - tw;
                    else
                        bx0 = bx1 + th;
                    break;
                }
                case types_1.TLBoundsEdge.Bottom:
                case types_1.TLBoundsEdge.Top: {
                    var m = (bx0 + bx1) / 2;
                    var w = bh * ar;
                    bx0 = m - w / 2;
                    bx1 = m + w / 2;
                    break;
                }
                case types_1.TLBoundsEdge.Left:
                case types_1.TLBoundsEdge.Right: {
                    var m = (by0 + by1) / 2;
                    var h = bw / ar;
                    by0 = m - h / 2;
                    by1 = m + h / 2;
                    break;
                }
            }
        }
        /*
    3. Rotation
    
    If the bounds are rotated, get a Vector from the rotated anchor
    corner in the inital bounds to the rotated anchor corner in the
    result's bounds. Subtract this Vector from the result's corners,
    so that the two anchor points (initial and result) will be equal.
    */
        if (rotation % (Math.PI * 2) !== 0) {
            var cv = [0, 0];
            var c0 = vec_1.Vec.med([ax0, ay0], [ax1, ay1]);
            var c1 = vec_1.Vec.med([bx0, by0], [bx1, by1]);
            switch (handle) {
                case types_1.TLBoundsCorner.TopLeft: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith([bx1, by1], c1, rotation), vec_1.Vec.rotWith([ax1, ay1], c0, rotation));
                    break;
                }
                case types_1.TLBoundsCorner.TopRight: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith([bx0, by1], c1, rotation), vec_1.Vec.rotWith([ax0, ay1], c0, rotation));
                    break;
                }
                case types_1.TLBoundsCorner.BottomRight: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith([bx0, by0], c1, rotation), vec_1.Vec.rotWith([ax0, ay0], c0, rotation));
                    break;
                }
                case types_1.TLBoundsCorner.BottomLeft: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith([bx1, by0], c1, rotation), vec_1.Vec.rotWith([ax1, ay0], c0, rotation));
                    break;
                }
                case types_1.TLBoundsEdge.Top: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith(vec_1.Vec.med([bx0, by1], [bx1, by1]), c1, rotation), vec_1.Vec.rotWith(vec_1.Vec.med([ax0, ay1], [ax1, ay1]), c0, rotation));
                    break;
                }
                case types_1.TLBoundsEdge.Left: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith(vec_1.Vec.med([bx1, by0], [bx1, by1]), c1, rotation), vec_1.Vec.rotWith(vec_1.Vec.med([ax1, ay0], [ax1, ay1]), c0, rotation));
                    break;
                }
                case types_1.TLBoundsEdge.Bottom: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith(vec_1.Vec.med([bx0, by0], [bx1, by0]), c1, rotation), vec_1.Vec.rotWith(vec_1.Vec.med([ax0, ay0], [ax1, ay0]), c0, rotation));
                    break;
                }
                case types_1.TLBoundsEdge.Right: {
                    cv = vec_1.Vec.sub(vec_1.Vec.rotWith(vec_1.Vec.med([bx0, by0], [bx0, by1]), c1, rotation), vec_1.Vec.rotWith(vec_1.Vec.med([ax0, ay0], [ax0, ay1]), c0, rotation));
                    break;
                }
            }
            ;
            _a = vec_1.Vec.sub([bx0, by0], cv), bx0 = _a[0], by0 = _a[1];
            _b = vec_1.Vec.sub([bx1, by1], cv), bx1 = _b[0], by1 = _b[1];
        }
        /*
    4. Flips
    
    If the axes are flipped (e.g. if the right edge has been dragged
    left past the initial left edge) then swap points on that axis.
    */
        if (bx1 < bx0) {
            ;
            _c = [bx0, bx1], bx1 = _c[0], bx0 = _c[1];
        }
        if (by1 < by0) {
            ;
            _d = [by0, by1], by1 = _d[0], by0 = _d[1];
        }
        return {
            minX: bx0,
            minY: by0,
            maxX: bx1,
            maxY: by1,
            width: bx1 - bx0,
            height: by1 - by0,
            scaleX: ((bx1 - bx0) / (ax1 - ax0 || 1)) * (flipX ? -1 : 1),
            scaleY: ((by1 - by0) / (ay1 - ay0 || 1)) * (flipY ? -1 : 1)
        };
    };
    Utils.getTransformAnchor = function (type, isFlippedX, isFlippedY) {
        var anchor = type;
        // Change corner anchors if flipped
        switch (type) {
            case types_1.TLBoundsCorner.TopLeft: {
                if (isFlippedX && isFlippedY) {
                    anchor = types_1.TLBoundsCorner.BottomRight;
                }
                else if (isFlippedX) {
                    anchor = types_1.TLBoundsCorner.TopRight;
                }
                else if (isFlippedY) {
                    anchor = types_1.TLBoundsCorner.BottomLeft;
                }
                else {
                    anchor = types_1.TLBoundsCorner.BottomRight;
                }
                break;
            }
            case types_1.TLBoundsCorner.TopRight: {
                if (isFlippedX && isFlippedY) {
                    anchor = types_1.TLBoundsCorner.BottomLeft;
                }
                else if (isFlippedX) {
                    anchor = types_1.TLBoundsCorner.TopLeft;
                }
                else if (isFlippedY) {
                    anchor = types_1.TLBoundsCorner.BottomRight;
                }
                else {
                    anchor = types_1.TLBoundsCorner.BottomLeft;
                }
                break;
            }
            case types_1.TLBoundsCorner.BottomRight: {
                if (isFlippedX && isFlippedY) {
                    anchor = types_1.TLBoundsCorner.TopLeft;
                }
                else if (isFlippedX) {
                    anchor = types_1.TLBoundsCorner.BottomLeft;
                }
                else if (isFlippedY) {
                    anchor = types_1.TLBoundsCorner.TopRight;
                }
                else {
                    anchor = types_1.TLBoundsCorner.TopLeft;
                }
                break;
            }
            case types_1.TLBoundsCorner.BottomLeft: {
                if (isFlippedX && isFlippedY) {
                    anchor = types_1.TLBoundsCorner.TopRight;
                }
                else if (isFlippedX) {
                    anchor = types_1.TLBoundsCorner.BottomRight;
                }
                else if (isFlippedY) {
                    anchor = types_1.TLBoundsCorner.TopLeft;
                }
                else {
                    anchor = types_1.TLBoundsCorner.TopRight;
                }
                break;
            }
        }
        return anchor;
    };
    /**
     * Get the relative bounds (usually a child) within a transformed bounding box.
     * @param bounds
     * @param initialBounds
     * @param initialShapeBounds
     * @param isFlippedX
     * @param isFlippedY
     */
    Utils.getRelativeTransformedBoundingBox = function (bounds, initialBounds, initialShapeBounds, isFlippedX, isFlippedY) {
        var nx = (isFlippedX
            ? initialBounds.maxX - initialShapeBounds.maxX
            : initialShapeBounds.minX - initialBounds.minX) / initialBounds.width;
        var ny = (isFlippedY
            ? initialBounds.maxY - initialShapeBounds.maxY
            : initialShapeBounds.minY - initialBounds.minY) / initialBounds.height;
        var nw = initialShapeBounds.width / initialBounds.width;
        var nh = initialShapeBounds.height / initialBounds.height;
        var minX = bounds.minX + bounds.width * nx;
        var minY = bounds.minY + bounds.height * ny;
        var width = bounds.width * nw;
        var height = bounds.height * nh;
        return {
            minX: minX,
            minY: minY,
            maxX: minX + width,
            maxY: minY + height,
            width: width,
            height: height
        };
    };
    /**
     * Get the size of a rotated box.
     * @param size : ;
     * @param rotation
     */
    Utils.getRotatedSize = function (size, rotation) {
        var center = vec_1.Vec.div(size, 2);
        var points = [[0, 0], [size[0], 0], size, [0, size[1]]].map(function (point) {
            return vec_1.Vec.rotWith(point, center, rotation);
        });
        var bounds = Utils.getBoundsFromPoints(points);
        return [bounds.width, bounds.height];
    };
    /**
     * Get the center of a bounding box.
     * @param bounds
     */
    Utils.getBoundsCenter = function (bounds) {
        return [bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2];
    };
    /**
     * Get a bounding box with a midX and midY.
     * @param bounds
     */
    Utils.getBoundsWithCenter = function (bounds) {
        var center = Utils.getBoundsCenter(bounds);
        return __assign(__assign({}, bounds), { midX: center[0], midY: center[1] });
    };
    /* -------------------------------------------------- */
    /*                Lists and Collections               */
    /* -------------------------------------------------- */
    /**
     *
     *
     * ### Example
     *
     *```ts
     * example
     *```
     */
    Utils.removeDuplicatePoints = function (points) {
        return points.reduce(function (acc, pt, i) {
            if (i === 0 || !vec_1.Vec.isEqual(pt, acc[i - 1])) {
                acc.push(pt);
            }
            return acc;
        }, []);
    };
    /**
    // points =
  
  
  /**
   * Get a value from a cache (a WeakMap), filling the value if it is not present.
   *
   * ### Example
   *
   *```ts
   * getFromCache(boundsCache, shape, (cache) => cache.set(shape, "value"))
   *```
   */
    // eslint-disable-next-line @typescript-eslint/ban-types
    Utils.getFromCache = function (cache, item, getNext) {
        var value = cache.get(item);
        if (value === undefined) {
            cache.set(item, getNext());
            value = cache.get(item);
            if (value === undefined) {
                throw Error('Cache did not include item!');
            }
        }
        return value;
    };
    /**
     * Get a unique string id.
     */
    Utils.uniqueId = function (a) {
        if (a === void 0) { a = ''; }
        return a
            ? /* eslint-disable no-bitwise */
                ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
            : (1e7 + "-" + 1e3 + "-" + 4e3 + "-" + 8e3 + "-" + 1e11).replace(/[018]/g, Utils.uniqueId);
    };
    /**
     * Shuffle the contents of an array.
     * @param arr
     * @param offset
     */
    Utils.rotateArray = function (arr, offset) {
        return arr.map(function (_, i) { return arr[(i + offset) % arr.length]; });
    };
    /**
     * Deep compare two arrays.
     * @param a
     * @param b
     */
    Utils.deepCompareArrays = function (a, b) {
        if ((a === null || a === void 0 ? void 0 : a.length) !== (b === null || b === void 0 ? void 0 : b.length))
            return false;
        return Utils.deepCompare(a, b);
    };
    /**
     * Deep compare any values.
     * @param a
     * @param b
     */
    Utils.deepCompare = function (a, b) {
        return a === b || JSON.stringify(a) === JSON.stringify(b);
    };
    Utils.arrsIntersect = function (a, b, fn) {
        return a.some(function (item) { return b.includes(fn ? fn(item) : item); });
    };
    /**
     * Get the unique values from an array of strings or numbers.
     * @param items
     */
    Utils.uniqueArray = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return Array.from(new Set(items).values());
    };
    /**
     * Convert a set to an array.
     * @param set
     */
    Utils.setToArray = function (set) {
        return Array.from(set.values());
    };
    /**
     * Debounce a function.
     */
    Utils.debounce = function (fn, ms) {
        if (ms === void 0) { ms = 0; }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var timeoutId;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () { return fn.apply(args); }, ms);
        };
    };
    /**
     * Turn an array of points into a path of quadradic curves.
     * @param stroke ;
     */
    Utils.getSvgPathFromStroke = function (points, closed) {
        if (closed === void 0) { closed = true; }
        if (!points.length) {
            return '';
        }
        var max = points.length - 1;
        return points
            .reduce(function (acc, point, i, arr) {
            if (i === max) {
                if (closed) {
                    acc.push('Z');
                }
            }
            else {
                acc.push(point, vec_1.Vec.med(point, arr[i + 1]));
            }
            return acc;
        }, ['M', points[0], 'Q'])
            .join(' ')
            .replaceAll(this.TRIM_NUMBERS, '$1');
    };
    /* -------------------------------------------------- */
    /*                   Browser and DOM                  */
    /* -------------------------------------------------- */
    /**
     * Get balanced dash-strokearray and dash-strokeoffset properties for a path of a given length.
     * @param length The length of the path.
     * @param strokeWidth The shape's stroke-width property.
     * @param style The stroke's style: "dashed" or "dotted" (default "dashed").
     * @param snap An interval for dashes (e.g. 4 will produce arrays with 4, 8, 16, etc dashes).
     */
    Utils.getPerfectDashProps = function (length, strokeWidth, style, snap, outset) {
        if (snap === void 0) { snap = 1; }
        if (outset === void 0) { outset = true; }
        var dashLength;
        var strokeDashoffset;
        var ratio;
        if (style.toLowerCase() === 'dashed') {
            dashLength = strokeWidth * 2;
            ratio = 1;
            strokeDashoffset = outset ? (dashLength / 2).toString() : '0';
        }
        else if (style.toLowerCase() === 'dotted') {
            dashLength = strokeWidth / 100;
            ratio = 100;
            strokeDashoffset = '0';
        }
        else {
            return {
                strokeDasharray: 'none',
                strokeDashoffset: 'none'
            };
        }
        var dashes = Math.floor(length / dashLength / (2 * ratio));
        dashes -= dashes % snap;
        dashes = Math.max(dashes, 4);
        var gapLength = Math.max(dashLength, (length - dashes * dashLength) / (outset ? dashes : dashes - 1));
        return {
            strokeDasharray: [dashLength, gapLength].join(' '),
            strokeDashoffset: strokeDashoffset
        };
    };
    Utils.isMobileSize = function () {
        if (typeof window === 'undefined')
            return false;
        return window.innerWidth < 768;
    };
    Utils.isMobileSafari = function () {
        if (typeof window === 'undefined')
            return false;
        var ua = window.navigator.userAgent;
        var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        var webkit = !!ua.match(/WebKit/i);
        return iOS && webkit && !ua.match(/CriOS/i);
    };
    // via https://github.com/bameyrick/throttle-typescript
    Utils.throttle = function (func, limit) {
        var inThrottle;
        var lastResult;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!inThrottle) {
                inThrottle = true;
                setTimeout(function () { return (inThrottle = false); }, limit);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                lastResult = func.apply(void 0, args);
            }
            return lastResult;
        };
    };
    /**
     * Find whether the current display is a touch display.
     */
    // static isTouchDisplay(): boolean {
    //   return (
    //     'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    //   )
    // }
    /**
     * Find whether the current device is a Mac / iOS / iPadOS.
     */
    Utils.isDarwin = function () {
        return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
    };
    /**
     * Get whether an event is command (mac) or control (pc).
     * @param e
     */
    Utils.metaKey = function (e) {
        return Utils.isDarwin() ? e.metaKey : e.ctrlKey;
    };
    Utils.deepMerge = function (target, patch) {
        var result = __assign({}, target);
        var entries = Object.entries(patch);
        for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
            var _a = entries_1[_i], key = _a[0], value = _a[1];
            result[key] =
                value === Object(value) && !Array.isArray(value)
                    ? Utils.deepMerge(result[key], value)
                    : value;
        }
        return result;
        // const result = {} as T
        // for (const key of Object.keys(result)) {
        //   const tprop = target[key as keyof T]
        //   const sprop = source[key]
        //   if (tprop === sprop) {
        //     continue
        //   } else if (!(key in target) || target[key as keyof T] === undefined) {
        //     result[key as keyof T] = sprop
        //   } else if (!(key in source)) {
        //     continue
        //   } else if (source[key as keyof T] === undefined) {
        //     delete result[key as keyof T]
        //   } else {
        //     if (typeof tprop === 'object' && typeof sprop === 'object') {
        //       result[key as keyof T] = this.deepMerge(tprop, sprop)
        //     } else {
        //       result[key as keyof T] = sprop
        //     }
        //   }
        // }
        // return result
    };
    Utils.getSnapPoints = function (bounds, others, snapDistance) {
        var _a;
        var A = __assign({}, bounds);
        var offset = [0, 0];
        var snapLines = [];
        // 1.
        // Find the snap points for the x and y axes
        var snaps = (_a = {},
            _a[types_1.SnapPoints.minX] = { id: types_1.SnapPoints.minX, isSnapped: false },
            _a[types_1.SnapPoints.midX] = { id: types_1.SnapPoints.midX, isSnapped: false },
            _a[types_1.SnapPoints.maxX] = { id: types_1.SnapPoints.maxX, isSnapped: false },
            _a[types_1.SnapPoints.minY] = { id: types_1.SnapPoints.minY, isSnapped: false },
            _a[types_1.SnapPoints.midY] = { id: types_1.SnapPoints.midY, isSnapped: false },
            _a[types_1.SnapPoints.maxY] = { id: types_1.SnapPoints.maxY, isSnapped: false },
            _a);
        var xs = [types_1.SnapPoints.midX, types_1.SnapPoints.minX, types_1.SnapPoints.maxX];
        var ys = [types_1.SnapPoints.midY, types_1.SnapPoints.minY, types_1.SnapPoints.maxY];
        var snapResults = others.map(function (B) {
            var rx = xs.flatMap(function (f, i) {
                return xs.map(function (t, k) {
                    var gap = A[f] - B[t];
                    var distance = Math.abs(gap);
                    return {
                        f: f,
                        t: t,
                        gap: gap,
                        distance: distance,
                        isCareful: i === 0 || i + k === 3
                    };
                });
            });
            var ry = ys.flatMap(function (f, i) {
                return ys.map(function (t, k) {
                    var gap = A[f] - B[t];
                    var distance = Math.abs(gap);
                    return {
                        f: f,
                        t: t,
                        gap: gap,
                        distance: distance,
                        isCareful: i === 0 || i + k === 3
                    };
                });
            });
            return [B, rx, ry];
        });
        var gapX = Infinity;
        var gapY = Infinity;
        var minX = Infinity;
        var minY = Infinity;
        snapResults.forEach(function (_a) {
            var _ = _a[0], rx = _a[1], ry = _a[2];
            rx.forEach(function (r) {
                if (r.distance < snapDistance && r.distance < minX) {
                    minX = r.distance;
                    gapX = r.gap;
                }
            });
            ry.forEach(function (r) {
                if (r.distance < snapDistance && r.distance < minY) {
                    minY = r.distance;
                    gapY = r.gap;
                }
            });
        });
        // Check for other shapes with the same gap
        snapResults.forEach(function (_a) {
            var B = _a[0], rx = _a[1], ry = _a[2];
            if (gapX !== Infinity) {
                rx.forEach(function (r) {
                    if (Math.abs(r.gap - gapX) < 2) {
                        snaps[r.f] = __assign(__assign({}, snaps[r.f]), { isSnapped: true, to: B[r.t], B: B, distance: r.distance });
                    }
                });
            }
            if (gapY !== Infinity) {
                ry.forEach(function (r) {
                    if (Math.abs(r.gap - gapY) < 2) {
                        snaps[r.f] = __assign(__assign({}, snaps[r.f]), { isSnapped: true, to: B[r.t], B: B, distance: r.distance });
                    }
                });
            }
        });
        offset[0] = gapX === Infinity ? 0 : gapX;
        offset[1] = gapY === Infinity ? 0 : gapY;
        A.minX -= offset[0];
        A.midX -= offset[0];
        A.maxX -= offset[0];
        A.minY -= offset[1];
        A.midY -= offset[1];
        A.maxY -= offset[1];
        // 2.
        // Calculate snap lines based on adjusted bounds A. This has
        // to happen after we've adjusted both dimensions x and y of
        // the bounds A!
        xs.forEach(function (from) {
            var snap = snaps[from];
            if (!snap.isSnapped)
                return;
            var id = snap.id, B = snap.B;
            var x = A[id];
            // If A is snapped at its center, show include only the midY;
            // otherwise, include both its minY and maxY.
            snapLines.push(id === types_1.SnapPoints.minX
                ? [
                    [x, A.midY],
                    [x, B.minY],
                    [x, B.maxY],
                ]
                : [
                    [x, A.minY],
                    [x, A.maxY],
                    [x, B.minY],
                    [x, B.maxY],
                ]);
        });
        ys.forEach(function (from) {
            var snap = snaps[from];
            if (!snap.isSnapped)
                return;
            var id = snap.id, B = snap.B;
            var y = A[id];
            snapLines.push(id === types_1.SnapPoints.midY
                ? [
                    [A.midX, y],
                    [B.minX, y],
                    [B.maxX, y],
                ]
                : [
                    [A.minX, y],
                    [A.maxX, y],
                    [B.minX, y],
                    [B.maxX, y],
                ]);
        });
        return { offset: offset, snapLines: snapLines };
    };
    // Regex to trim numbers to 2 decimal places
    Utils.TRIM_NUMBERS = /(\s?[A-Z]?,?-?[0-9]*\.[0-9]{0,2})(([0-9]|e|-)*)/g;
    return Utils;
}());
exports.Utils = Utils;
exports["default"] = Utils;
