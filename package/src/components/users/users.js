"use strict";
exports.__esModule = true;
exports.Users = void 0;
var React = require("react");
var user_1 = require("+components/user/user");
function Users(_a) {
    var userId = _a.userId, users = _a.users;
    return (<>
      {Object.values(users)
            .filter(function (user) { return user && user.id !== userId; })
            .map(function (user) { return (<user_1.User key={user.id} user={user}/>); })}
    </>);
}
exports.Users = Users;
