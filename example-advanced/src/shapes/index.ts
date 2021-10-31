import { ArrowShape, ArrowUtil } from './arrow'
import { BoxShape, BoxUtil } from './box'
import type { CustomShapeUtil } from './CustomShapeUtil'

export * from './box'

export type Shape = BoxShape | ArrowShape

export const shapeUtils = {
  box: new BoxUtil(),
  arrow: new ArrowUtil(),
}

export const getShapeUtils = <T extends Shape>(shape: T | T['type']) => {
  if (typeof shape === 'string') return shapeUtils[shape] as unknown as CustomShapeUtil<T>
  return shapeUtils[shape.type] as unknown as CustomShapeUtil<T>
}
