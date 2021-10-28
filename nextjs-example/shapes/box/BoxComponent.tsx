import { SVGContainer, TLComponentProps } from '@tldraw/core'
import { forwardRef } from 'react'
import { BoxShape } from './BoxShape'

export const BoxComponent = forwardRef<SVGSVGElement, TLComponentProps<BoxShape>>(function Box(
  { shape, events, meta },
  ref
) {
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
        pointerEvents="all"
      />
    </SVGContainer>
  )
})
