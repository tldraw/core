"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var handles_1 = require("./handles");
var TLShapeUtil_spec_1 = require("+shape-utils/TLShapeUtil.spec");
describe('handles', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<handles_1.Handles shape={TLShapeUtil_spec_1.boxShape} zoom={1}/>);
    });
});
