export default (api) => {
  setTimeout(() => {
    api.addItem({ type: 'sync' })
  }, 0)
}
