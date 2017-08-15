export default (api) => {
  setTimeout(() => {
    api.addItem({ type: 'coins' })
  }, 10)
}
