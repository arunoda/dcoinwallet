export default (api) => {
  const { payload } = api.keyfile
  const text = `
    Wallet Name: ${payload.name}
    Network: ${payload.meta.network}
    No. of keys: ${payload.meta.keyCount}
    Reuse keys: ${String(payload.meta.allowReuse)}
  `

  api.addItem({ type: 'log', text })
}