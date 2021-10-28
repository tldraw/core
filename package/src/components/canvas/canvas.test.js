"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var canvas_1 = require("./canvas");
describe('page', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<canvas_1.Canvas page={_test_1.mockDocument.page} pageState={_test_1.mockDocument.pageState} hideBounds={false} hideIndicators={false} hideHandles={false} hideBindingHandles={false} hideCloneHandles={false} hideRotateHandle={false}/>);
    });
});
