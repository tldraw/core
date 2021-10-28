"use strict";
exports.__esModule = true;
var React = require("react");
var _test_1 = require("+test");
var shape_1 = require("./shape");
var TLShapeUtil_spec_1 = require("+shape-utils/TLShapeUtil.spec");
describe('shape', function () {
    test('mounts component without crashing', function () {
        (0, _test_1.renderWithContext)(<shape_1.Shape shape={TLShapeUtil_spec_1.boxShape} utils={new TLShapeUtil_spec_1.BoxUtil()} isEditing={false} isBinding={false} isHovered={false} isSelected={false} isCurrentParent={false}/>);
    });
});
// { shape: TLShape; ref: ForwardedRef<Element>; } & TLComponentProps<any, any> & RefAttributes<Element>
// { shape: BoxShape; ref: ForwardedRef<any>; } & TLComponentProps<any, any> & RefAttributes<any>'
