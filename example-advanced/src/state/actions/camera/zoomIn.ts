import type { Action } from 'state/constants'
import { Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { mutables } from 'state/mutables'

export const zoomIn: Action = (data) => {
  const { camera } = data.pageState
  const i = Math.round((data.pageState.camera.zoom * 100) / 25)
  const zoom = (i + 1) * 0.25
  const center = Utils.getBoundsCenter(mutables.viewport)
  const p0 = Vec.sub(Vec.div(center, camera.zoom), camera.point)
  const p1 = Vec.sub(Vec.div(center, zoom), camera.point)
  const point = Vec.round(Vec.add(camera.point, Vec.sub(p1, p0)))

  data.pageState.camera.zoom = zoom
  data.pageState.camera.point = point
}
