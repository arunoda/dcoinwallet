import bitcoin from 'bitcoinjs-lib'
import randomBytes from 'randombytes'
import AES from 'aes-js'
import createHmac from 'create-hmac'

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

  getKey (password, address) {
    const { salt, keyPairs, meta } = this.payload
    const keyPairsJson = decrypt(password, salt, keyPairs.encrypted)
    const hash = bitcoin.crypto.sha256(keyPairsJson).toString('hex')

    if (hash !== keyPairs.hash) {
      throw new Error('Incorrect password')
    }

    const keys = JSON.parse(keyPairsJson)
    const keyWIF = keys[address]
    if (!keyWIF) return null

    return bitcoin.ECPair.fromWIF(keyWIF, bitcoin.networks[meta.network])
  }
}

function generateKey (password, salt) {
  const hmac = createHmac('sha256', Buffer.from(salt, 'utf8'))
  hmac.update(password)
  return hmac.digest()
}

function encrypt (password, salt, input) {
  const key = generateKey(password, salt)
  const inputBytes = AES.utils.utf8.toBytes(input)

  const AesCtr = AES.ModeOfOperation.ctr
  const aesCtr = new AesCtr(key)
  const encryptedBytes = aesCtr.encrypt(inputBytes)

  return AES.utils.hex.fromBytes(encryptedBytes)
}

function decrypt (password, salt, encryptedHex) {
  const key = generateKey(password, salt)
  const encryptedBytes = AES.utils.hex.toBytes(encryptedHex)

  const AesCtr = AES.ModeOfOperation.ctr
  const aesCtr = new AesCtr(key)
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)

  return AES.utils.utf8.fromBytes(decryptedBytes)
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

  const keyPairsJSON = JSON.stringify(keyPairs)
  const encryptedKeyPairs = encrypt(
    password, salt, keyPairsJSON
  )

  const payload = {
    salt,
    meta: { network, allowReuse, keyCount },
    addresses,
    keyPairs: {
      encrypted: encryptedKeyPairs,
      hash: bitcoin.crypto.sha256(keyPairsJSON).toString('hex')
    }
  }

  return payload
}

Keyfile.import = function (payload) {
  return new Keyfile(payload)
}
