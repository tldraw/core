"use strict";
exports.__esModule = true;
exports.useHandles = void 0;
function useHandles(page, pageState) {
    var selectedIds = pageState.selectedIds;
    var shapeWithHandles = undefined;
    if (selectedIds.length === 1) {
        var id = selectedIds[0];
        var shape = page.shapes[id];
        if (shape.handles !== undefined) {
            shapeWithHandles = shape;
        }
    }
    return { shapeWithHandles: shapeWithHandles };
}
exports.useHandles = useHandles;
