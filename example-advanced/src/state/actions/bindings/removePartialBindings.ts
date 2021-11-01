import type { TLPointerInfo } from '@tldraw/core'
import type { Action } from 'state/constants'

export const removePartialBindings: Action = (data, payload: TLPointerInfo) => {
  const { selectedIds } = data.pageState

  // Remove bindings from selected shapes to shapes that aren't also selected
  selectedIds.forEach((id) => {
    const shape = data.page.shapes[id]
    if (shape.type === 'arrow') {
      Object.values(shape.handles).forEach((handle) => {
        if (handle.bindingId === undefined) return

        const binding = data.page.bindings[handle.bindingId]

        if (binding && !selectedIds.includes(binding.toId)) {
          delete data.page.bindings[handle.bindingId]
          delete handle.bindingId
        }
      })
    }
  })
}
