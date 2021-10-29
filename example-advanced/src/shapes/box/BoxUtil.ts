import { Utils, TLBounds, TLShapeUtil } from '@tldraw/core'
import { BoxComponent } from './BoxComponent'
import { BoxIndicator } from './BoxIndicator'
import type { BoxShape } from './BoxShape'

type T = BoxShape
type E = SVGSVGElement

export class BoxUtil extends TLShapeUtil<T, E> {
  Component = BoxComponent

  Indicator = BoxIndicator

  getBounds = (shape: T) => {
    const bounds = Utils.getFromCache(this.boundsCache, shape, () => {
      const [width, height] = shape.size

      return {
        minX: 0,
        maxX: width,
        minY: 0,
        maxY: height,
        width,
        height,
      } as TLBounds
    })

    return Utils.translateBounds(bounds, shape.point)
  }

  getCenter = (shape: T) => {
    return Utils.getBoundsCenter(this.getBounds(shape))
  }
}
