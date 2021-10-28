"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var react_1 = require("@testing-library/react");
var renderer_1 = require("./renderer");
describe('renderer', function () {
    test('mounts component without crashing', function () {
        (0, react_1.render)(<renderer_1.Renderer shapeUtils={_test_1.mockUtils} page={_test_1.mockDocument.page} pageState={_test_1.mockDocument.pageState}/>);
    });
});
