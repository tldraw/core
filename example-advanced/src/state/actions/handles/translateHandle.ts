import { Action, BINDING_PADDING } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { getShapeUtils, Shape } from 'shapes'
import { intersectLineSegmentBounds } from '@tldraw/intersect'
import { mutables } from 'state/mutables'
import { nanoid } from 'nanoid'
import { TLBinding, TLPointerInfo, Utils } from '@tldraw/core'
import type { ArrowShape } from 'shapes/arrow'
import Vec from '@tldraw/vec'

export const translateHandle: Action = (data, payload: TLPointerInfo) => {
  const { initialPoint, snapshot, pointedHandleId } = mutables

  if (!pointedHandleId) return

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

    const handlePoints = {
      start: [...initialShape.handles.start.point],
      end: [...initialShape.handles.end.point],
    }

    handlePoints[pointedHandleId] = Vec.add(handlePoints[pointedHandleId], delta)

    // Create binding

    const handle = shape.handles[pointedHandleId]
    const oppositeHandle = shape.handles[pointedHandleId === 'start' ? 'end' : 'start']
    const handlePoint = Vec.add(handlePoints[pointedHandleId], initialShape.point)

    let minDistance = Infinity
    let toShape: Shape | undefined

    const oppositeBindingTargetId =
      oppositeHandle.bindingId && data.page.bindings[oppositeHandle.bindingId]?.toId

    if (!payload.metaKey) {
      // Find colliding shape with center nearest to point
      Object.values(data.page.shapes)
        .filter(
          (shape) =>
            !data.pageState.selectedIds.includes(shape.id) && oppositeBindingTargetId !== shape.id
        )
        .forEach((potentialTarget) => {
          const utils = getShapeUtils(potentialTarget)

          if (!utils.canBind) return

          const bounds = utils.getBounds(potentialTarget)

          if (Utils.pointInBounds(handlePoint, bounds)) {
            const dist = Vec.dist(handlePoint, utils.getCenter(potentialTarget))
            if (dist < minDistance) {
              minDistance = dist
              toShape = potentialTarget
            }
          }
        })
    }

    // If we have a binding target
    if (toShape) {
      if (handle.bindingId) {
        const binding = data.page.bindings[handle.bindingId]

        if (binding.toId === toShape.id) {
          // Noop, we'll reuse this binding
        } else {
          // Clear this binding; we'll create a new one
          delete data.page.bindings[binding.id]
        }
      }

      if (!handle.bindingId) {
        // Create a new binding between shape and toShape
        const binding: TLBinding = {
          id: nanoid(),
          fromId: shape.id,
          toId: toShape.id,
        }

        data.page.bindings[binding.id] = binding
        handle.bindingId = binding.id
      }

      const toShapeCenter = getShapeUtils(toShape).getCenter(toShape)
      const toShapeBounds = getShapeUtils(toShape).getBounds(toShape)
      const oppositePoint = Vec.add(shape.point, oppositeHandle.point)

      // Position the handle at an intersection with the toShape's
      // bounds to the center of the toShape.
      const intersection =
        intersectLineSegmentBounds(
          oppositePoint,
          toShapeCenter,
          Utils.expandBounds(toShapeBounds, BINDING_PADDING)
        )[0]?.points[0] ?? toShapeCenter

      handlePoints[pointedHandleId] = Vec.sub(intersection, initialShape.point)
    } else if (handle.bindingId) {
      // If we didn't find a target but we do have a binding handle,
      // delete the binding reference. We'll clean up the binding
      // itself in the `updateBoundShapes` action.
      handle.bindingId = undefined
    }

    const offset = Utils.getCommonTopLeft([handlePoints.start, handlePoints.end])

    shape.handles.start.point = Vec.sub(handlePoints.start, offset)
    shape.handles.end.point = Vec.sub(handlePoints.end, offset)
    shape.point = Vec.add(initialShape.point, offset)
  })
}
