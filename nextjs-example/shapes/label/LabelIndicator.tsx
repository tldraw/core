import { TLIndicator } from '@tldraw/core'
import { LabelShape } from 'shapes'

export const LabelIndicator: TLIndicator<LabelShape> = ({ shape }) => {
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
}
