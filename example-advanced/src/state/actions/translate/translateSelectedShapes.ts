import { TLPointerInfo, TLSnapLine, Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { nanoid } from 'nanoid'
import { Action, SNAP_DISTANCE } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

export const translateSelectedShapes: Action = (data, payload: TLPointerInfo) => {
  const { initialPoint, viewport, snapshot, snapInfo } = mutables
  const { selectedIds } = data.pageState

  let delta = Vec.sub(getPagePoint(payload.point, data.pageState), initialPoint)

  if (payload.shiftKey) {
    if (Math.abs(delta[0]) > Math.abs(delta[1])) {
      delta[1] = 0
    } else {
      delta[0] = 0
    }
  }

  if (payload.altKey && !mutables.isCloning) {
    // not cloning -> cloning
    mutables.isCloning = true

    // Restore any deleted bindings
    data.page.bindings = snapshot.page.bindings

    const cloneIds = selectedIds.map((id) => {
      // move the dragging shape back to its initial point
      const initialShape = snapshot.page.shapes[id]
      data.page.shapes[initialShape.id] = initialShape

      // create the clone and add it to the page AND snapshot
      const clone = { ...initialShape, id: nanoid() }
      data.page.shapes[clone.id] = clone
      snapshot.page.shapes[clone.id] = { ...clone }

      return clone.id
    })

    data.pageState.selectedIds = cloneIds
  } else if (!payload.altKey && mutables.isCloning) {
    // cloning -> not Cloning
    mutables.isCloning = false
    selectedIds.forEach((id) => delete data.page.shapes[id])
    data.pageState.selectedIds = [...snapshot.pageState.selectedIds]
  }

  // Remove bindings to shapes that aren't also selected

  selectedIds.forEach((id) => {
    const shape = data.page.shapes[id]
    if (shape.type === 'arrow') {
      Object.values(shape.handles).forEach((handle) => {
        if (!handle.bindingId) return
        const binding = data.page.bindings[handle.bindingId]
        if (selectedIds.includes(binding.toId)) return
        delete data.page.bindings[handle.bindingId]
        delete handle.bindingId
      })
    }
  })

  // Snapping

  let snapLines: TLSnapLine[] = []

  const speed = Vec.len2(payload.delta) / data.pageState.camera.zoom

  if (snapInfo && !payload.metaKey && speed < 5) {
    const snappingBounds = Utils.getBoundsWithCenter(
      Utils.translateBounds(snapInfo.initialBounds, delta)
    )

    const snappableBounds = (mutables.isCloning ? snapInfo.all : snapInfo.others).filter(
      (bounds) => Utils.boundsContain(viewport, bounds) || Utils.boundsCollide(viewport, bounds)
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
}
