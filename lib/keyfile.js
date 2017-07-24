import bitcoin from 'bitcoinjs-lib'
import randomBytes from 'randombytes'
import AES from 'aes-js'

function encrypt (password, salt, input) {
  const key = bitcoin.crypto.sha256(`${password}${salt}`)
  const inputBytes = AES.utils.utf8.toBytes(input)

  const AesCtr = AES.ModeOfOperation.ctr
  const aesCtr = new AesCtr(key)
  const encryptedBytes = aesCtr.encrypt(inputBytes)

  return AES.utils.hex.fromBytes(encryptedBytes)
}

export default class Keyfile {
  static create (password, options = {}) {
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
}
