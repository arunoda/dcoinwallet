export default class Notebook {
  constructor (keyfile) {
    this.keyfile = keyfile
    this.items = []
    this.onChangeCallbacks = new Set()
  }

  getItems () {
    return JSON.parse(JSON.stringify(this.items))
  }

  addItem (item) {
    this.items.push(item)
    this._fireAll()
  }

  removeAll () {
    this.items = []
    this._fireAll()
  }

  _fireAll () {
    this.onChangeCallbacks.forEach(cb => cb())
  }

  onChange (cb) {
    this.onChangeCallbacks.add(cb)
    return () => {
      this.onChangeCallbacks.delete(cb)
    }
  }
}
