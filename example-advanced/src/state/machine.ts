import { createState, createSelectorHook } from '@state-designer/react'
import type { TLPointerInfo } from '@tldraw/core'
import type { BoxShape } from 'shapes'
import { INITIAL_DATA } from './constants'
import { nanoid } from 'nanoid'

export const state = createState({
  data: INITIAL_DATA,
  states: {
    tool: {
      on: {
        SELECTED_SELECT_TOOL: { to: 'select' },
        SELECTED_RECT_TOOL: { to: 'box ' },
      },
      initial: 'box',
      states: {
        select: {
          on: {
            POINTED_CANVAS: {},
            POINTED_SHAPE: {
              do: 'selectShape',
            },
          },
        },
        box: {
          on: {
            POINTED_CANVAS: {},
          },
          initial: 'idle',
          states: {
            idle: {
              on: {
                STARTED_POINTING: {
                  do: 'createBoxShape',
                  to: 'box.creating',
                },
              },
            },
            creating: {
              on: {
                MOVED_POINTER: {
                  do: 'updateCreatingShape',
                },
                STOPPED_POINTING: {
                  to: 'box.idle',
                },
              },
            },
          },
        },
      },
    },
  },
  conditions: {},
  actions: {
    selectShape(data, payload: TLPointerInfo) {
      data.pageState.selectedIds = [payload.target]
    },
    createBoxShape(data, payload: TLPointerInfo) {
      const shape: BoxShape = {
        id: nanoid(),
        type: 'box',
        name: 'Box',
        parentId: 'page1',
        point: payload.point,
        size: [0, 0],
        childIndex: Object.values(data.page.shapes).length,
      }

      data.page.shapes[shape.id] = shape
      data.pageState.selectedIds = [shape.id]
    },
    updateCreatingShape(data, payload: TLPointerInfo) {
      const [shapeId] = data.pageState.selectedIds
      const shape = data.page.shapes[shapeId]

      const minX = Math.min(payload.point[0], payload.origin[0])
      const maxX = Math.max(payload.point[0], payload.origin[0])
      const minY = Math.min(payload.point[1], payload.origin[1])
      const maxY = Math.max(payload.point[1], payload.origin[1])

      shape.point = [minX, minY]
      shape.size = [maxX - minX, maxY - minY]
    },
  },
})

export const useAppState = createSelectorHook(state)
