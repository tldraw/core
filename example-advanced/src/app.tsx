import * as React from 'react'
import { Renderer, TLPointerEventHandler, TLShapeUtilsMap } from '@tldraw/core'
import { BoxUtil, Shape } from './shapes'
import { useAppState, state } from './state/machine'
import './styles.css'

export const shapeUtils: TLShapeUtilsMap<Shape> = {
  box: new BoxUtil(),
}

const onPointShape: TLPointerEventHandler = (info, e) => {
  state.send('POINTED_SHAPE', info)
}

const onPointCanvas: TLPointerEventHandler = (info, e) => {
  state.send('POINTED_CANVAS', info)
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

export default function App(): JSX.Element {
  const page = useAppState((s) => s.data.page)

  const pageState = useAppState((s) => s.data.pageState)

  const meta = useAppState((s) => s.data.meta)

  const currentStates = useAppState((s) => s.active)

  return (
    <div className="tldraw">
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={page} // Required
        pageState={pageState} // Required
        meta={meta}
        onPointShape={onPointShape}
        onPointCanvas={onPointCanvas}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
      <div className="statusBar">
        {currentStates
          .slice(1)
          .map((state) => state.split('#state_1.root')[1])
          .join(' - ')}
      </div>
    </div>
  )
}
