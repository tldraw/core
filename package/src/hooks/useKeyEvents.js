"use strict";
exports.__esModule = true;
exports.useKeyEvents = void 0;
var _hooks_1 = require("+hooks");
var React = require("react");
function useKeyEvents() {
    var _a = (0, _hooks_1.useTLContext)(), inputs = _a.inputs, callbacks = _a.callbacks;
    React.useEffect(function () {
        var handleKeyDown = function (e) {
            var _a;
            (_a = callbacks.onKeyDown) === null || _a === void 0 ? void 0 : _a.call(callbacks, e.key, inputs.keydown(e), e);
        };
        var handleKeyUp = function (e) {
            var _a;
            inputs.keyup(e);
            (_a = callbacks.onKeyUp) === null || _a === void 0 ? void 0 : _a.call(callbacks, e.key, inputs.keyup(e), e);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return function () {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [inputs, callbacks]);
}
exports.useKeyEvents = useKeyEvents;
