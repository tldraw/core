"use strict";
exports.__esModule = true;
exports.useTLContext = exports.TLContext = void 0;
var React = require("react");
exports.TLContext = React.createContext({});
function useTLContext() {
    var context = React.useContext(exports.TLContext);
    return context;
}
exports.useTLContext = useTLContext;
