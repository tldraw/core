import * as React from 'react'
import {
  Renderer,
  TLKeyboardEventHandler,
  TLPinchEventHandler,
  TLPointerEventHandler,
  TLWheelEventHandler,
} from '@tldraw/core'
import { useStateDesigner } from '@state-designer/react'
import { shapeUtils } from './shapes'
import { state, setBounds } from './state/machine'
import './styles.css'

const onPointShape: TLPointerEventHandler = (info, e) => {
  state.send('POINTED_SHAPE', info)
}

const onPointCanvas: TLPointerEventHandler = (info, e) => {
  state.send('POINTED_CANVAS', info)
}

const onPointBounds: TLPointerEventHandler = (info, e) => {
  state.send('POINTED_BOUNDS', info)
}

const onPointerDown: TLPointerEventHandler = (info, e) => {
  state.send('STARTED_POINTING', info)
}

const onPointerUp: TLPointerEventHandler = (info, e) => {
  state.send('STOPPED_POINTING', info)
}

const onPointerMove: TLPointerEventHandler = (info, e) => {
  state.send('MOVED_POINTER', info)
}

const onPan: TLWheelEventHandler = (info, e) => {
  state.send('PANNED', info)
}

const onPinchStart: TLPinchEventHandler = (info, e) => {
  state.send('STARTED_PINCHING', info)
}

const onPinch: TLPinchEventHandler = (info, e) => {
  state.send('PINCHED', info)
}

const onPinchEnd: TLPinchEventHandler = (info, e) => {
  state.send('STOPPED_PINCHING', info)
}

const onPointBoundsHandle: TLPinchEventHandler = (info, e) => {
  state.send('POINTED_BOUNDS_HANDLE', info)
}

const onKeyDown: TLKeyboardEventHandler = (key, info, e) => {
  state.send('PRESSED_KEY', info)
}

const onKeyUp: TLKeyboardEventHandler = (key, info, e) => {
  state.send('RELEASED_KEY', info)
}

const onToolSelect = (e: React.MouseEvent) => {
  state.send('SELECTED_TOOL', { name: e.currentTarget.id })
}

const onZoomToSelection = () => {
  state.send('ZOOMED_TO_SELECTION')
}

export default function App(): JSX.Element {
  const appState = useStateDesigner(state)

  return (
    <div className="tldraw">
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={appState.data.page} // Required
        pageState={appState.data.pageState} // Required
        meta={appState.data.meta}
        onPointShape={onPointShape}
        onPointBounds={onPointBounds}
        onPointCanvas={onPointCanvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointBoundsHandle={onPointBoundsHandle}
        onPan={onPan}
        onPinchStart={onPinchStart}
        onPinchEnd={onPinchEnd}
        onPinch={onPinch}
        onPointerUp={onPointerUp}
        onBoundsChange={setBounds}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <div className="toolBar">
        <div>
          <button
            id="select"
            className={state.isIn('select') ? 'button active' : 'button'}
            onClick={onToolSelect}
          >
            Select
          </button>
          <button
            id="box"
            className={state.isIn('box') ? 'button active' : 'button'}
            onClick={onToolSelect}
          >
            Box
          </button>
        </div>
        <div>
          <button id="box" className={'button'} onClick={onZoomToSelection}>
            Zoom to Selection
          </button>
        </div>
      </div>
      <div className="statusBar">
        <div>
          {state.active
            .slice(1)
            .map((state) => state.split('#state_1.root')[1])
            .join(' - ')}
        </div>
        <div>{state.log[0]}</div>
      </div>
    </div>
  )
}
