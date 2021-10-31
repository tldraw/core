import { TLPointerInfo, TLSnapLine, Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { nanoid } from 'nanoid'
import { Action, SNAP_DISTANCE } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

export const translateSelectedShapes: Action = (data, payload: TLPointerInfo) => {
  const { initialPoint, viewport, snapshot, snapInfo } = mutables
  let delta = Vec.sub(getPagePoint(payload.point, data.pageState), initialPoint)

  if (payload.shiftKey) {
    if (Math.abs(delta[0]) > Math.abs(delta[1])) {
      delta[1] = 0
    } else {
      delta[0] = 0
    }
  }

  if (payload.altKey && !mutables.isCloning) {
    // create clones
    mutables.isCloning = true

    // TODO: Clone bindings, too.

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
  } else if (!payload.altKey && mutables.isCloning) {
    // cleanup clones
    mutables.isCloning = false

    data.pageState.selectedIds.forEach((id) => delete data.page.shapes[id])
    data.pageState.selectedIds = [...snapshot.pageState.selectedIds]
  }

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

  const bindings = Object.values(data.page.bindings)

  data.pageState.selectedIds
    .filter((id) => bindings.find((binding) => binding.fromId === id) === undefined)
    .forEach((id) => {
      const initialShape = snapshot.page.shapes[id]
      const shape = data.page.shapes[id]
      shape.point = Vec.add(initialShape.point, delta)
    })
}
