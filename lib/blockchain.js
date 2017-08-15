import fetch from 'unfetch'

export default class Blockchain {
  constructor (network, addresses) {
    this.addresses = new Set(addresses)
    this.network = network
  }

  _toCoinId (txHash, outputIndex) {
    return `${txHash}::${outputIndex}`
  }

  buildCoins () {
    const coinMap = new Map()
    const usedCoins = {}

    this.transactions.forEach((tx) => {
      // If the input has an coin where we own the address, delete the coin.
      tx.inputs.forEach((input) => {
        const { transaction, index } = input.output
        const coinId = this._toCoinId(transaction, index)
        usedCoins[coinId] = true
      })
    })

    this.transactions.forEach((tx) => {
      // If the output has an address we own, make it a coin.
      tx.outputs.forEach((output, index) => {
        // We don't own this coin
        if (!this.addresses.has(output.address)) return

        const coinId = this._toCoinId(tx.hash, index)
        // We've used this coin
        if (usedCoins[coinId]) return

        coinMap.set(coinId, {
          transaction: tx.hash,
          index,
          value: output.value,
          address: output.address,
          confirmations: tx.confirmations
        })
      })
    })

    this.coins = Array.from(coinMap.values())
  }

  // TODO: throttle fetching transactions
  async sync () {
    const fetchAll = Array.from(this.addresses).map((a) => this.fetchTransaction(a))
    const transactionsList = await Promise.all(fetchAll)
    const transactions = transactionsList
      .reduce((all, txList) => all.concat(txList), [])
      .sort((tx1, tx2) => tx1.block.height - tx2.block.height)

    this.transactions = new Set(transactions)
  }

  // TODO: Add retrying
  // TODO: Add support for pagination
  async fetchTransaction (address) {
    const networkCode = this.network === 'testnet' ? 'tbtc' : 'btc'
    const endpoint = `https://api.blocktrail.com/v1/${networkCode}/address/${address}/transactions?api_key=MY_APIKEY&sort_dir=desc&limit=200`

    const res = await fetch(endpoint)
    const { data } = await res.json()

    const transactions = data.map(item => ({
      hash: item.hash,
      confirmations: item.confirmations,
      block: {
        hash: item.block_hash,
        height: item.block_height
      },
      timestamp: (new Date(item.time)).getTime(),
      inputs: item.inputs.map(input => ({
        address: input.address,
        output: {
          transaction: input.output_hash,
          index: input.output_index
        },
        value: input.value
      })),
      outputs: item.outputs.map(output => ({
        address: output.address,
        value: output.value
      }))
    }))

    return transactions
  }

  getCoins () {
    return JSON.parse(JSON.stringify(this.coins))
  }

  getTransactions () {
    return JSON.parse(JSON.stringify(Array.from(this.transactions)))
  }
}
