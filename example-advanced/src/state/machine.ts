import { createState, createSelectorHook } from '@state-designer/react'
import {
  TLBounds,
  TLBoundsCorner,
  TLBoundsEdge,
  TLBoundsHandle,
  TLPageState,
  TLPointerInfo,
  Utils,
} from '@tldraw/core'
import { BoxShape, getShapeUtils, shapeUtils } from '../shapes'
import { FIT_TO_SCREEN_PADDING, INITIAL_DATA } from './constants'
import { nanoid } from 'nanoid'
import { current } from 'immer'
import Vec from '@tldraw/vec'

let rendererBounds: TLBounds
let snapshot = INITIAL_DATA
let initialPoint = [0, 0]
let justShiftSelectedId: string | undefined
let isCloning = false
let initialBoundsHandle: TLBoundsHandle | undefined

export const setBounds = (newBounds: TLBounds) => (rendererBounds = newBounds)

export const state = createState({
  data: INITIAL_DATA,
  states: {
    tool: {
      on: {
        SELECTED_TOOL: { to: (data, payload) => payload.name },
        STARTED_POINTING: ['setInitialPoint', 'updateSnapshot'],
        PANNED: 'panCamera',
        PINCHED: 'pinchCamera',
        ZOOMED_TO_SELECTION: 'zoomToSelection',
        ZOOMED_TO_FIT: 'zoomToFit',
      },
      initial: 'select',
      states: {
        select: {
          initial: 'idle',
          states: {
            idle: {
              onEnter: 'clearJustShiftSelectedId',
              on: {
                CANCELLED: 'clearSelection',
                DELETED: 'deleteSelection',
                POINTED_CANVAS: [
                  {
                    unless: 'isPressingShiftKey',
                    do: 'clearSelection',
                  },
                  {
                    to: 'pointingCanvas',
                  },
                ],
                POINTED_SHAPE: [
                  {
                    unless: 'shapeIsSelected',
                    do: 'selectShape',
                  },
                  { to: 'pointingShape' },
                ],
                POINTED_BOUNDS: {
                  to: 'pointingBounds',
                },
                POINTED_BOUNDS_HANDLE: {
                  do: 'setInitialBoundsHandle',
                  to: 'pointingBoundsHandle',
                },
              },
            },
            pointingCanvas: {
              on: {
                STOPPED_POINTING: {
                  to: 'select.idle',
                },
                MOVED_POINTER: {
                  to: 'brushSelecting',
                },
              },
            },
            pointingBoundsHandle: {
              on: {
                MOVED_POINTER: {
                  if: 'hasLeftDeadZone',
                  to: 'transformingSelection',
                },
                STOPPED_POINTING: {
                  to: 'select.idle',
                },
              },
            },
            pointingBounds: {
              on: {
                MOVED_POINTER: {
                  if: 'hasLeftDeadZone',
                  to: 'translatingSelection',
                },
                STOPPED_POINTING: {
                  do: 'clearSelection',
                  to: 'select.idle',
                },
              },
            },
            pointingShape: {
              on: {
                MOVED_POINTER: {
                  if: 'hasLeftDeadZone',
                  to: 'translatingSelection',
                },
                STOPPED_POINTING: [
                  {
                    if: 'shapeIsSelected',
                    do: 'selectShape',
                  },
                  {
                    to: 'select.idle',
                  },
                ],
              },
            },
            translatingSelection: {
              onEnter: ['resetIsCloning'],
              on: {
                TOGGLED_MODIFIER: 'translateSelection',
                MOVED_POINTER: 'translateSelection',
                PANNED: 'translateSelection',
                CANCELLED: {
                  do: 'restoreSnapshot',
                  to: 'select.idle',
                },
                STOPPED_POINTING: {
                  to: 'select.idle',
                },
              },
            },
            transformingSelection: {
              on: {
                TOGGLED_MODIFIER: 'transformSelection',
                MOVED_POINTER: 'transformSelection',
                PANNED: 'transformSelection',
                CANCELLED: {
                  do: 'restoreSnapshot',
                  to: 'select.idle',
                },
                STOPPED_POINTING: {
                  to: 'select.idle',
                },
              },
            },
            brushSelecting: {
              onExit: 'clearBrush',
              on: {
                MOVED_POINTER: 'updateBrush',
                PANNED: 'updateBrush',
                CANCELLED: {
                  to: 'select.idle',
                },
                STOPPED_POINTING: {
                  to: 'select.idle',
                },
              },
            },
          },
        },
        box: {
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
                MOVED_POINTER: 'updateCreatingShape',
                PANNED: 'updateCreatingShape',
                STOPPED_POINTING: {
                  to: 'select',
                },
              },
            },
          },
        },
      },
    },
  },
  conditions: {
    hasLeftDeadZone(data, payload: TLPointerInfo) {
      return Vec.dist(getPagePoint(payload.point, data.pageState), initialPoint) > 3
    },
    shapeIsSelected(data, payload: { target: string }) {
      return data.pageState.selectedIds.includes(payload.target)
    },
    shapeIsPointed(data, payload: { target: string }) {
      return justShiftSelectedId === payload.target
    },
    isPressingShiftKey(data, payload: { shiftKey: boolean }) {
      return payload.shiftKey
    },
  },
  actions: {
    updateSnapshot(data) {
      snapshot = current(data)
    },
    restoreSnapshot(data) {
      Object.assign(data, snapshot)
    },
    setInitialPoint(data, payload: TLPointerInfo) {
      initialPoint = getPagePoint(payload.origin, data.pageState)
    },
    setInitialBoundsHandle(data, payload: TLPointerInfo) {
      initialBoundsHandle = payload.target as TLBoundsHandle
    },
    resetIsCloning() {
      isCloning = false
    },
    /* --------------------- Camera --------------------- */
    panCamera(data, payload: TLPointerInfo) {
      const { point, zoom } = data.pageState.camera
      data.pageState.camera.point = Vec.sub(point, Vec.div(payload.delta, zoom))
    },
    pinchCamera(data, payload: TLPointerInfo) {
      const { camera } = data.pageState
      const nextZoom = payload.delta[2]
      const nextPoint = Vec.sub(camera.point, Vec.div(payload.delta, camera.zoom))
      const p0 = Vec.sub(Vec.div(payload.point, camera.zoom), nextPoint)
      const p1 = Vec.sub(Vec.div(payload.point, nextZoom), nextPoint)
      data.pageState.camera.point = Vec.round(Vec.add(nextPoint, Vec.sub(p1, p0)))
      data.pageState.camera.zoom = nextZoom
    },
    zoomToSelection(data) {
      const { camera, selectedIds } = data.pageState
      if (selectedIds.length === 0) return

      const commonBounds = Utils.getCommonBounds(
        selectedIds
          .map((id) => data.page.shapes[id])
          .map((shape) => getShapeUtils(shape).getBounds(shape))
      )

      let zoom = Math.min(
        (rendererBounds.width - FIT_TO_SCREEN_PADDING) / commonBounds.width,
        (rendererBounds.height - FIT_TO_SCREEN_PADDING) / commonBounds.height
      )

      zoom = camera.zoom === zoom || camera.zoom < 1 ? Math.min(1, zoom) : zoom

      const delta = [
        (rendererBounds.width - commonBounds.width * zoom) / 2 / zoom,
        (rendererBounds.height - commonBounds.height * zoom) / 2 / zoom,
      ]

      camera.zoom = zoom
      camera.point = Vec.add([-commonBounds.minX, -commonBounds.minY], delta)
    },
    zoomToFit(data) {
      const { camera } = data.pageState

      const shapes = Object.values(data.page.shapes)

      if (shapes.length === 0) return

      const commonBounds = Utils.getCommonBounds(
        shapes.map((shape) => getShapeUtils(shape).getBounds(shape))
      )

      let zoom = Math.min(
        (rendererBounds.width - FIT_TO_SCREEN_PADDING) / commonBounds.width,
        (rendererBounds.height - FIT_TO_SCREEN_PADDING) / commonBounds.height
      )

      zoom = camera.zoom === zoom || camera.zoom < 1 ? Math.min(1, zoom) : zoom

      const delta = [
        (rendererBounds.width - commonBounds.width * zoom) / 2 / zoom,
        (rendererBounds.height - commonBounds.height * zoom) / 2 / zoom,
      ]

      camera.zoom = zoom
      camera.point = Vec.add([-commonBounds.minX, -commonBounds.minY], delta)
    },
    /* -------------------- Selection ------------------- */
    clearSelection(data) {
      data.pageState.selectedIds = []
    },
    clearJustShiftSelectedId() {
      justShiftSelectedId = undefined
    },
    selectShape(data, payload: TLPointerInfo) {
      const { selectedIds } = data.pageState
      if (payload.shiftKey) {
        if (selectedIds.includes(payload.target) && justShiftSelectedId !== payload.target) {
          selectedIds.splice(selectedIds.indexOf(payload.target), 1)
        } else {
          justShiftSelectedId = payload.target
          selectedIds.push(payload.target)
        }
      } else {
        data.pageState.selectedIds = [payload.target]
      }
    },
    /* -------------------- Brushing -------------------- */
    updateBrush(data, payload: TLPointerInfo) {
      const brushBounds = Utils.getBoundsFromPoints([
        getPagePoint(payload.point, data.pageState),
        initialPoint,
      ])

      data.pageState.brush = brushBounds

      const initialSelectedIds = snapshot.pageState.selectedIds

      const hits = Object.values(data.page.shapes)
        .filter((shape) => {
          const shapeBounds = getShapeUtils(shape).getBounds(shape)
          return (
            Utils.boundsContain(brushBounds, shapeBounds) ||
            (!payload.metaKey && Utils.boundsCollide(brushBounds, shapeBounds))
          )
        })
        .map((shape) => shape.id)

      if (payload.shiftKey) {
        data.pageState.selectedIds = Array.from(new Set([...initialSelectedIds, ...hits]).values())
      } else {
        data.pageState.selectedIds = hits
      }
    },
    clearBrush(data) {
      data.pageState.brush = undefined
    },
    /* ----------------- Shape Creating ----------------- */
    createBoxShape(data, payload: TLPointerInfo) {
      const shape: BoxShape = {
        id: nanoid(),
        type: 'box',
        name: 'Box',
        parentId: 'page1',
        point: getPagePoint(payload.point, data.pageState),
        size: [0, 0],
        childIndex: Object.values(data.page.shapes).length,
      }

      data.page.shapes[shape.id] = shape
      data.pageState.selectedIds = [shape.id]
    },
    updateCreatingShape(data, payload: TLPointerInfo) {
      const [shapeId] = data.pageState.selectedIds
      const shape = data.page.shapes[shapeId]

      const delta = Vec.sub(getPagePoint(payload.point, data.pageState), initialPoint)

      const next = Utils.getTransformedBoundingBox(
        Utils.getBoundsFromPoints([initialPoint, Vec.add(initialPoint, [1, 1])]),
        TLBoundsCorner.BottomRight,
        delta,
        0,
        payload.shiftKey
      )

      shape.point = [next.minX, next.minY]
      shape.size = [next.width, next.height]
    },
    /* ----------------- Shape Deleting ----------------- */
    deleteSelection(data) {
      const { page, pageState } = data
      if (pageState.hoveredId && pageState.selectedIds.includes(pageState.hoveredId)) {
        pageState.hoveredId = undefined
      }
      pageState.selectedIds.forEach((id) => delete page.shapes[id])
      pageState.selectedIds = []
    },
    /* ------------------- Translating ------------------ */
    translateSelection(data, payload: TLPointerInfo) {
      const delta = Vec.sub(getPagePoint(payload.point, data.pageState), initialPoint)

      if (payload.shiftKey) {
        if (Math.abs(delta[0]) > Math.abs(delta[1])) {
          delta[1] = 0
        } else {
          delta[0] = 0
        }
      }

      if (payload.altKey && !isCloning) {
        // create clones
        isCloning = true

        const clones = data.pageState.selectedIds
          .map((id) => snapshot.page.shapes[id])
          .map((initialShape) => {
            // move the dragging shape back to its initial point
            const shape = data.page.shapes[initialShape.id]
            shape.point = initialShape.point

            // create the clone and add it to the page AND snapshot
            const clone = { ...initialShape, id: nanoid() }
            data.page.shapes[clone.id] = clone
            snapshot.page.shapes[clone.id] = { ...clone }

            return clone
          })

        // select all of the clones
        data.pageState.selectedIds = clones.map((shape) => shape.id)
      } else if (!payload.altKey && isCloning) {
        // cleanup clones
        isCloning = false

        data.pageState.selectedIds.forEach((id) => {
          delete data.page.shapes[id]
        })

        data.pageState.selectedIds = [...snapshot.pageState.selectedIds]
      }

      data.pageState.selectedIds.forEach((id) => {
        const initialShape = snapshot.page.shapes[id]
        const shape = data.page.shapes[id]
        shape.point = Vec.add(initialShape.point, delta)
      })
    },
    /* ------------------ Transforming ------------------ */
    transformSelection(data, payload: TLPointerInfo) {
      const { selectedIds } = data.pageState

      const point = getPagePoint(payload.point, data.pageState)

      const delta = Vec.sub(point, initialPoint)

      const initialCommonBounds = Utils.getCommonBounds(
        selectedIds
          .map((id) => snapshot.page.shapes[id])
          .map((shape) => getShapeUtils(shape).getBounds(shape))
      )

      if (initialBoundsHandle === 'rotate') {
        // Rotate
        const initialCommonCenter = Utils.getBoundsCenter(initialCommonBounds)

        const initialAngle = Vec.angle(initialCommonCenter, initialPoint)
        const currentAngle = Vec.angle(initialCommonCenter, point)
        let angleDelta = currentAngle - initialAngle

        if (payload.shiftKey) {
          angleDelta = Utils.snapAngleToSegments(angleDelta, 24)
        }

        selectedIds.forEach((id) => {
          const initialShape = snapshot.page.shapes[id]
          const utils = shapeUtils[initialShape.type]

          let initialAngle = 0

          if (payload.shiftKey) {
            const { rotation = 0 } = initialShape
            initialAngle = Utils.snapAngleToSegments(rotation, 24) - rotation
          }

          const initialShapeCenter = utils.getCenter(initialShape)
          const relativeCenter = Vec.sub(initialShapeCenter, initialShape.point)
          const rotatedCenter = Vec.rotWith(initialShapeCenter, initialCommonCenter, angleDelta)

          const shape = data.page.shapes[id]
          shape.point = Vec.sub(rotatedCenter, relativeCenter)
          shape.rotation = (initialShape.rotation || 0) + angleDelta + initialAngle
        })
      } else {
        // Transform
        let rotation = 0

        if (selectedIds.length === 1) {
          rotation = snapshot.page.shapes[selectedIds[0]].rotation || 0
        }

        const nextCommonBounds = Utils.getTransformedBoundingBox(
          initialCommonBounds,
          initialBoundsHandle as TLBoundsCorner | TLBoundsEdge,
          delta,
          rotation,
          payload.shiftKey
        )

        selectedIds.forEach((id) => {
          const initialShape = snapshot.page.shapes[id]
          const shape = data.page.shapes[id]

          const relativeBoundingBox = Utils.getRelativeTransformedBoundingBox(
            nextCommonBounds,
            initialCommonBounds,
            shapeUtils[initialShape.type].getBounds(initialShape),
            nextCommonBounds.scaleX < 0,
            nextCommonBounds.scaleY < 0
          )

          shape.point = [relativeBoundingBox.minX, relativeBoundingBox.minY]
          shape.size = [relativeBoundingBox.width, relativeBoundingBox.height]
        })
      }
    },
  },
})

export const useAppState = createSelectorHook(state)

function getPagePoint(point: number[], pageState: TLPageState) {
  return Vec.sub(Vec.div(point, pageState.camera.zoom), pageState.camera.point)
}

function getScreenPoint(point: number[], pageState: TLPageState) {
  return Vec.mul(Vec.add(point, pageState.camera.point), pageState.camera.zoom)
}
