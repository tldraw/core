import type { BoxShape } from './box'
import type { LabelShape } from './label'

export * from './box'
export * from './label'

export type Shape = BoxShape | LabelShape
