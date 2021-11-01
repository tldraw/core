import type { TLBinding } from '@tldraw/core'
import { nanoid } from 'nanoid'
import type { Action } from 'state/constants'

export const createBindings: Action = (
  data,
  payload: { bindings: (Partial<TLBinding> & Pick<TLBinding, 'fromId' | 'toId'>)[] }
) => {
  try {
    payload.bindings.forEach((partial) => {
      const binding = {
        id: nanoid(),
        ...partial,
      }

      data.page.bindings[binding.id] = binding
    })
  } catch (e: any) {
    e.message = 'Could not create shapes: ' + e.message
    console.error(e)
  }
}
