import type { TLBinding, TLPage, TLPageState, TLSnapLine } from '@tldraw/core'
import type { Shape } from '../shapes'

export const VERSION = 1

export const PERSIST_DATA = false

export const INITIAL_PAGE: TLPage<Shape, TLBinding> = {
  id: 'page1',
  shapes: {
    box1: {
      id: 'box1',
      type: 'box',
      parentId: 'page1',
      name: 'Box',
      childIndex: 1,
      point: [100, 100],
      size: [100, 100],
    },
    box2: {
      id: 'box2',
      type: 'box',
      parentId: 'page1',
      name: 'Box',
      childIndex: 2,
      point: [250, 200],
      size: [100, 100],
    },
    arrow1: {
      id: 'arrow1',
      type: 'arrow',
      parentId: 'page1',
      name: 'Arrow',
      childIndex: 3,
      point: [300, 100],
      handles: {
        start: {
          id: 'start',
          index: 1,
          point: [0, 0],
        },
        end: {
          id: 'end',
          index: 2,
          point: [100, 50],
        },
      },
    },
  },
  bindings: {},
}

export const INITIAL_PAGE_STATE: TLPageState = {
  id: 'page1',
  selectedIds: [],
  hoveredId: undefined,
  camera: {
    point: [0, 0],
    zoom: 1,
  },
}

export const INITIAL_DATA = {
  version: VERSION,
  page: INITIAL_PAGE,
  pageState: INITIAL_PAGE_STATE,
  overlays: {
    snapLines: [] as TLSnapLine[],
  },
  meta: {
    isDarkMode: false,
  },
}

export type AppData = typeof INITIAL_DATA

export const FIT_TO_SCREEN_PADDING = 100
export const SNAP_DISTANCE = 5
