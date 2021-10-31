import type { TLShape } from '@tldraw/core'

export interface ArrowShape extends TLShape {
  type: 'arrow'
  handles: {
    start: {
      id: 'start'
      index: number
      point: number[]
      bindingId?: string
    }
    end: {
      id: 'end'
      index: number
      point: number[]
      bindingId?: string
    }
  }
}
