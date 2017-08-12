import vm from 'vm-browserify'

export class Notebook {
  constructor (keyfile) {
    this.keyfile = keyfile
    this.items = []
    this.onChangeCallbacks = new Set()
    this.functionMap = {}
  }

  setKeyfile (keyfile) {
    this.keyfile = keyfile
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

  registerFunction (name, callback) {
    const api = {
      addItem: (item) => this.addItem(item),
      removeAll: () => this.removeAll(),
      keyfile: this.keyfile
    }

    this.functionMap[name] = () => {
      return callback(api)
    }
  }

  run (code) {
    const context = {
      ...this.functionMap,
      keyfile: this.keyfile
    }

    return new Promise((resolve, reject) => {
      try {
        const result = vm.runInNewContext(code, context)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
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

const notebook = new Notebook()
export default notebook
