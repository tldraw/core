/* refresh-reset */

import * as React from 'react'
import {
  TLShape,
  Utils,
  TLBounds,
  TLShapeUtil,
  TLComponentProps,
  TLIndicator,
  SVGContainer,
} from '@tldraw/core'

export interface BoxShape extends TLShape {
  type: 'box'
  size: number[]
}

type T = BoxShape
type E = SVGSVGElement

export class BoxUtil extends TLShapeUtil<T, E> {
  type = 'box' as const

  Component = React.forwardRef<E, TLComponentProps<T, E>>(({ shape, events, meta }, ref) => {
    const color = meta.isDarkMode ? 'white' : 'black'

    return (
      <SVGContainer ref={ref} {...events}>
        <rect
          width={shape.size[0]}
          height={shape.size[1]}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
        />
      </SVGContainer>
    )
  })

  Indicator: TLIndicator<T> = ({ shape }) => {
    return (
      <rect
        width={shape.size[0]}
        height={shape.size[1]}
        fill="none"
        stroke="blue"
        strokeWidth={1}
      />
    )
  }

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
