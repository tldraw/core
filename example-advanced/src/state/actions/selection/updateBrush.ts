import type { Action } from 'state/constants'
import { TLPointerInfo, Utils } from '@tldraw/core'
import { mutables } from '../../mutables'
import { getPagePoint } from 'state/helpers'
import { getShapeUtils } from 'shapes'

export const updateBrush: Action = (data, payload: TLPointerInfo) => {
  const { initialPoint, snapshot } = mutables

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
}
