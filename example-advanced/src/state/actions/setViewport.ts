import type { TLBounds } from '@tldraw/core'
import { current } from 'immer'
import type { Action } from 'state/constants'
import { mutables } from 'state/mutables'

export const setViewport: Action = (data, payload: { bounds: TLBounds }) => {
  const { bounds } = payload
  mutables.viewport = current(bounds)
}
