import type { machine } from './machine'

export class TLExampleApi {
  constructor(private _machine: typeof machine) {}

  cancel = () => {
    this.machine.send('CANCELLED')
  }

  delete = () => {
    this.machine.send('DELETED')
  }

  selectAll = () => {
    this.machine.send('SELECTED_ALL')
  }

  deselectAll = () => {
    this.machine.send('DESELECTED_ALL')
  }

  zoomToFit = () => {
    this.machine.send('ZOOMED_TO_FIT')
  }

  zoomToSelection = () => {
    this.machine.send('ZOOMED_TO_SELECTION')
  }

  zoomIn = () => {
    this.machine.send('ZOOMED_IN')
  }

  zoomOut = () => {
    this.machine.send('ZOOMED_OUT')
  }

  undo = () => {
    this.machine.send('UNDO')
  }

  redo = () => {
    this.machine.send('REDO')
  }

  send = this._machine.send

  isIn = this._machine.isIn

  isInAny = this._machine.isInAny

  log = this._machine.log

  get machine() {
    return this._machine
  }

  get lastEvent() {
    return this.log[0]
  }
}
