import fetch from 'unfetch'

export default class Blockchain {
  constructor (network, addresses) {
    this.addresses = addresses
    this.network = network
  }

  async sync () {

  }

  // TODO: Add support for pagination
  // TODO: Add retrying
  async getTransactions (address) {
    const networkCode = this.network === 'testnet' ? 'tbtc' : 'btc'
    const endpoint = `https://api.blocktrail.com/v1/${networkCode}/address/${address}/transactions?api_key=MY_APIKEY&sort_dir=desc&limit=200`

    const res = await fetch(endpoint)
    const { data } = await res.json()

    const transactions = data.map(item => ({
      hash: item.hash,
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
}
