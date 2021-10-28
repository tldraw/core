"use strict";
exports.__esModule = true;
exports.ErrorFallback = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
exports.ErrorFallback = React.memo(function (_a) {
    var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
    var callbacks = (0, _hooks_1.useTLContext)().callbacks;
    React.useEffect(function () {
        var _a;
        (_a = callbacks.onError) === null || _a === void 0 ? void 0 : _a.call(callbacks, error);
    }, [error, resetErrorBoundary, callbacks]);
    return null;
});
