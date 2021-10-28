"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.HTMLContainer = void 0;
var React = require("react");
exports.HTMLContainer = React.memo(React.forwardRef(function (_a, ref) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (<div ref={ref} className="tl-positioned-div" {...rest}>
        {children}
      </div>);
}));
