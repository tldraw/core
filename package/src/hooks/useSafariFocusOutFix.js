"use strict";
exports.__esModule = true;
exports.useSafariFocusOutFix = void 0;
var react_1 = require("react");
var _utils_1 = require("+utils");
var useTLContext_1 = require("./useTLContext");
// Send event on iOS when a user presses the "Done" key while editing a text element.
function useSafariFocusOutFix() {
    var callbacks = (0, useTLContext_1.useTLContext)().callbacks;
    (0, react_1.useEffect)(function () {
        function handleFocusOut() {
            var _a;
            (_a = callbacks.onShapeBlur) === null || _a === void 0 ? void 0 : _a.call(callbacks);
        }
        if (_utils_1["default"].isMobileSafari()) {
            document.addEventListener('focusout', handleFocusOut);
            return function () { return document.removeEventListener('focusout', handleFocusOut); };
        }
        return function () { return null; };
    }, [callbacks]);
}
exports.useSafariFocusOutFix = useSafariFocusOutFix;
