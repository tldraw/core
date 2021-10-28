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
exports.SVGContainer = void 0;
var React = require("react");
exports.SVGContainer = React.memo(React.forwardRef(function (_a, ref) {
    var id = _a.id, children = _a.children, rest = __rest(_a, ["id", "children"]);
    return (<svg ref={ref} className="tl-positioned-svg" {...rest}>
        <g id={id} className="tl-centered-g">
          {children}
        </g>
      </svg>);
}));
