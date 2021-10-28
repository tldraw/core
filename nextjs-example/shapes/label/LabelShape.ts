import { TLShape } from '@tldraw/core'

export interface LabelShape extends TLShape {
  type: 'label'
  size: number[]
  text: string
}
