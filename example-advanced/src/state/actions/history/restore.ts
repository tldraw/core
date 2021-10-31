import type { Action } from 'state/constants'
import { mutables } from '../../mutables'

export const restore: Action = (data) => {
  const snapshot = mutables.history.restore()
  Object.assign(data, snapshot)
}
