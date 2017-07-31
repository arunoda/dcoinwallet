/* global describe, it, expect */

import Keyfile from '../../lib/keyfile'

describe('Keyfile', () => {
  describe('create', () => {
    it('should contain necessory fields', () => {
      const payload = Keyfile.create('name', 'password', { keyCount: 2 })
      expect(payload.meta).toEqual({
        network: 'testnet',
        allowReuse: true,
        keyCount: 2
      })
      expect(payload.addresses.length).toBe(2)
      expect(typeof payload.keyPairs.encrypted).toBe('string')
      expect(typeof payload.keyPairs.hash).toBe('string')
      expect(typeof payload.salt).toBe('string')
    })
  })

  describe('getName', () => {
    it('should give the provided name of the keyfile', () => {
      const payload = Keyfile.create('the-name', 'password', { keyCount: 2 })
      const keyfile = Keyfile.import(payload)

      expect(keyfile.getName()).toBe('the-name')
    })
  })

  describe('getAddress', () => {
    describe('with allowReuse', () => {
      const payload = Keyfile.create('name', 'password', { keyCount: 2 })
      const givenAddresses = {}

      it('should give all the address in a random order', () => {
        const keyfile = Keyfile.import(payload)
        for (let lc = 0; lc < 100; lc++) {
          givenAddresses[keyfile.getAddress()] = true
        }

        expect(Object.keys(givenAddresses).length).toBe(2)
      })
    })

    describe('without allowReuse', () => {
      const payload = Keyfile.create('name', 'password', {
        keyCount: 2,
        allowReuse: false
      })

      it('should not give reused addresses', () => {
        const keyfile = Keyfile.import(payload)
        keyfile.markAddressUsed(payload.addresses[0])

        for (let lc = 0; lc < 100; lc++) {
          expect(keyfile.getAddress()).toBe(payload.addresses[1])
        }
      })

      it('should return null if there are no addresses', () => {
        const keyfile = Keyfile.import(payload)
        keyfile.markAddressUsed(payload.addresses[0])
        keyfile.markAddressUsed(payload.addresses[1])

        expect(keyfile.getAddress()).toBe(null)
      })
    })
  })

  describe('getKey', () => {
    const payload = Keyfile.create('name', 'password', {
      keyCount: 2,
      allowReuse: false
    })

    it('should decrypt and get the relevant key', () => {
      const keyfile = Keyfile.import(payload)
      const address = keyfile.getAddress()
      const key = keyfile.getKey('password', address)

      expect(key.getAddress()).toBe(address)
    })

    it('should return null if there is no key for the address', () => {
      const keyfile = Keyfile.import(payload)
      const key = keyfile.getKey('password', 'fake-address')

      expect(key).toBe(null)
    })

    it('should throw if the password is incorrect', () => {
      const keyfile = Keyfile.import(payload)
      const address = keyfile.getAddress()
      const run = () => keyfile.getKey('wrong-password', address)

      expect(run).toThrow(/Incorrect password/)
    })
  })
})
