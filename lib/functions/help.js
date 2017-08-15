export default (api) => {
  const text = `
* help()- get this help message
* info()- get information about the wallet
* getAddress()- get an address from the wallet
* showCoins()- show all upspent coins
* getCoins()- get all unspent coins
* crateTransaction(toAddress, amount)- create a transaction
  `.trim()

  setTimeout(() => {
    api.addItem({ type: 'log', text })
  }, 10)
}
