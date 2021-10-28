/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { HTMLContainer, TLComponentProps } from '@tldraw/core'
import { LabelShape } from './LabelShape'

export const LabelComponent = React.forwardRef<HTMLDivElement, TLComponentProps<LabelShape>>(
  function Label({ shape, events, meta, onShapeChange, isSelected }, ref) {
    const { id, size, text } = shape

    const color = meta.isDarkMode ? 'white' : 'black'

    const rInput = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
      function updateShapeSize() {
        const elm = rInput.current!

        onShapeChange?.({
          id,
          text: elm.innerText,
          size: [elm.offsetWidth + 44, elm.offsetHeight + 44],
        })
      }

      const elm = rInput.current!
      elm.innerText = text
      updateShapeSize()

      const observer = new MutationObserver(updateShapeSize)

      observer.observe(elm, {
        attributes: true,
        characterData: true,
        subtree: true,
      })
    }, [text, id, onShapeChange])

    return (
      <HTMLContainer ref={ref}>
        <div
          {...events}
          style={{
            pointerEvents: 'all',
            width: size[0],
            height: size[1],
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
