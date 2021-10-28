/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* refresh-reset */

import * as React from 'react'
import {
  TLShape,
  Utils,
  TLBounds,
  TLShapeUtil,
  HTMLContainer,
  TLComponentProps,
  TLIndicator,
} from '@tldraw/core'
import { LabelShape } from './LabelShape'
import { LabelComponent } from './LabelComponent'
import { LabelIndicator } from './LabelIndicator'

// Define a custom shape

type T = LabelShape
type E = HTMLDivElement

export class LabelUtil extends TLShapeUtil<T, E> {
  type = 'label' as const

  Component = LabelComponent

  Indicator = LabelIndicator

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
}
