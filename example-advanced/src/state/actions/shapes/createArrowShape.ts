import { TLBinding, TLPointerInfo, Utils } from '@tldraw/core'
import { intersectLineSegmentBounds } from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import { nanoid } from 'nanoid'
import { getShapeUtils, Shape } from 'shapes'
import type { ArrowShape } from 'shapes/arrow'
import type { Action } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

export const createArrowShape: Action = (data, payload: TLPointerInfo) => {
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

  mutables.pointedHandleId = 'end'

  // Create binding for start point

  const handle = shape.handles.start
  const handlePoint = Vec.add(handle.point, shape.point)

  let minDistance = Infinity
  let toShape: Shape | undefined

  if (!payload.metaKey) {
    // Find colliding shape with center nearest to point
    Object.values(data.page.shapes)
      .filter((shape) => !data.pageState.selectedIds.includes(shape.id))
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
    // Create a new binding between shape and toShape
    const binding: TLBinding = {
      id: nanoid(),
      fromId: shape.id,
      toId: toShape.id,
    }

    data.page.bindings[binding.id] = binding
    handle.bindingId = binding.id
  }
}
