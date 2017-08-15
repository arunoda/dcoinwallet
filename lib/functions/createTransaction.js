export default (api, to, amount, options = {}) => {
  setTimeout(() => {
    api.addItem({
      type: 'createTransaction',
      to,
      amount,
      options
    })
  }, 0)
}
