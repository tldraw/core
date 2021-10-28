import * as React from 'react'
import type { TLIndicator } from '@tldraw/core'
import type { BoxShape } from './BoxShape'

export const BoxIndicator: TLIndicator<BoxShape> = ({ shape }) => {
  return (
    <rect
      pointerEvents="none"
      width={shape.size[0]}
      height={shape.size[1]}
      fill="none"
      stroke="blue"
      strokeWidth={1}
    />
  )
}
