"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var brush_1 = require("./brush");
describe('brush', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithSvg)(<brush_1.Brush brush={{
                minX: 0,
                maxX: 100,
                minY: 0,
                maxY: 100,
                width: 100,
                height: 100
            }}/>);
    });
});
