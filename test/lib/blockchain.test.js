/* global describe, it, expect */

import Blockchain from '../../lib/blockchain'

describe('Blockchain', () => {
  describe('fetchTransaction', () => {
    it('should get transactions for a given address', async () => {
      const chain = new Blockchain('testnet', [])
      const transactions = await chain.fetchTransaction('mgAdp2rShLktCWw2cNELyGBaWqu2Ms1G3u')

      expect(transactions[0]).toEqual({
        hash: 'df08e105021fdaf3e2f7859a2af7f45cfe1816b4d685125f3c56b2ff7af195b7',
        block: {
          hash: '000000000000364426dd97b1930093c94625844de9e311260ccdb60c96fee7c0',
          height: 1154932
        },
        timestamp: 1500969440000,
        inputs: [
          {
            address: 'mgAdp2rShLktCWw2cNELyGBaWqu2Ms1G3u',
            output: {
              transaction: 'f56ee7315508dc3cbcc337c17954323476d81f621b801ef60d322d0d8914dadc',
              index: 0
            },
            value: 68650000
          }
        ],
        outputs: [
          { address: 'mkrLJ8yWxCseEdoY29N2JiwPAiAti6RjVh', value: 68540000 },
          { address: 'mnSEDvuEkmu9GtfbjKyYfvBxJ2gR8ZrGTN', value: 100000 }
        ]
      })
    })
  })

  describe('sync', () => {
    it('should merge all transactions from all addresses', async () => {
      const chain = new Blockchain('testnet', ['add1', 'add2'])
      let id = 4
      chain.fetchTransaction = async function (address) {
        return [
          { hash: `${address}-t1`, block: { hash: 'a', height: id-- } },
          { hash: `${address}-t2`, block: { hash: 'b', height: id-- } }
        ]
      }

      await chain.sync()

      // It should merge with the ordering block.height with desc. order.
      expect(chain.getTransactions()).toEqual([
        { hash: `add2-t2`, block: { hash: 'b', height: 1 } },
        { hash: `add2-t1`, block: { hash: 'a', height: 2 } },
        { hash: `add1-t2`, block: { hash: 'b', height: 3 } },
        { hash: `add1-t1`, block: { hash: 'a', height: 4 } }
      ])
    })
  })

  describe('buildCoins', () => {
    it('should collect all the coins for own addresses', () => {
      const chain = new Blockchain('testnet', ['add1', 'add2'])
      chain.transactions = new Set([
        {
          hash: 'h1',
          inputs: [],
          outputs: [
            { address: 'add1', value: 200 },
            { address: 'add10', value: 200 }
          ]
        },
        {
          hash: 'h2',
          inputs: [],
          outputs: [
            { address: 'add1', value: 10 },
            { address: 'add2', value: 20 }
          ]
        }
      ])

      chain.buildCoins()

      expect(chain.getCoins()).toEqual([
        { transaction: 'h1', index: 0, value: 200, address: 'add1' },
        { transaction: 'h2', index: 0, value: 10, address: 'add1' },
        { transaction: 'h2', index: 1, value: 20, address: 'add2' }
      ])
    })

    it('should remove spent coins', () => {
      const chain = new Blockchain('testnet', ['add1', 'add2'])
      chain.transactions = new Set([
        {
          hash: 'h1',
          inputs: [
            { output: { transaction: 'kkr', index: 1 } }
          ],
          outputs: [
            { address: 'add1', value: 200 },
            { address: 'add10', value: 200 }
          ]
        },
        {
          hash: 'h2',
          inputs: [
            { output: { transaction: 'h1',
              index: 0 } }
          ],
          outputs: [
            { address: 'add1', value: 10 },
            { address: 'add2', value: 20 }
          ]
        }
      ])

      chain.buildCoins()

      expect(chain.getCoins()).toEqual([
        { transaction: 'h2', index: 0, value: 10, address: 'add1' },
        { transaction: 'h2', index: 1, value: 20, address: 'add2' }
      ])
    })
  })
})
