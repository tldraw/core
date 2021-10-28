"use strict";
exports.__esModule = true;
exports.Container = void 0;
var React = require("react");
var _hooks_1 = require("+hooks");
exports.Container = React.memo(function (_a) {
    var id = _a.id, bounds = _a.bounds, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, className = _a.className, children = _a.children;
    var rPositioned = (0, _hooks_1.usePosition)(bounds, rotation);
    return (<div id={id} ref={rPositioned} className={['tl-positioned', className || ''].join(' ')}>
        {children}
      </div>);
});
