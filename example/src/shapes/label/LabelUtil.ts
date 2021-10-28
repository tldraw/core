/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* refresh-reset */

import { Utils, TLBounds, TLShapeUtil } from '@tldraw/core'
import { LabelComponent } from './LabelComponent'
import { LabelIndicator } from './LabelIndicator'
import type { LabelShape } from './LabelShape'

// Define a custom shape

type T = LabelShape
type E = HTMLDivElement

export class LabelUtil extends TLShapeUtil<T, E> {
  Component = LabelComponent

  Indicator = LabelIndicator

  getBounds = (shape: T): TLBounds => {
    const bounds = Utils.getFromCache(this.boundsCache, shape, () => {
      const [width, height] = shape.size
      return {
        minX: 0,
        maxX: width,
        minY: 0,
        maxY: height,
        width,
        height,
      }
    })

    return Utils.translateBounds(bounds, shape.point)
  }
}
