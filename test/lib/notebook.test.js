/* global describe, it, expect */

import Notebook from '../../lib/notebook'

describe('Notebook', () => {
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
