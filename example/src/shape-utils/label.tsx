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

// Define a custom shape

export interface LabelShape extends TLShape {
  type: 'label'
  size: number[]
  text: string
}

type T = LabelShape
type E = HTMLDivElement

export class LabelUtil extends TLShapeUtil<T, E> {
  type = 'label' as const

  Component = React.forwardRef<E, TLComponentProps<T, E>>(
    ({ shape, events, meta, onShapeChange, isSelected }, ref) => {
      const color = meta.isDarkMode ? 'white' : 'black'

      const rInput = React.useRef<HTMLDivElement>(null)

      function updateShapeSize() {
        const elm = rInput.current!

        onShapeChange?.({
          id: shape.id,
          text: elm.innerText,
          size: [elm.offsetWidth + 44, elm.offsetHeight + 44],
        })
      }

      React.useLayoutEffect(() => {
        const elm = rInput.current!
        elm.innerText = shape.text
        updateShapeSize()

        const observer = new MutationObserver(updateShapeSize)

        observer.observe(elm, {
          attributes: true,
          characterData: true,
          subtree: true,
        })
      }, [])

      return (
        <HTMLContainer ref={ref}>
          <div
            {...events}
            style={{
              pointerEvents: 'all',
              width: shape.size[0],
              height: shape.size[1],
              display: 'flex',
              fontSize: 20,
              fontFamily: 'sans-serif',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${color}`,
              color,
            }}
          >
            <div onPointerDown={(e) => isSelected && e.stopPropagation()}>
              <div
                ref={rInput}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textAlign: 'center',
                  outline: 'none',
                  userSelect: isSelected ? 'all' : 'none',
                }}
                contentEditable={isSelected}
              />
            </div>
          </div>
        </HTMLContainer>
      )
    }
  )

  Indicator: TLIndicator<T> = ({ shape }) => {
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
