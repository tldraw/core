import { TLBounds, TLShape, TLShapeUtil } from '@tldraw/core'

export abstract class CustomShapeUtil<
  T extends TLShape,
  E extends Element = Element
> extends TLShapeUtil<T, E> {
  /* ----------------- Custom Methods ----------------- */

  abstract getCenter: (shape: T) => number[]

  abstract transform: (shape: T, bounds: TLBounds, initialShape: T, scale: number[]) => void

  translateHandle?: (
    shape: T,
    initialShape: T,
    handle: keyof T['handles'],
    delta: number[]
  ) => void = () => {}
}
