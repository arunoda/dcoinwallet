import vm from 'vm-browserify'
import functionMap from './functions'
import Blockchain from './blockchain'

export class Notebook {
  constructor (keyfile) {
    this.keyfile = keyfile
    this.items = []
    this.onChangeCallbacks = new Set()
    this.functionMap = {}
  }

  setKeyfile (keyfile) {
    this.keyfile = keyfile
    this.blockchain = new Blockchain(
      this.keyfile.payload.meta.network,
      this.keyfile.payload.addresses
    )
    this.items = []
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

  async sync () {
    await this.blockchain.sync()
    this.blockchain.buildCoins()

    // implement allow and disable reuse feature
    if (!this.keyfile.payload.meta.allowReuse) {
      const transactions = this.blockchain.getTransactions()
      transactions.forEach((tx) => {
        tx.outputs.forEach((output) => {
          this.keyfile.markAddressUsed(output.address)
        })
      })
    }
  }

  registerFunction (name, callback) {
    this.functionMap[name] = () => {
      const api = {
        addItem: (item) => this.addItem(item),
        removeAll: () => this.removeAll(),
        keyfile: this.keyfile,
        blockchain: this.blockchain
      }
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
Object.keys(functionMap).forEach((name) => {
  notebook.registerFunction(name, functionMap[name])
})
export default notebook
