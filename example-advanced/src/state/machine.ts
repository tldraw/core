import { createState, createSelectorHook } from '@state-designer/react'
import {
  TLBounds,
  TLBoundsCorner,
  TLBoundsEdge,
  TLBoundsHandle,
  TLBoundsWithCenter,
  TLPageState,
  TLPointerInfo,
  TLSnapLine,
  Utils,
} from '@tldraw/core'
import { BoxShape, getShapeUtils, shapeUtils } from '../shapes'
import { INITIAL_DATA, SNAP_DISTANCE } from './constants'
import { nanoid } from 'nanoid'
import { current } from 'immer'
import Vec from '@tldraw/vec'
import { getPagePoint, getZoomedCameraPoint, getZoomFitCamera } from './helpers'
import { makeHistory } from './history'
import type { ArrowShape } from 'shapes/arrow'

let rendererBounds: TLBounds
let snapshot = INITIAL_DATA
let initialPoint = [0, 0]
let isCloning = false
let snapInfo:
  | {
      initialBounds: TLBoundsWithCenter
      all: TLBoundsWithCenter[]
      others: TLBoundsWithCenter[]
    }
  | undefined
let pointedShapeId: string | undefined
let pointedHandleId: keyof ArrowShape['handles']
let pointedBoundsHandleId: TLBoundsHandle | undefined
const history = makeHistory()

export const setBounds = (newBounds: TLBounds) => (rendererBounds = newBounds)

export const state = createState({
  data: INITIAL_DATA,
  onEnter: 'restore',
  states: {
    tool: {
      on: {
        SELECTED_TOOL: { to: (data, payload) => payload.name },
        STARTED_POINTING: ['setInitialPoint', 'setSnapshot'],
        PANNED: 'panCamera',
        PINCHED: 'pinchCamera',
        ZOOMED_TO_SELECTION: 'zoomToSelection',
        ZOOMED_TO_FIT: 'zoomToFit',
        ZOOMED_IN: 'zoomIn',
        ZOOMED_OUT: 'zoomOut',
      },
      initial: 'select',
      states: {
        select: {
          initial: 'idle',
          states: {
            idle: {
              onEnter: ['clearJustShiftSelectedId'],
              on: {
                CANCELLED: 'clearSelection',
                DELETED: 'deleteSelection',
                UNDO: 'undo',
                REDO: 'redo',
                HOVERED_SHAPE: 'setHoveredShape',
                UNHOVERED_SHAPE: 'clearHoveredShape',
                POINTED_CANVAS: [
                  {
                    unless: 'isPressingShiftKey',
                    do: 'clearSelection',
                  },
                  {
                    to: 'pointing.canvas',
                  },
                ],
                POINTED_SHAPE: [
                  {
                    unless: 'shapeIsSelected',
                    do: 'selectShape',
                  },
                  { to: 'pointing.shape' },
                ],
                POINTED_BOUNDS: {
                  to: 'pointing.bounds',
                },
                POINTED_HANDLE: {
                  do: 'setInitialHandle',
                  to: 'pointing.handle',
                },
                POINTED_BOUNDS_HANDLE: {
                  do: 'setInitialBoundsHandle',
                  to: 'pointing.boundsHandle',
                },
              },
            },
            pointing: {
              initial: 'canvas',
              states: {
                canvas: {
                  on: {
                    STOPPED_POINTING: {
                      to: 'select.idle',
                    },
                    MOVED_POINTER: {
                      to: 'brushSelecting',
                    },
                  },
                },
                boundsHandle: {
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
                bounds: {
                  on: {
                    MOVED_POINTER: {
                      if: 'hasLeftDeadZone',
                      to: 'translating.selection',
                    },
                    STOPPED_POINTING: {
                      do: 'clearSelection',
                      to: 'select.idle',
                    },
                  },
                },
                shape: {
                  on: {
                    MOVED_POINTER: {
                      if: 'hasLeftDeadZone',
                      to: 'translating.selection',
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
                handle: {
                  on: {
                    MOVED_POINTER: {
                      if: 'hasLeftDeadZone',
                      to: 'translating.handle',
                    },
                    STOPPED_POINTING: {
                      to: 'select.idle',
                    },
                  },
                },
              },
            },
            translating: {
              onEnter: ['resetIsCloning', 'setSnapInfo'],
              onExit: ['clearSnapInfo', 'clearSnapLines'],
              on: {
                CANCELLED: {
                  do: 'restoreSnapshot',
                  to: 'select.idle',
                },
                STOPPED_POINTING: {
                  do: 'addToHistory',
                  to: 'select.idle',
                },
              },
              initial: 'selection',
              states: {
                selection: {
                  on: {
                    TOGGLED_MODIFIER: 'translateSelection',
                    MOVED_POINTER: 'translateSelection',
                    PANNED: 'translateSelection',
                  },
                },
                handle: {
                  on: {
                    TOGGLED_MODIFIER: 'translateHandle',
                    MOVED_POINTER: 'translateHandle',
                    PANNED: 'translateHandle',
                  },
                },
              },
            },
            transformingSelection: {
              onEnter: 'setSnapInfo',
              onExit: ['clearSnapInfo', 'clearSnapLines'],
              on: {
                TOGGLED_MODIFIER: 'transformSelection',
                MOVED_POINTER: 'transformSelection',
                PANNED: 'transformSelection',
                CANCELLED: {
                  do: 'restoreSnapshot',
                  to: 'select.idle',
                },
                STOPPED_POINTING: {
                  do: 'addToHistory',
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
              onEnter: 'setSnapshot',
              on: {
                TOGGLED_MODIFIER: 'transformSelection',
                MOVED_POINTER: 'transformSelection',
                PANNED: 'transformSelection',
                STOPPED_POINTING: {
                  do: 'addToHistory',
                  to: 'select',
                },
              },
            },
          },
        },
        arrow: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                STARTED_POINTING: {
                  do: 'createArrowShape',
                  to: 'arrow.creating',
                },
              },
            },
            creating: {
              onEnter: 'setSnapshot',
              on: {
                TOGGLED_MODIFIER: 'translateHandle',
                MOVED_POINTER: 'translateHandle',
                PANNED: 'translateHandle',
                STOPPED_POINTING: {
                  do: 'addToHistory',
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
      return pointedShapeId === payload.target
    },
    isPressingShiftKey(data, payload: { shiftKey: boolean }) {
      return payload.shiftKey
    },
  },
  actions: {
    setSnapshot(data) {
      snapshot = current(data)
    },
    restoreSnapshot(data) {
      Object.assign(data, snapshot)
    },
    setInitialPoint(data, payload: TLPointerInfo) {
      initialPoint = getPagePoint(payload.origin, data.pageState)
    },
    setInitialBoundsHandle(data, payload: TLPointerInfo<TLBoundsHandle>) {
      pointedBoundsHandleId = payload.target
    },
    setInitialHandle(data, payload: TLPointerInfo<typeof pointedHandleId>) {
      pointedHandleId = payload.target
    },
    resetIsCloning() {
      isCloning = false
    },
    setSnapInfo(data) {
      const all: TLBoundsWithCenter[] = []
      const others: TLBoundsWithCenter[] = []

      Object.values(data.page.shapes).forEach((shape) => {
        const bounds = Utils.getBoundsWithCenter(getShapeUtils(shape).getRotatedBounds(shape))
        all.push(bounds)
        if (!data.pageState.selectedIds.includes(shape.id)) {
          others.push(bounds)
        }
      })

      const initialBounds = Utils.getBoundsWithCenter(
        Utils.getCommonBounds(
          data.pageState.selectedIds
            .map((id) => data.page.shapes[id])
            .map((shape) => getShapeUtils(shape).getBounds(shape))
        )
      )

      snapInfo = {
        initialBounds,
        all,
        others,
      }
    },
    clearSnapInfo(data) {
      snapInfo = undefined
    },
    clearSnapLines(data) {
      data.overlays.snapLines = []
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

      const { zoom, point } = getZoomFitCamera(rendererBounds, commonBounds, data.pageState)

      camera.zoom = zoom
      camera.point = point
    },
    zoomToFit(data) {
      const { camera } = data.pageState

      const shapes = Object.values(data.page.shapes)

      if (shapes.length === 0) return

      const commonBounds = Utils.getCommonBounds(
        shapes.map((shape) => getShapeUtils(shape).getBounds(shape))
      )

      const { zoom, point } = getZoomFitCamera(rendererBounds, commonBounds, data.pageState)

      camera.zoom = zoom
      camera.point = point
    },
    zoomIn(data) {
      const { camera } = data.pageState
      const i = Math.round((data.pageState.camera.zoom * 100) / 25)
      const zoom = (i + 1) * 0.25
      const center = Utils.getBoundsCenter(rendererBounds)
      const p0 = Vec.sub(Vec.div(center, camera.zoom), camera.point)
      const p1 = Vec.sub(Vec.div(center, zoom), camera.point)
      const point = Vec.round(Vec.add(camera.point, Vec.sub(p1, p0)))

      data.pageState.camera.zoom = zoom
      data.pageState.camera.point = point
    },
    zoomOut(data) {
      const { camera } = data.pageState
      const i = Math.round((data.pageState.camera.zoom * 100) / 25)
      const zoom = (i - 1) * 0.25
      const center = Utils.getBoundsCenter(rendererBounds)
      const p0 = Vec.sub(Vec.div(center, camera.zoom), camera.point)
      const p1 = Vec.sub(Vec.div(center, zoom), camera.point)
      const point = Vec.round(Vec.add(camera.point, Vec.sub(p1, p0)))

      data.pageState.camera.zoom = zoom
      data.pageState.camera.point = point
    },
    /* -------------------- Selection ------------------- */
    setHoveredShape(data, payload: TLPointerInfo) {
      data.pageState.hoveredId = payload.target
    },
    clearHoveredShape(data, payload: TLPointerInfo) {
      data.pageState.hoveredId = undefined
    },
    clearSelection(data) {
      data.pageState.selectedIds = []
    },
    clearJustShiftSelectedId() {
      pointedShapeId = undefined
    },
    selectShape(data, payload: TLPointerInfo) {
      const { selectedIds } = data.pageState
      if (payload.shiftKey) {
        if (selectedIds.includes(payload.target) && pointedShapeId !== payload.target) {
          selectedIds.splice(selectedIds.indexOf(payload.target), 1)
        } else {
          pointedShapeId = payload.target
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
        size: [1, 1],
        childIndex: Object.values(data.page.shapes).length,
      }

      data.page.shapes[shape.id] = shape
      data.pageState.selectedIds = [shape.id]

      pointedBoundsHandleId = TLBoundsCorner.BottomRight
    },
    createArrowShape(data, payload: TLPointerInfo) {
      const shape: ArrowShape = {
        id: nanoid(),
        type: 'arrow',
        name: 'arrow',
        parentId: 'page1',
        point: getPagePoint(payload.point, data.pageState),
        handles: {
          start: {
            id: 'start',
            index: 1,
            point: [0, 0],
          },
          end: {
            id: 'end',
            index: 2,
            point: [1, 1],
          },
        },
        childIndex: Object.values(data.page.shapes).length,
      }

      data.page.shapes[shape.id] = shape
      data.pageState.selectedIds = [shape.id]

      pointedHandleId = 'end'
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
      let delta = Vec.sub(getPagePoint(payload.point, data.pageState), initialPoint)

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

        const cloneIds = data.pageState.selectedIds.map((id) => {
          // move the dragging shape back to its initial point
          const initialShape = snapshot.page.shapes[id]
          const shape = data.page.shapes[initialShape.id]
          shape.point = initialShape.point

          // create the clone and add it to the page AND snapshot
          const clone = { ...initialShape, id: nanoid() }
          data.page.shapes[clone.id] = clone
          snapshot.page.shapes[clone.id] = { ...clone }

          return clone.id
        })

        // select all of the clones
        data.pageState.selectedIds = cloneIds
      } else if (!payload.altKey && isCloning) {
        // cleanup clones
        isCloning = false

        data.pageState.selectedIds.forEach((id) => delete data.page.shapes[id])
        data.pageState.selectedIds = [...snapshot.pageState.selectedIds]
      }

      let snapLines: TLSnapLine[] = []

      const speed = Vec.len2(payload.delta) / data.pageState.camera.zoom

      if (snapInfo && !payload.metaKey && speed < 5) {
        const snappingBounds = Utils.getBoundsWithCenter(
          Utils.translateBounds(snapInfo.initialBounds, delta)
        )

        const snappableBounds = (isCloning ? snapInfo.all : snapInfo.others).filter(
          (bounds) =>
            Utils.boundsContain(rendererBounds, bounds) ||
            Utils.boundsCollide(rendererBounds, bounds)
        )

        const snapResult = Utils.getSnapPoints(
          snappingBounds,
          snappableBounds,
          SNAP_DISTANCE / data.pageState.camera.zoom
        )

        if (snapResult) {
          snapLines = snapResult.snapLines
          delta = Vec.sub(delta, snapResult.offset)
        }
      }

      data.overlays.snapLines = snapLines

      data.pageState.selectedIds.forEach((id) => {
        const initialShape = snapshot.page.shapes[id]
        const shape = data.page.shapes[id]
        shape.point = Vec.add(initialShape.point, delta)
      })
    },
    translateHandle(data, payload: TLPointerInfo<keyof ArrowShape['handles']>) {
      const point = getPagePoint(payload.point, data.pageState)

      let delta = Vec.sub(point, initialPoint)

      data.pageState.selectedIds.forEach((id) => {
        const initialShape = snapshot.page.shapes[id] as ArrowShape

        const shape = data.page.shapes[id] as ArrowShape

        if (payload.shiftKey) {
          const A = initialShape.handles[pointedHandleId === 'start' ? 'end' : 'start'].point
          const B = initialShape.handles[pointedHandleId].point
          const C = Vec.add(B, delta)
          const angle = Vec.angle(A, C)
          const adjusted = Vec.rotWith(C, A, Utils.snapAngleToSegments(angle, 24) - angle)
          delta = Vec.add(delta, Vec.sub(adjusted, C))
        }

        shapeUtils.arrow.translateHandle(shape, initialShape, pointedHandleId, delta)
      })
    },
    /* ------------------ Transforming ------------------ */
    transformSelection(data, payload: TLPointerInfo) {
      const { selectedIds } = data.pageState

      const point = getPagePoint(payload.point, data.pageState)

      let delta = Vec.sub(point, initialPoint)

      const initialCommonBounds = Utils.getCommonBounds(
        selectedIds
          .map((id) => snapshot.page.shapes[id])
          .map((shape) => getShapeUtils(shape).getBounds(shape))
      )

      if (pointedBoundsHandleId === 'rotate') {
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

          let initialAngle = 0

          if (payload.shiftKey) {
            const { rotation = 0 } = initialShape
            initialAngle = Utils.snapAngleToSegments(rotation, 24) - rotation
          }

          const shape = data.page.shapes[id]
          const utils = getShapeUtils(initialShape)

          const initialShapeCenter = utils.getCenter(initialShape)
          const relativeCenter = Vec.sub(initialShapeCenter, initialShape.point)
          const rotatedCenter = Vec.rotWith(initialShapeCenter, initialCommonCenter, angleDelta)

          if (shape.handles) {
            // Don't rotate shapes with handles; instead, rotate the handles
            Object.values(shape.handles).forEach((handle) => {
              handle.point = Vec.rotWith(
                initialShape.handles![handle.id as keyof ArrowShape['handles']].point,
                relativeCenter,
                angleDelta
              )
            })

            const handlePoints = {
              start: [...shape.handles.start.point],
              end: [...shape.handles.end.point],
            }

            const offset = Utils.getCommonTopLeft([handlePoints.start, handlePoints.end])

            shape.handles.start.point = Vec.sub(handlePoints.start, offset)
            shape.handles.end.point = Vec.sub(handlePoints.end, offset)
            shape.point = Vec.add(Vec.sub(rotatedCenter, relativeCenter), offset)
          } else {
            shape.point = Vec.sub(rotatedCenter, relativeCenter)
            shape.rotation = (initialShape.rotation || 0) + angleDelta + initialAngle
          }
        })
      } else {
        // Transform
        let rotation = 0

        if (selectedIds.length === 1) {
          rotation = snapshot.page.shapes[selectedIds[0]].rotation || 0
        }

        let nextCommonBounds = Utils.getTransformedBoundingBox(
          initialCommonBounds,
          pointedBoundsHandleId as TLBoundsCorner | TLBoundsEdge,
          delta,
          rotation,
          payload.shiftKey
        )

        const { scaleX, scaleY } = nextCommonBounds

        selectedIds.forEach((id) => {
          const initialShape = snapshot.page.shapes[id]
          const shape = data.page.shapes[id]

          const relativeBoundingBox = Utils.getRelativeTransformedBoundingBox(
            nextCommonBounds,
            initialCommonBounds,
            getShapeUtils(initialShape).getBounds(initialShape),
            scaleX < 0,
            scaleY < 0
          )

          getShapeUtils(shape).transform(shape, relativeBoundingBox, initialShape, [scaleX, scaleY])
        })
      }
    },
    /* --------------------- History -------------------- */
    restore(data) {
      const snapshot = history.restore()
      Object.assign(data, snapshot)
    },
    addToHistory(data) {
      history.push(data)
    },
    undo(data) {
      const snapshot = history.undo()
      Object.assign(data, snapshot)
    },
    redo(data) {
      const snapshot = history.redo()
      Object.assign(data, snapshot)
    },
  },
})
