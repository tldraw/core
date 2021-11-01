import { TLBounds, TLBoundsHandle, TLBoundsWithCenter, Utils } from '@tldraw/core'
import type { ArrowShape } from 'shapes/arrow'
import { AppData, INITIAL_DATA } from './constants'
import { makeHistory } from './history'

/*
This file contains the "mutable" part of our application's state.
The information in the `mutables` object is modified and relied 
on by certain actions but does not need to be part of our React 
state, so we can throw it all into a regular object.
*/

interface Mutables {
  snapshot: AppData
  viewport: TLBounds
  history: ReturnType<typeof makeHistory>
  initialPoint: number[]
  isCloning: boolean
  pointedShapeId?: string
  pointedHandleId?: keyof ArrowShape['handles']
  pointedBoundsHandleId?: TLBoundsHandle
  initialCommonBounds?: TLBounds
  snapInfo?: {
    initialBounds: TLBoundsWithCenter
    all: TLBoundsWithCenter[]
    others: TLBoundsWithCenter[]
  }
}

export const mutables: Mutables = {
  snapshot: INITIAL_DATA,
  initialPoint: [0, 0],
  history: makeHistory(),
  viewport: Utils.getBoundsFromPoints([
    [0, 0],
    [100, 100],
  ]),
  isCloning: false,
  pointedShapeId: undefined,
  pointedHandleId: undefined,
  pointedBoundsHandleId: undefined,
  initialCommonBounds: undefined,
  snapInfo: undefined,
}
