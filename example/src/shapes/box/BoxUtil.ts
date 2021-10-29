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
    const [x, y] = shape.point
    const [width, height] = shape.size

    const bounds: TLBounds = {
      minX: x,
      maxX: x + width,
      minY: y,
      maxY: y + height,
      width,
      height,
    } as TLBounds

    return bounds
  }
}
