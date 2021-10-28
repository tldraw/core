"use strict";
exports.__esModule = true;
exports.Canvas = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var React = require("react");
var _hooks_1 = require("+hooks");
var error_fallback_1 = require("+components/error-fallback");
var error_boundary_1 = require("+components/error-boundary");
var brush_1 = require("+components/brush");
var page_1 = require("+components/page");
var users_1 = require("+components/users");
var useResizeObserver_1 = require("+hooks/useResizeObserver");
var _inputs_1 = require("+inputs");
var users_indicators_1 = require("+components/users-indicators");
var snap_lines_1 = require("+components/snap-lines/snap-lines");
var overlay_1 = require("+components/overlay");
function resetError() {
    void null;
}
function Canvas(_a) {
    var id = _a.id, page = _a.page, pageState = _a.pageState, snapLines = _a.snapLines, users = _a.users, userId = _a.userId, meta = _a.meta, externalContainerRef = _a.externalContainerRef, hideHandles = _a.hideHandles, hideBounds = _a.hideBounds, hideIndicators = _a.hideIndicators, hideBindingHandles = _a.hideBindingHandles, hideCloneHandles = _a.hideCloneHandles, hideRotateHandle = _a.hideRotateHandle;
    var rCanvas = React.useRef(null);
    var rContainer = React.useRef(null);
    var rLayer = React.useRef(null);
    _inputs_1.inputs.zoom = pageState.camera.zoom;
    (0, useResizeObserver_1.useResizeObserver)(rCanvas);
    (0, _hooks_1.useZoomEvents)(pageState.camera.zoom, externalContainerRef || rCanvas);
    (0, _hooks_1.useSafariFocusOutFix)();
    (0, _hooks_1.usePreventNavigation)(rCanvas, _inputs_1.inputs.bounds.width);
    (0, _hooks_1.useCameraCss)(rLayer, rContainer, pageState);
    (0, _hooks_1.useKeyEvents)();
    var events = (0, _hooks_1.useCanvasEvents)();
    return (<div id={id} className="tl-container" ref={rContainer}>
      <div id="canvas" className="tl-absolute tl-canvas" ref={rCanvas} {...events}>
        <error_boundary_1.ErrorBoundary FallbackComponent={error_fallback_1.ErrorFallback} onReset={resetError}>
          <div ref={rLayer} className="tl-absolute tl-layer">
            <page_1.Page page={page} pageState={pageState} hideBounds={hideBounds} hideIndicators={hideIndicators} hideHandles={hideHandles} hideBindingHandles={hideBindingHandles} hideCloneHandles={hideCloneHandles} hideRotateHandle={hideRotateHandle} meta={meta}/>
            {users && userId && (<users_indicators_1.UsersIndicators userId={userId} users={users} page={page} meta={meta}/>)}
            {pageState.brush && <brush_1.Brush brush={pageState.brush}/>}
            {users && <users_1.Users userId={userId} users={users}/>}
          </div>
        </error_boundary_1.ErrorBoundary>
        <overlay_1.Overlay camera={pageState.camera}>
          {snapLines && <snap_lines_1.SnapLines snapLines={snapLines}/>}
        </overlay_1.Overlay>
      </div>
    </div>);
}
exports.Canvas = Canvas;
