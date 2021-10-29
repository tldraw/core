import { render, screen } from '@testing-library/react'
import * as React from 'react'
import { CenterHandle } from './center-handle'

jest.spyOn(console, 'error').mockImplementation(() => void null)

describe('CenterHandle', () => {
  test('mounts component without crashing', () => {
    render(
      <CenterHandle
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        isLocked={false}
        isHidden={false}
      />
    )
  })
  test('validate attributes for a center handle', () => {
    render(
      <CenterHandle
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        isLocked={false}
        isHidden={false}
      />
    )
    const centerHandle = screen.getByLabelText('center handle')
    expect(centerHandle?.getAttribute('height')).toBe('102')
    expect(centerHandle?.getAttribute('width')).toBe('102')
    expect(centerHandle?.getAttribute('x')).toBe('-1')
    expect(centerHandle?.getAttribute('y')).toBe('-1')
  })
  test('validate attributes for a center handle', () => {
    render(
      <CenterHandle
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        isLocked={false}
        isHidden={false}
      />
    )
    const centerHandle = screen.getByLabelText('center handle')
    expect(centerHandle?.getAttribute('height')).toBe('102')
    expect(centerHandle?.getAttribute('width')).toBe('102')
    expect(centerHandle?.getAttribute('opacity')).toBe('1')
    expect(centerHandle?.getAttribute('x')).toBe('-1')
    expect(centerHandle?.getAttribute('y')).toBe('-1')
  })
  test('validate attributes for a hidden center handle', () => {
    render(
      <CenterHandle
        bounds={{ minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 }}
        isLocked={false}
        isHidden={true}
      />
    )
    const centerHandle = screen.getByLabelText('center handle')
    expect(centerHandle?.getAttribute('height')).toBe('102')
    expect(centerHandle?.getAttribute('width')).toBe('102')
    expect(centerHandle?.getAttribute('opacity')).toBe('0')
    expect(centerHandle?.getAttribute('x')).toBe('-1')
    expect(centerHandle?.getAttribute('y')).toBe('-1')
  })
})
