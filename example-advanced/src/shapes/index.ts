import type { TLShapeUtilsMap } from '@tldraw/core'
import { BoxShape, BoxUtil } from './box'

export * from './box'

export type Shape = BoxShape

export const shapeUtils = {
  box: new BoxUtil(),
}
