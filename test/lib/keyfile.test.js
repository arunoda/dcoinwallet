/* global describe, it, expect */

import Keyfile from '../../lib/keyfile'

describe('Keyfile', () => {
  describe('create', () => {
    it('should contain necessory fields', () => {
      const payload = Keyfile.create('password', { keyCount: 2 })
      expect(payload.meta).toEqual({
        network: 'testnet',
        allowReuse: true,
        keyCount: 2
      })
      expect(payload.addresses.length).toBe(2)
      expect(typeof payload.encryptedKeyPairs).toBe('string')
      expect(typeof payload.salt).toBe('string')
    })
  })

  describe('getAddress', () => {
    describe('with allowReuse', () => {
      const payload = Keyfile.create('password', { keyCount: 2 })
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
      const payload = Keyfile.create('password', {
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
})
