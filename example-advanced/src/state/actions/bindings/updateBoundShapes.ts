import { Utils } from '@tldraw/core'
import { intersectLineSegmentBounds } from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import { getShapeUtils } from 'shapes'
import type { ArrowShape } from 'shapes/arrow'
import type { Action } from 'state/constants'

export const updateBoundShapes: Action = (data) => {
  const toDelete = new Set<string>()

  const bindingsToUpdate = Object.keys(data.page.bindings)

  while (bindingsToUpdate.length > 0) {
    const bindingId = bindingsToUpdate.pop()

    if (!bindingId) break

    const binding = data.page.bindings[bindingId]
    const toShape = data.page.shapes[binding.toId]
    const fromShape = data.page.shapes[binding.fromId] as ArrowShape

    // Did we delete one of the bindings shapes? If so, delete the binding too.
    if (!(toShape && fromShape)) {
      toDelete.add(binding.id)
      return
    }

    const boundHandle = Object.values(fromShape.handles).find(
      (handle) => handle.bindingId === binding.id
    )

    // Did we delete the binding on the handle? If so, delete the bindng too.
    if (!boundHandle) {
      toDelete.add(binding.id)
      return
    }

    const toShapeBounds = getShapeUtils(toShape).getBounds(toShape)
    const toShapeCenter = getShapeUtils(toShape).getCenter(toShape)

    // Get the point of the shape's opposite handle

    const oppositeHandle = fromShape.handles[boundHandle.id === 'start' ? 'end' : 'start']
    const handlePoint = Vec.add(fromShape.point, boundHandle.point)
    let oppositePoint = Vec.add(fromShape.point, oppositeHandle.point)

    if (oppositeHandle.bindingId && bindingsToUpdate.includes(oppositeHandle.bindingId)) {
      // If we haven't updated the other handle yet, then we can't use it to calculate this
      // handle's point. In order to make sure this handle ends up in the right place, use
      // the center of its bound shape instead.
      const otherBinding = data.page.bindings[oppositeHandle.bindingId]
      const otherToShape = data.page.shapes[otherBinding.toId]
      oppositePoint = getShapeUtils(otherToShape).getCenter(otherToShape)
    }

    // Find the intersection between the target shape's bounds and the arrow as a line segment.

    const intersection =
      intersectLineSegmentBounds(
        oppositePoint,
        toShapeCenter,
        Utils.expandBounds(toShapeBounds, 12)
      )[0]?.points[0] ?? toShapeCenter

    // Update the arrow's handle position, if necessary

    if (!Vec.isEqual(handlePoint, intersection)) {
      boundHandle.point = Vec.sub(intersection, fromShape.point)

      const handles = Object.values(fromShape.handles)
      const offset = Utils.getCommonTopLeft(handles.map((handle) => handle.point))
      handles.forEach((handle) => (handle.point = Vec.sub(handle.point, offset)))
      fromShape.point = Vec.add(fromShape.point, offset)
    }
  }

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
