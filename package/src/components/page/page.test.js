"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var page_1 = require("./page");
describe('page', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<page_1.Page page={_test_1.mockDocument.page} pageState={_test_1.mockDocument.pageState} hideBounds={false} hideIndicators={false} hideHandles={false} hideBindingHandles={false} hideCloneHandles={false} hideRotateHandle={false}/>);
    });
});
