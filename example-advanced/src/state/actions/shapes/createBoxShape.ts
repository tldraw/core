import { TLBoundsCorner, TLPointerInfo } from '@tldraw/core'
import { nanoid } from 'nanoid'
import type { BoxShape } from 'shapes'
import type { Action } from 'state/constants'
import { getPagePoint } from 'state/helpers'
import { mutables } from 'state/mutables'

export const createBoxShape: Action = (data, payload: TLPointerInfo) => {
  const shape: BoxShape = {
    id: nanoid(),
    type: 'box',
    name: 'Box',
    parentId: 'page1',
    point: getPagePoint(payload.point, data.pageState),
    size: [1, 1],
    childIndex: Object.values(data.page.shapes).length,
  }

  data.page.shapes[shape.id] = shape
  data.pageState.selectedIds = [shape.id]

  mutables.pointedBoundsHandleId = TLBoundsCorner.BottomRight
}
