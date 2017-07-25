import bitcoin from 'bitcoinjs-lib'
import randomBytes from 'randombytes'
import AES from 'aes-js'

export default class Keyfile {
  constructor (payload) {
    this.payload = payload
    this.unusedAddresses = this.payload.addresses.map(a => a)
  }

  markAddressUsed (address) {
    const index = this.unusedAddresses.indexOf(address)
    if (index < 0) return
    this.unusedAddresses.splice(index, 1)
  }

  getAddress () {
    if (this.unusedAddresses.length === 0) return null

    const index = Math.floor(Math.random() * this.unusedAddresses.length)
    const address = this.unusedAddresses[index]

    return address
  }
}

function encrypt (password, salt, input) {
  const key = bitcoin.crypto.sha256(`${password}${salt}`)
  const inputBytes = AES.utils.utf8.toBytes(input)

  const AesCtr = AES.ModeOfOperation.ctr
  const aesCtr = new AesCtr(key)
  const encryptedBytes = aesCtr.encrypt(inputBytes)

  return AES.utils.hex.fromBytes(encryptedBytes)
}

Keyfile.create = function (password, options = {}) {
  const {
    keyCount = 100,
    network = 'testnet',
    allowReuse = true
  } = options

  const salt = randomBytes(32).toString('hex')
  const addresses = []
  const keyPairs = {}

  for (let lc = 0; lc < keyCount; lc++) {
    const keyPair = bitcoin.ECPair.makeRandom({
      network: bitcoin.networks[network]
    })

    const address = keyPair.getAddress()
    addresses.push(address)
    keyPairs[address] = keyPair.toWIF()
  }

  const encryptedKeyPairs = encrypt(
    password, salt, JSON.stringify(keyPairs)
  )

  const payload = {
    salt,
    meta: { network, allowReuse, keyCount },
    addresses,
    encryptedKeyPairs
  }

  return payload
}

Keyfile.import = function (payload) {
  return new Keyfile(payload)
}
