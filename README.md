# @tldraw/core

> `This library is not yet released and these docs are partially out of date!`

This package contains the `Renderer` and core utilities used by [tldraw](https://tldraw.com). You can use this package to render React components in a canvas user interface. See the example project for a reference.

💕 Love this library? Consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

## Installation

```bash
yarn add @tldraw/core
```

## Usage

Import the `Renderer` React component and pass it the required props.

```tsx
import * as React from "react"
import { Renderer, TLShape, TLShapeUtil, Vec } from '@tldraw/core'
import { BoxShape, BoxUtil } from "./shapes/box"

const shapeUtils = { box: new BoxUtil() }

function App() {
  const [page, setPage] = React.useState({
    id: "page"
    shapes: {
      "box1": {
        id: 'box1',
        type: 'box',
        parentId: 'page',
        childIndex: 0,
        point: [0, 0],
        size: [100, 100],
        rotation: 0,
      }
    },
    bindings: {}
  })

  const [pageState, setPageState] = React.useState({
    id: "page",
    selectedIds: [],
    camera: {
      point: [0,0],
      zoom: 1
    }
  })

  return (<Renderer
    page={page}
    pageState={pageState}
    shapeUtils={myShapes}
  />)
}
```

## Documentation

### `Renderer`

| Prop                 | Type                              | Description                                                            |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| `page`               | [`TLPage`](#tlpage)               | The current page object.                                               |
| `pageState`          | [`TLPageState`](#tlpagestate)     | The current page's state.                                              |
| `shapeUtils`         | [`TLShapeUtils`](#tlshapeutils){} | The shape utilities used to render the shapes.                         |
| `containerRef`       | `React.MutableRefObject`          | A React ref for the container, where CSS variables will be added.      |
| `theme`              | `object`                          | (optional) an object with overrides for the Renderer's default colors. |
| `hideBounds`         | `boolean`                         | (optional) an object with overrides for the Renderer's default colors. |
| `hideHandles`        | `boolean`                         | (optional) an object with overrides for the Renderer's default colors. |
| `hideBindingHandles` | `boolean`                         | (optional) an object with overrides for the Renderer's default colors. |
| `hideRotateHandles`  | `boolean`                         | (optional) an object with overrides for the Renderer's default colors. |
| `snapLines`          | `TLSnapLine[]`                    | (optional) an object with overrides for the Renderer's default colors. |
| `users`              | `TLUser`                          | (optional) an object with overrides for the Renderer's default colors. |
| `userId`             | `object`                          | (optional) an object with overrides for the Renderer's default colors. |

The theme object accepts valid CSS colors for the following properties:

| Property       | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `foreground`   | (optional) The primary (usually "text") color                   |
| `background`   | (optional) The default page's background color                  |
| `brushFill`    | (optional) The fill color of the brush selection box            |
| `brushStroke`  | (optional) The stroke color of the brush selection box          |
| `selectFill`   | (optional) The fill color of the selection bounds               |
| `selectStroke` | (optional) The stroke color of the selection bounds and handles |

> Tip: If providing an object for the `theme` prop, either define the object outside of the parent component or memoize it with `React.useMemo`.

The Renderer also accepts many (optional) event callbacks.

| Prop                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `onPan`                     | Panned with the mouse wheel                                  |
| `onZoom`                    | Zoomed with the mouse wheel                                  |
| `onPinchStart`              | Began a two-pointer pinch                                    |
| `onPinch`                   | Moved their pointers during a pinch                          |
| `onPinchEnd`                | Stopped a two-pointer pinch                                  |
| `onPointerDown`             | Started pointing                                             |
| `onPointerMove`             | Moved their pointer                                          |
| `onPointerUp`               | Ended a point                                                |
| `onPointCanvas`             | Pointed the canvas                                           |
| `onDoubleClickCanvas`       | Double-pointed the canvas                                    |
| `onRightPointCanvas`        | Right-pointed the canvas                                     |
| `onDragCanvas`              | Dragged the canvas                                           |
| `onReleaseCanvas`           | Stopped pointing the canvas                                  |
| `onHoverShape`              | Moved their pointer onto a shape                             |
| `onUnhoverShape`            | Moved their pointer off of a shape                           |
| `onPointShape`              | Pointed a shape                                              |
| `onDoubleClickShape`        | Double-pointed a shape                                       |
| `onRightPointShape`         | Right-pointed a shape                                        |
| `onDragShape`               | Dragged a shape                                              |
| `onReleaseShape`            | Stopped pointing a shape                                     |
| `onHoverHandle`             | Moved their pointer onto a shape handle                      |
| `onUnhoverHandle`           | Moved their pointer off of a shape handle                    |
| `onPointHandle`             | Pointed a shape handle                                       |
| `onDoubleClickHandle`       | Double-pointed a shape handle                                |
| `onRightPointHandle`        | Right-pointed a shape handle                                 |
| `onDragHandle`              | Dragged a shape handle                                       |
| `onReleaseHandle`           | Stopped pointing shape handle                                |
| `onHoverBounds`             | Moved their pointer onto the selection bounds                |
| `onUnhoverBounds`           | Moved their pointer off of the selection bounds              |
| `onPointBounds`             | Pointed the selection bounds                                 |
| `onDoubleClickBounds`       | Double-pointed the selection bounds                          |
| `onRightPointBounds`        | Right-pointed the selection bounds                           |
| `onDragBounds`              | Dragged the selection bounds                                 |
| `onReleaseBounds`           | Stopped the selection bounds                                 |
| `onHoverBoundsHandle`       | Moved their pointer onto a selection bounds handle           |
| `onUnhoverBoundsHandle`     | Moved their pointer off of a selection bounds handle         |
| `onPointBoundsHandle`       | Pointed a selection bounds handle                            |
| `onDoubleClickBoundsHandle` | Double-pointed a selection bounds handle                     |
| `onRightPointBoundsHandle`  | Right-pointed a selection bounds handle                      |
| `onDragBoundsHandle`        | Dragged a selection bounds handle                            |
| `onReleaseBoundsHandle`     | Stopped a selection bounds handle                            |
| `onShapeClone`              | Clicked on a shape's clone handle.                           |
| `onShapeChange`             | A shape's component prompted a change.                       |
| `onShapeBlur`               | A shape's component was prompted a blur.                     |
| `onRenderCountChange`       | The number of rendered shapes changed.                       |
| `onBoundsChange`            | The Renderer's screen bounding box of the component changed. |
| `onError`                   | The Renderer encountered an error.                           |

> Tip: If providing callbacks, either define the functions outside of the parent component or memoize them first with `React.useMemo`.

The `@tldraw/core` library provides types for most of the event handlers:

| Type                         |
| ---------------------------- |
| `TLPinchEventHandler`        |
| `TLPointerEventHandler`      |
| `TLCanvasEventHandler`       |
| `TLBoundsEventHandler`       |
| `TLBoundsHandleEventHandler` |
| `TLShapeChangeHandler`       |
| `TLShapeBlurHandler`         |
| `TLShapeCloneHandler`        |

### `TLPage`

An object describing the current page. It contains:

| Property          | Type                        | Description                                                                 |
| ----------------- | --------------------------- | --------------------------------------------------------------------------- |
| `id`              | `string`                    | A unique id for the page.                                                   |
| `shapes`          | [`TLShape{}`](#tlshape)     | A table of shapes.                                                          |
| `bindings`        | [`TLBinding{}`](#tlbinding) | A table of bindings.                                                        |
| `backgroundColor` | `string`                    | (optional) The page's background fill color. Will also overwrite the theme. |

### `TLPageState`

An object describing the current page. It contains:

| Property       | Type       | Description                                         |
| -------------- | ---------- | --------------------------------------------------- |
| `id`           | `string`   | The corresponding page's id                         |
| `selectedIds`  | `string[]` | An array of selected shape ids                      |
| `camera`       | `object`   | An object describing the camera state               |
| `camera.point` | `number[]` | The camera's `[x, y]` coordinates                   |
| `camera.zoom`  | `number`   | The camera's zoom level                             |
| `pointedId`    | `string`   | (optional) The currently pointed shape id           |
| `hoveredId`    | `string`   | (optional) The currently hovered shape id           |
| `editingId`    | `string`   | (optional) The currently editing shape id           |
| `bindingId`    | `string`   | (optional) The currently editing binding.           |
| `brush`        | `TLBounds` | (optional) A `Bounds` for the current selection box |

### `TLShape`

An object that describes a shape on the page. The shapes in your document should extend this interface with other properties. See [Shape Type](#shape-type).

| Property              | Type                      | Description                                                                            |
| --------------------- | ------------------------- | -------------------------------------------------------------------------------------- |
| `id`                  | `string`                  | The shape's id.                                                                        |
| `type`                | `string`                  | The type of the shape, corresponding to the `type` of a [`TLShapeUtil`](#tlshapeutil). |
| `parentId`            | `string`                  | The id of the shape's parent (either the current page or another shape).               |
| `childIndex`          | `number`                  | the order of the shape among its parent's children                                     |
| `name`                | `string`                  | the name of the shape                                                                  |
| `point`               | `number[]`                | the shape's current `[x, y]` coordinates on the page                                   |
| `rotation`            | `number`                  | (optiona) The shape's current rotation in radians                                      |
| `children`            | `string[]`                | (optional) An array containing the ids of this shape's children                        |
| `handles`             | [`TLHandle{}`](#tlhandle) | (optional) A table of `TLHandle` objects                                               |
| `isLocked`            | `boolean`                 | (optional) True if the shape is locked                                                 |
| `isHidden`            | `boolean`                 | (optional) True if the shape is hidden                                                 |
| `isEditing`           | `boolean`                 | (optional) True if the shape is currently editing                                      |
| `isGenerated`         | `boolean`                 | optional) True if the shape is generated programatically                               |
| `isAspectRatioLocked` | `boolean`                 | (optional) True if the shape's aspect ratio is locked                                  |

### `TLHandle`

An object that describes a relationship between two shapes on the page.

| Property | Type       | Description                                    |
| -------- | ---------- | ---------------------------------------------- |
| `id`     | `string`   | An id for the handle.                          |
| `index`  | `number`   | The handle's order within the shape's handles. |
| `point`  | `number[]` | The handle's `[x, y]` coordinates.             |

When a shape with handles is the only selected shape, the `Renderer` will display its handles. You can respond to interactions with these handles using the `on

### `TLBinding`

An object that describes a relationship between two shapes on the page.

| Property | Type     | Description                                   |
| -------- | -------- | --------------------------------------------- |
| `id`     | `string` | A unique id for the binding.                  |
| `type`   | `string` | The binding's type.                           |
| `fromId` | `string` | The id of the shape where the binding begins. |
| `toId`   | `string` | The id of the shape where the binding begins. |
| `meta`   | `{}`     | Any additional data attached to the binding.  |

### `TLShapeUtil`

The `TLShapeUtil` is an abstract class that you can extend to create utilities for your custom shapes. See [Creating Shapes](#creating-shapes).

### `Utils`

A general purpose utility class.

## Creating Shapes

The `Renderer` component has no built-in shapes. It's up to you to define every shape that you want to see on the canvas. While these shapes are highly reusable between projects, you'll need to define them using the API described below.

> For several example shapes, see the folder `/example/src/shapes/`.

### Shape Type

Your first task is to define an interface for the shape that extends `TLShape`. It must have a `type` property.

```ts
// BoxShape.ts
import type { TLShape } from '@tldraw/core'

export interface BoxShape extends TLShape {
  type: 'box'
  size: number[]
}
```

### Component

Next, use `TLShapeUtil.Indicator` to create a second component for your shape's `Component`. The `Renderer` will use this component to display the shape on the canvas.

```tsx
// BoxComponent.ts

import * as React from 'react'
import { shapeComponent, SVGContainer } from '@tldraw/core'
import type { BoxShape } from './BoxShape'

export const BoxComponent = TLShapeUtil.Component<BoxShape, SVGSVGElement>(
  ({ shape, events, meta }, ref) => {
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
  }
)
```

Your component can return HTML elements or SVG elements. If your shape is returning only SVG elements, wrap it in an `SVGContainer`. If your shape returns HTML elements, wrap it in an `HTMLContainer`. Not that you must set `pointerEvents` manually on the shapes you wish to receive pointer events.

The component will receive the following props:

| Name            | Type       | Description                                                                             |
| --------------- | ---------- | --------------------------------------------------------------------------------------- |
| `shape`         | `TLShape`  | The shape from `page.shapes` that is being rendered.                                    |
| `meta`          | {}         | The value provided to the `Renderer`'s `meta` prop.                                     |
| `events`        | {}         | Several pointer events that should be set on the container element.                     |
| `isSelected`    | `boolean`  | Whether the current shape is selected (true if its `id` is in `pageState.selectedIds`). |
| `isHovered`     | `boolean`  | Whether the current shape is hovered (true if its `id` is `pageState.hoveredId`).       |
| `isEditing`     | `boolean`  | Whether the current shape is editing (true if its `id` is `pageState.editingId`).       |
| `onShapeChange` | `Function` | The callback provided to the `Renderer`'s `onShapeChange` prop.                         |
| `onShapeBlur`   | `Function` | The callback provided to the `Renderer`'s `onShapeBlur` prop.                           |

### Indicator

Next, use `TLShapeUtil.Indicator` to create a second component for your shape's `Indicator`. This component is shown when the shape is hovered or selected. Your `Indicator` must return SVG elements only.

```tsx
// BoxIndicator.ts

export const BoxIndicator = TLShapeUtil.Indicator<BoxShape>(({ shape }) => {
  return (
    <rect
      fill="none"
      stroke="dodgerblue"
      strokeWidth={1}
      width={shape.size[0]}
      height={shape.size[1]}
    />
  )
})
```

The indicator component will receive the following props:

| Name         | Type      | Description                                                                             |
| ------------ | --------- | --------------------------------------------------------------------------------------- |
| `shape`      | `TLShape` | The shape from `page.shapes` that is being rendered.                                    |
| `meta`       | {}        | The value provided to the `Renderer`'s `meta` prop.                                     |
| `user`       | `TLUser`  | The user when shown in a multiplayer session.                                           |
| `isSelected` | `boolean` | Whether the current shape is selected (true if its `id` is in `pageState.selectedIds`). |
| `isHovered`  | `boolean` | Whether the current shape is hovered (true if its `id` is `pageState.hoveredId`).       |

### ShapeUtil

Next, create a "shape util" for your shape. This is a class that extends `TLShapeUtil`. The `Renderer` will use an instance of this class to answer questions about the shape: what it should look like, where it is on screen, whether it can rotate, etc.

```ts
// BoxUtil.ts

import { Utils, TLBounds, TLShapeUtil } from '@tldraw/core'
import { BoxComponent } from './BoxComponent'
import { BoxIndicator } from './BoxIndicator'
import type { BoxShape } from './BoxShape'

export class BoxUtil extends TLShapeUtil<BoxShape, SVGSVGElement> {
  Component = BoxComponent

  Indicator = BoxIndicator

  getBounds = (shape: BoxShape): TLBounds => {
    const [width, height] = shape.size

    const bounds = {
      minX: 0,
      maxX: width,
      minY: 0,
      maxY: height,
      width,
      height,
    }

    return Utils.translateBounds(bounds, shape.point)
  }
}
```

Set the `Component` field to your component and the `Indicator` field to your indicator component. Then define the `getBounds` method. This method will receive a shape and should return a `TLBounds` object.

You may also set the following fields:

| Name               | Type      | Default | Description                                                                                            |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `showCloneHandles` | `boolean` | `false` | Whether to display clone handles when the shape is the only selected shape.                            |
| `hideBounds`       | `boolean` | `false` | Whether to hide the bounds when the shape is the only selected shape.                                  |
| `isStateful`       | `boolean` | `false` | Whether the shape has its own React state. When true, the shape will not be unmounted when off-screen. |

### ShapeUtils Object

Finally, create a mapping of your project's shape utils and the `type` properties of their corresponding shapes. Pass this object to the `Renderer`'s `shapeUtils` prop.

```tsx
// App.tsx

const shapeUtils = {
  box: new BoxUtil(),
  circle: new CircleUtil(),
  text: new TextUtil(),
}

export function App() {
  // ...

  return <Renderer page={page} pageState={pageState} {...etc} shapeUtils={shapeUtils} />
}
```

## Local Development

- Run `yarn` to install dependencies.

- Run `yarn start` to start the development server for the package and for the example.

- Open `localhost:5000` to view the example project.

- Run `yarn test` to execute unit tests via [Jest](https://jestjs.io).

## Community

### Support

Need help? Please [open an issue](https://github.com/tldraw/core/issues/new) for support.

### Discussion

Want to connect with other devs? Visit the [Discord channel](https://discord.gg/s4FXZ6fppJ).

### License

This project is licensed under MIT. If you're using `perfect-freehand` in a commercial product, please consider [becoming a sponsor](https://github.com/sponsors/steveruizok?frequency=recurring&sponsor=steveruizok).

## Author

- [@steveruizok](https://twitter.com/steveruizok)
