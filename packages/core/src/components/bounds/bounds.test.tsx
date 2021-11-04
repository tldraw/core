import { renderWithContext } from '~test'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as React from 'react'
import { Bounds } from './bounds'

describe('bounds', () => {
  test('mounts component without crashing', () => {
    renderWithContext(
      <Bounds
        zoom={1}
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        rotation={0}
        viewportWidth={1000}
        isLocked={false}
        isHidden={false}
        hideBindingHandles={false}
        hideCloneHandles={false}
        hideRotateHandle={false}
      />
    )
  })
  test('validate all attributes of bounds commponent', () => {
    renderWithContext(
      <Bounds
        zoom={1}
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        rotation={0}
        viewportWidth={1000}
        isLocked={false}
        isHidden={false}
        hideBindingHandles={false}
        hideCloneHandles={false}
        hideRotateHandle={false}
      />
    )

    expect(screen.getByLabelText('center handle')).toBeDefined()
    expect(screen.getByLabelText('top_edge handle')).toBeDefined()
    expect(screen.getByLabelText('bottom_edge handle')).toBeDefined()
    expect(screen.getByLabelText('left_edge handle')).toBeDefined()
    expect(screen.getByLabelText('right_edge handle')).toBeDefined()
    expect(screen.getAllByLabelText('corner transparent').length).toBe(4)
    expect(screen.getAllByLabelText('corner handle').length).toBe(4)
  })
})
