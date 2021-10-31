import { Utils } from '@tldraw/core'
import { intersectLineSegmentBounds } from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import { getShapeUtils } from 'shapes'
import type { ArrowShape } from 'shapes/arrow'
import type { Action } from 'state/constants'

export const updateBoundShapes: Action = (data) => {
  const toDelete = new Set<string>()

  Object.values(data.page.bindings).forEach((binding) => {
    const toShape = data.page.shapes[binding.toId]
    const fromShape = data.page.shapes[binding.fromId] as ArrowShape

    if (!(toShape && fromShape)) {
      toDelete.add(binding.id)
      return
    }

    const boundHandle = Object.values(fromShape.handles).find(
      (handle) => handle.bindingId === binding.id
    )

    if (!boundHandle) {
      toDelete.add(binding.id)
      return
    }

    const toShapeCenter = getShapeUtils(toShape).getCenter(toShape)
    const toShapeBounds = getShapeUtils(toShape).getBounds(toShape)
    const oppositeHandle = fromShape.handles[boundHandle.id === 'start' ? 'end' : 'start']

    const handlePoint = Vec.add(fromShape.point, boundHandle.point)
    const oppositePoint = Vec.add(fromShape.point, oppositeHandle.point)

    const intersection =
      intersectLineSegmentBounds(
        oppositePoint,
        toShapeCenter,
        Utils.expandBounds(toShapeBounds, 12)
      )[0]?.points[0] ?? toShapeCenter

    if (!Vec.isEqual(handlePoint, intersection)) {
      boundHandle.point = Vec.sub(intersection, fromShape.point)

      const handles = Object.values(fromShape.handles)
      const offset = Utils.getCommonTopLeft(handles.map((handle) => handle.point))
      handles.forEach((handle) => (handle.point = Vec.sub(handle.point, offset)))
      fromShape.point = Vec.add(fromShape.point, offset)
    }
  })

  // Clean up deleted bindings
  toDelete.forEach((id) => {
    const binding = data.page.bindings[id]

    const fromShape = data.page.shapes[binding.fromId] as ArrowShape

    if (fromShape) {
      const boundHandle = Object.values(fromShape.handles).find(
        (handle) => handle.bindingId === binding.id
      )

      if (boundHandle) {
        boundHandle.bindingId = undefined
      }
    }

    delete data.page.bindings[id]
  })
}
