"use strict";
exports.__esModule = true;
var react_1 = require("@testing-library/react");
var React = require("react");
var binding_1 = require("./binding");
jest.spyOn(console, 'error').mockImplementation(function () { return void null; });
describe('binding', function () {
    test('mounts component without crashing', function () {
        (0, react_1.render)(<binding_1.Binding point={[0, 0]} type={'anchor'}/>);
    });
});
