"use strict";
exports.__esModule = true;
exports.CloneButtons = void 0;
var React = require("react");
var clone_button_1 = require("./clone-button");
function CloneButtons(_a) {
    var targetSize = _a.targetSize, size = _a.size, bounds = _a.bounds;
    return (<>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="top"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="right"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottom"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="left"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="topLeft"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="topRight"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottomLeft"/>
      <clone_button_1.CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottomRight"/>
    </>);
}
exports.CloneButtons = CloneButtons;
