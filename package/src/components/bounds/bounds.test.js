"use strict";
exports.__esModule = true;
var _test_1 = require("+test");
var React = require("react");
var bounds_1 = require("./bounds");
describe('bounds', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<bounds_1.Bounds zoom={1} bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }} rotation={0} viewportWidth={1000} isLocked={false} isHidden={false} hideBindingHandles={false} hideCloneHandles={false} hideRotateHandle={false}/>);
    });
});
