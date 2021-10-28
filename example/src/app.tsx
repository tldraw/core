import * as React from 'react'
import { Renderer, TLShapeUtilsMap } from '@tldraw/core'
import { BoxShape, LabelShape, BoxUtil, LabelUtil } from './shapes'
import { useExampleA } from 'hooks/useExampleA'

type Shape = BoxShape | LabelShape

export const shapeUtils: TLShapeUtilsMap<Shape> = {
  box: new BoxUtil(),
  label: new LabelUtil(),
}

export default function App(): JSX.Element {
  const { page, pageState, meta, theme, events } = useExampleA()

  return (
    <div className="tldraw">
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={page} // Required
        pageState={pageState} // Required
        {...events}
        meta={meta}
        theme={theme}
        id={undefined}
        containerRef={undefined}
        hideBounds={false}
        hideIndicators={false}
        hideHandles={false}
        hideCloneHandles={false}
        hideBindingHandles={false}
        hideRotateHandles={false}
        userId={undefined}
        users={undefined}
        snapLines={undefined}
        onBoundsChange={undefined}
      />
    </div>
  )
}
