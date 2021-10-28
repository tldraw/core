import * as React from 'react'
import { TLShapeUtil } from '@tldraw/core'
import type { LabelShape } from 'shapes'

export const LabelIndicator = TLShapeUtil.Indicator<LabelShape>(({ shape }) => {
  return (
    <rect
      fill="none"
      stroke="blue"
      strokeWidth={1}
      width={shape.size[0]}
      height={shape.size[1]}
      pointerEvents="none"
    />
  )
})
