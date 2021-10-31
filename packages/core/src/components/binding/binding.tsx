import * as React from 'react'

interface BindingProps {
  point: number[]
  type: string
}

export function Binding({ point: [x, y], type }: BindingProps): JSX.Element {
  return (
    <g pointerEvents="none">
      {type === 'center' && <circle className="tl-binding" cx={x} cy={y} r={8} />}
      {type !== 'pin' && <use className="tl-binding" href="#cross" x={x} y={y} />}
    </g>
  )
}
