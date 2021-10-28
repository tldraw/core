import { TLIndicator } from '@tldraw/core'
import { BoxShape } from './BoxShape'

export const BoxIndicator: TLIndicator<BoxShape> = ({ shape }) => {
  return (
    <rect width={shape.size[0]} height={shape.size[1]} fill="none" stroke="blue" strokeWidth={1} />
  )
}
