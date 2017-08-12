/* global describe, it, expect */

import { Notebook } from '../../lib/notebook'

describe('Notebook', () => {
  describe('items', () => {
    it('should support to listen to changes', (done) => {
      const nb = new Notebook(null)
      const item = { aa: 10 }

      nb.addItem({ bb: 20 })
      nb.onChange(() => {
        expect(nb.getItems()[1]).toEqual(item)
        done()
      })
      nb.addItem(item)
    })

    it('should support stop listening to changes', (done) => {
      const nb = new Notebook(null)
      const item = { aa: 10 }
      let called = false

      const stop = nb.onChange(() => {
        called = true
      })
      stop()
      nb.addItem(item)

      setTimeout(() => {
        expect(called).toBe(false)
        done()
      }, 1000)
    })

    it('should support removing all items', (done) => {
      const nb = new Notebook(null)
      nb.addItem({aa: 10})
      nb.addItem({bb: 20})

      expect(nb.getItems().length).toBe(2)
      nb.onChange(() => {
        expect(nb.getItems()).toEqual([])
        done()
      })
      nb.removeAll()
    })
  })

  describe('functions', () => {
    it('should run a registered function', async (done) => {
      const keyfile = { name: 'Super Wallet' }
      const nb = new Notebook(keyfile)

      nb.registerFunction('printName', (api) => {
        setTimeout(() => {
          api.addItem({
            type: 'log',
            message: api.keyfile.name
          })
        })
        return api.keyfile.name
      })

      nb.onChange(() => {
        expect(nb.getItems()[0]).toEqual({ type: 'log', message: keyfile.name })
        done()
      })

      const response = await nb.run(`
        printName()
      `)
      expect(response).toBe(keyfile.name)
    })

    it('should catch errors when running', (done) => {
      const nb = new Notebook(null)
      nb.run('someBadFunction()')
        .catch((err) => {
          expect(err.message).toMatch(/someBadFunction is not defined/)
          done()
        })
    })
  })
})
