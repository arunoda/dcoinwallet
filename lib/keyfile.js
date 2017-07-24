export default class Keyfile {
  static create (keycount, options = {}) {
    const { network = 'testnet', allowReuse = true } = options

    return { network, allowReuse }
  }
}
