"use strict";
exports.__esModule = true;
exports.useForceUpdate = void 0;
var React = require("react");
function useForceUpdate() {
    var forceUpdate = React.useReducer(function (s) { return s + 1; }, 0);
    React.useLayoutEffect(function () { return forceUpdate[1](); }, []);
}
exports.useForceUpdate = useForceUpdate;
