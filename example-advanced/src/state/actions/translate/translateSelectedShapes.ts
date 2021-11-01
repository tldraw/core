import { TLBinding, TLPointerInfo, TLSnapLine, Utils } from '@tldraw/core'
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

    const cloneMap: Record<string, string> = {}

    // Create clones
    const cloneIds = selectedIds.map((id) => {
      // move the dragging shape back to its initial point
      const initialShape = snapshot.page.shapes[id]
      data.page.shapes[initialShape.id] = initialShape

      // create the clone and add it to the page AND snapshot
      const clone = { ...initialShape, id: nanoid() }

      cloneMap[initialShape.id] = clone.id
      data.page.shapes[clone.id] = clone
      snapshot.page.shapes[clone.id] = { ...clone }

      return clone.id
    })

    // Create cloned bindings
    cloneIds.forEach((id) => {
      const clone = data.page.shapes[id]
      if (clone.type === 'arrow') {
        Object.values(clone.handles).forEach((handle) => {
          if (handle.bindingId === undefined) return

          const binding = data.page.bindings[handle.bindingId]

          if (cloneMap[binding.toId]) {
            const newBinding: TLBinding = {
              id: nanoid(),
              fromId: clone.id,
              toId: cloneMap[binding.toId],
            }

            console.log(newBinding)

            data.page.bindings[newBinding.id] = newBinding
            handle.bindingId = newBinding.id
          }
        })
      }
    })

    data.pageState.selectedIds = cloneIds
  } else if (!payload.altKey && mutables.isCloning) {
    // cloning -> not Cloning
    mutables.isCloning = false
    selectedIds.forEach((id) => delete data.page.shapes[id])
    data.pageState.selectedIds = [...snapshot.pageState.selectedIds]
  }

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
