import type { Action } from 'state/constants'
import type { TLPointerInfo } from '@tldraw/core'
import { getPagePoint } from 'state/helpers'
import { getShapeUtils } from 'shapes'

export const eraseShapesAtPoint: Action = (data, payload: TLPointerInfo) => {
  const point = getPagePoint(payload.point, data.pageState)

  Object.values(data.page.shapes).forEach((shape) => {
    if (getShapeUtils(shape).hitTestPoint(shape, point)) {
      delete data.page.shapes[shape.id]
    }
  })
}
