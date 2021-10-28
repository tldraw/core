"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var error_fallback_1 = require("./error-fallback");
describe('error fallback', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<error_fallback_1.ErrorFallback error={new Error()} resetErrorBoundary={function () { return void null; }}/>);
    });
});
