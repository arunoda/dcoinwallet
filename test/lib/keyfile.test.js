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
})
