"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.BoxUtil = exports.boxShape = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var TLShapeUtil_1 = require("./TLShapeUtil");
var react_1 = require("@testing-library/react");
var _components_1 = require("+components");
var _utils_1 = require("+utils");
var meta = { legs: 93 };
exports.boxShape = {
    id: 'example1',
    type: 'box',
    parentId: 'page',
    childIndex: 0,
    name: 'Example Shape',
    point: [0, 0],
    size: [100, 100],
    rotation: 0
};
var BoxUtil = /** @class */ (function (_super) {
    __extends(BoxUtil, _super);
    function BoxUtil() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.age = 100;
        _this.Component = React.forwardRef(function (_a, ref) {
            var shape = _a.shape, events = _a.events, meta = _a.meta;
            return (<_components_1.SVGContainer ref={ref}>
          <g {...events}>
            <rect width={shape.size[0]} height={shape.size[1]} fill="none" stroke="black"/>
          </g>
        </_components_1.SVGContainer>);
        });
        _this.Indicator = function (_a) {
            var shape = _a.shape;
            return (<_components_1.SVGContainer>
        <rect width={shape.size[0]} height={shape.size[1]} fill="none" stroke="black"/>
      </_components_1.SVGContainer>);
        };
        _this.getBounds = function (shape) {
            var bounds = _utils_1["default"].getFromCache(_this.boundsCache, shape, function () {
                var _a = shape.size, width = _a[0], height = _a[1];
                return {
                    minX: 0,
                    maxX: width,
                    minY: 0,
                    maxY: height,
                    width: width,
                    height: height
                };
            });
            return _utils_1["default"].translateBounds(bounds, shape.point);
        };
        return _this;
    }
    return BoxUtil;
}(TLShapeUtil_1.TLShapeUtil));
exports.BoxUtil = BoxUtil;
describe('When creating a minimal ShapeUtil', function () {
    var Box = new BoxUtil();
    it('creates a shape utils', function () {
        expect(Box).toBeTruthy();
    });
    test('accesses this in an override method', function () {
        expect(Box.shouldRender(exports.boxShape, __assign(__assign({}, exports.boxShape), { point: [1, 1] }))).toBe(true);
    });
    test('mounts component without crashing', function () {
        var ref = React.createRef();
        var ref2 = React.createRef();
        var H = React.forwardRef(function (props, ref) {
            return <div ref={ref2}>{props.message}</div>;
        });
        (0, react_1.render)(<H message="Hello"/>);
        (0, react_1.render)(<Box.Component ref={ref} shape={exports.boxShape} isEditing={false} isBinding={false} isHovered={false} isSelected={false} isCurrentParent={false} meta={{}} events={{}}/>);
    });
});
var TLRealisticShapeUtil = /** @class */ (function (_super) {
    __extends(TLRealisticShapeUtil, _super);
    function TLRealisticShapeUtil() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.create = function (props) {
            _this.refMap.set(props.id, React.createRef());
            return _this.getShape(props);
        };
        return _this;
    }
    return TLRealisticShapeUtil;
}(TLShapeUtil_1.TLShapeUtil));
describe('When creating a realistic API around TLShapeUtil', function () {
    var ExtendedBoxUtil = /** @class */ (function (_super) {
        __extends(ExtendedBoxUtil, _super);
        function ExtendedBoxUtil() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = 'box';
            _this.age = 100;
            _this.Component = React.forwardRef(function (_a, ref) {
                var shape = _a.shape, events = _a.events, meta = _a.meta;
                return (<_components_1.SVGContainer ref={ref}>
            <g {...events}>
              <rect width={shape.size[0]} height={shape.size[1]} fill="none" stroke="black"/>
            </g>
          </_components_1.SVGContainer>);
            });
            _this.Indicator = function (_a) {
                var shape = _a.shape;
                return (<_components_1.SVGContainer>
          <rect width={shape.size[0]} height={shape.size[1]} fill="none" stroke="black"/>
        </_components_1.SVGContainer>);
            };
            _this.getShape = function (props) { return (__assign({ id: 'example1', type: 'box', parentId: 'page', childIndex: 0, name: 'Example Shape', point: [0, 0], size: [100, 100], rotation: 0 }, props)); };
            _this.getBounds = function (shape) {
                var bounds = _utils_1["default"].getFromCache(_this.boundsCache, shape, function () {
                    var _a = shape.size, width = _a[0], height = _a[1];
                    return {
                        minX: 0,
                        maxX: width,
                        minY: 0,
                        maxY: height,
                        width: width,
                        height: height
                    };
                });
                return _utils_1["default"].translateBounds(bounds, shape.point);
            };
            return _this;
        }
        return ExtendedBoxUtil;
    }(TLRealisticShapeUtil));
    var Box = new ExtendedBoxUtil();
    it('creates a shape utils', function () {
        expect(Box).toBeTruthy();
    });
    it('creates a shape utils with extended properties', function () {
        expect(Box.age).toBe(100);
    });
    it('creates a shape', function () {
        expect(Box.create({ id: 'box1' })).toStrictEqual(__assign(__assign({}, exports.boxShape), { id: 'box1' }));
    });
    test('accesses this in an override method', function () {
        expect(Box.shouldRender(exports.boxShape, __assign(__assign({}, exports.boxShape), { point: [1, 1] }))).toBe(true);
    });
    test('mounts component without crashing', function () {
        var box = Box.create({ id: 'box1' });
        var ref = React.createRef();
        var ref2 = React.createRef();
        var H = React.forwardRef(function (props, ref) {
            return <div ref={ref2}>{props.message}</div>;
        });
        (0, react_1.render)(<H message="Hello"/>);
        (0, react_1.render)(<Box.Component ref={ref} shape={box} isEditing={false} isBinding={false} isHovered={false} isSelected={false} isCurrentParent={false} meta={meta} events={{}}/>);
    });
});
