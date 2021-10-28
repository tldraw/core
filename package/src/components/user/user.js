"use strict";
exports.__esModule = true;
exports.User = void 0;
var React = require("react");
function User(_a) {
    var user = _a.user;
    var rUser = React.useRef(null);
    return (<div ref={rUser} className="tl-absolute tl-user" style={{
            backgroundColor: user.color,
            transform: "translate(" + user.point[0] + "px, " + user.point[1] + "px)"
        }}/>);
}
exports.User = User;
