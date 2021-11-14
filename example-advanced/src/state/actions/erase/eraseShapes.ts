import type { TLPointerInfo } from '@tldraw/core'
import type { Action } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { getShapeUtils } from 'shapes'
import { mutables } from 'state/mutables'

export const eraseShapes: Action = (data, payload: TLPointerInfo) => {
  const { previousPoint } = mutables

  const currentPoint = getPagePoint(payload.point, data.pageState)

  Object.values(data.page.shapes)
    .filter((shape) => !shape.isGhost)
    .forEach((shape) => {
      if (getShapeUtils(shape).hitTestLineSegment(shape, previousPoint, currentPoint)) {
        shape.isGhost = true
      }
    })

  mutables.previousPoint = currentPoint
}
