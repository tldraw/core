import type { TLBinding, TLPage, TLPageState } from '@tldraw/core'
import type { Shape } from '../shapes'

export const INITIAL_PAGE: TLPage<Shape, TLBinding> = {
  id: 'page1',
  shapes: {
    box1: {
      id: 'box1',
      type: 'box',
      parentId: 'page1',
      name: 'Box',
      childIndex: 1,
      rotation: 0,
      point: [100, 100],
      size: [100, 100],
    },
    box2: {
      id: 'box2',
      type: 'box',
      parentId: 'page1',
      name: 'Box',
      childIndex: 1,
      rotation: 0,
      point: [250, 200],
      size: [100, 100],
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
  page: INITIAL_PAGE,
  pageState: INITIAL_PAGE_STATE,
  meta: {
    isDarkMode: false,
  },
}

export type Data = typeof INITIAL_DATA

export const FIT_TO_SCREEN_PADDING = 100
