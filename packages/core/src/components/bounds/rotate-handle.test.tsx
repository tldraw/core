import { renderWithContext } from '~test'
import * as React from 'react'
import { RotateHandle } from './rotate-handle'

jest.spyOn(console, 'error').mockImplementation(() => void null)

describe('RotateHandle', () => {
  test('mounts component without crashing', () => {
    renderWithContext(
      <RotateHandle
        targetSize={20}
        size={10}
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        isHidden={false}
      />
    )
  })
})
