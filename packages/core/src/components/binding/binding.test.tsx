import { render } from '@testing-library/react'
import * as React from 'react'
import { Binding } from './binding'

jest.spyOn(console, 'error').mockImplementation(() => void null)

describe('binding', () => {
  test('mounts component without crashing', () => {
    render(<Binding point={[0, 0]} type={'anchor'} />)
  })
  test('validate attributes rendered properly for anchor binding type', () => {
    const { container } = render(<Binding point={[10, 20]} type={'anchor'} />)
    const use = container.querySelector('use')
    expect(use?.getAttribute('href')).toBe('#cross')
    expect(use?.getAttribute('x')).toBe('10')
    expect(use?.getAttribute('y')).toBe('20')
  })
  test('validate attributes rendered properly for center binding type', () => {
    const { container } = render(<Binding point={[10, 20]} type={'center'} />)
    const circle = container.querySelector('circle')
    expect(circle?.getAttribute('cx')).toBe('10')
    expect(circle?.getAttribute('cy')).toBe('20')
    expect(circle?.getAttribute('r')).toBe('8')
  })
  test('validate no children should be rendered for pin binding type', () => {
    const { container } = render(<Binding point={[10, 20]} type={'pin'} />)
    const group = container.querySelector('g')
    expect(group?.hasChildNodes()).toBe(false)
  })
})
