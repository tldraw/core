"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var shape_indicator_1 = require("./shape-indicator");
var TLShapeUtil_spec_1 = require("+shape-utils/TLShapeUtil.spec");
describe('shape indicator', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithSvg)(<shape_indicator_1.ShapeIndicator shape={TLShapeUtil_spec_1.boxShape} isSelected={true} isHovered={false} meta={undefined}/>);
    });
});
