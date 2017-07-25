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
})
