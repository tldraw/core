import type { TLPointerInfo } from '@tldraw/core'
import { nanoid } from 'nanoid'
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
}
