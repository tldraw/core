import * as React from 'react'
import { Renderer, TLShapeUtilsMap } from '@tldraw/core'
import { BoxShape, LabelShape, BoxUtil, LabelUtil } from './shape-utils'
import './styles.css'

type Shapes = BoxShape | LabelShape

export const shapeUtils: TLShapeUtilsMap<Shapes> = {
  box: new BoxUtil(),
  label: new LabelUtil(),
}

export default function App(): JSX.Element {
  const [page, setPage] = React.useState({
    id: 'page1',
    shapes: {
      box1: {
        id: 'box1',
        type: 'box',
        parentId: 'page1',
        name: 'Box',
        childIndex: 1,
        point: [0, 0],
        rotation: 0,
        size: [100, 100],
      },
    },
    bindings: {},
  })

  const [pageState, setPageState] = React.useState({
    id: 'page1',
    selectedIds: [],
    camera: {
      point: [0, 0],
      zoom: 1,
    },
  })

  const [meta, setMeta] = React.useState({
    isDarkMode: false,
  })

  return (
    <div className="tldraw">
      <Renderer
        shapeUtils={shapeUtils}
        page={page}
        pageState={pageState}
        meta={meta}
        // onDoubleClickBounds={appState.onDoubleClickBounds}
        // onDoubleClickShape={appState.onDoubleClickShape}
        // onPointShape={appState.onPointShape}
        // onPointCanvas={appState.onPointCanvas}
        // onPointerDown={appState.onPointerDown}
        // onPointerMove={appState.onPointerMove}
        // onPointerUp={appState.onPointerUp}
        // onShapeChange={appState.onShapeChange}
      />
    </div>
  )
}
