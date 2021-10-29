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
import { Toolbar } from './components/toolbar'
import './styles.css'
import styled from 'stitches.config'

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
  switch (key) {
    case 'altKey':
    case 'metaKey':
    case 'ctrlKey':
    case 'shiftKey': {
      state.send('TOGGLED_MODIFIER', info)
      break
    }
    case 'Backspace': {
      state.send('DELETED', info)
      break
    }
    case 'Escape': {
      state.send('CANCELLED', info)
      break
    }
    case '0': {
      state.send('ZOOMED_TO_ACTUAL', info)
      break
    }
    case '1': {
      state.send('ZOOMED_TO_FIT', info)
      break
    }
    case '2': {
      state.send('ZOOMED_TO_SELECTION', info)
      break
    }
    case '=': {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault()
        state.send('ZOOMED_IN', info)
      }
      break
    }
    case '-': {
      if (info.metaKey || info.ctrlKey) {
        e.preventDefault()
        state.send('ZOOMED_OUT', info)
      }
      break
    }
    case 's':
    case 'v': {
      state.send('SELECTED_TOOL', { name: 'select' })
      break
    }
    case 'r':
    case 'b': {
      state.send('SELECTED_TOOL', { name: 'box' })
      break
    }
  }
}

const onKeyUp: TLKeyboardEventHandler = (key, info, e) => {
  switch (key) {
    case 'altKey':
    case 'metaKey':
    case 'ctrlKey':
    case 'shiftKey': {
      state.send('TOGGLED_MODIFIER', info)
      break
    }
  }
}

export default function App(): JSX.Element {
  const appState = useStateDesigner(state)

  return (
    <AppContainer>
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={appState.data.page} // Required
        pageState={appState.data.pageState} // Required
        meta={appState.data.meta}
        snapLines={appState.data.overlays.snapLines}
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
      <Toolbar activeStates={state.active} lastEvent={state.log[0]} />
    </AppContainer>
  )
}

const AppContainer = styled('div', {
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  width: '100%',
  height: '100%',
})
