/* global prompt */
import React from 'react'
import Container from '~/components/wallet/ItemContainer'
import bitcoin from 'bitcoinjs-lib'
import fetch from 'unfetch'

export default class CreateTransaction extends React.Component {
  state = {}

  componentDidMount () {
    const password = prompt('Enter keyfile password:').trim()
    try {
      const tx = this.create(password)
      this.setState({ currentState: 'READY', tx })
    } catch (error) {
      this.setState({ error })
    }
  }

  create (password) {
    const { data } = this.props
    const amount = data.amount * 100000000
    const tx = this.buildTransaction(password, amount, 0)

    // get the feerate dynamically
    const totalFees = tx.byteLength() * 300
    const actualTx = this.buildTransaction(password, amount, totalFees)

    return actualTx
  }

  buildTransaction (password, amount, totalFees = 0) {
    const { data, notebook } = this.props
    const coins = notebook.blockchain.getCoins()
    const confirmedCoins = coins.filter((coin) => coin.confirmations > 0)

    // TODO: check these coins inside a input of a pending transaction

    // pick coins
    const pickedCoins = []
    let remainingAmount = amount + totalFees
    let totalCoinValue = 0

    while (remainingAmount > 0) {
      const coin = confirmedCoins.pop()
      if (!coin) break
      pickedCoins.push(coin)
      remainingAmount -= coin.value
      totalCoinValue += coin.value
    }

    if (remainingAmount >= 0) {
      throw new Error(`Not enough balance to send the amount: ${data.amount} BTC`)
    }

    // create the transaction payload
    const network = bitcoin.networks[notebook.keyfile.payload.meta.network]
    const tx = new bitcoin.TransactionBuilder(network)
    pickedCoins.forEach(({ transaction, index }) => {
      tx.addInput(transaction, index)
    })

    tx.addOutput(data.to, amount)
    tx.addOutput(notebook.keyfile.getAddress(), totalCoinValue - amount - totalFees)

    pickedCoins.forEach(({ address }, index) => {
      const key = notebook.keyfile.getKey(password, address)
      tx.sign(index, key)
    })

    return tx.build()
  }

  send () {
    const { notebook } = this.props
    const { tx } = this.state
    const payload = { hex: tx.toHex() }
    const network = notebook.keyfile.payload.meta.network === 'testnet' ? 'tbtc' : 'btc'

    this.setState({ currentState: 'SENDING' })
    fetch(`http://${network}.blockr.io/api/v1/tx/push`, {
      body: JSON.stringify(payload),
      method: 'POST'
    })
      .then(res => res.json())
      .then((payload) => {
        if (payload.status === 'success') {
          this.setState({ currentState: 'SENT' })
        } else {
          const error = new Error(JSON.stringify(payload))
          this.setState({ error })
        }
      })
      .catch((error) => {
        this.setState({ currentState: 'ERROR', error })
      })
  }

  getAction () {
    const { currentState } = this.state
    switch (currentState) {
      case 'READY':
        return (
          <button className='send' onClick={() => this.send()}>SEND</button>
        )
      case 'SENT':
        return (<div>SENT</div>)
      case 'SENDING':
        return (<div>SENDING ...</div>)
    }
  }

  getContent () {
    const { error, tx } = this.state
    if (error) {
      return (
        <div>
          Error: {error.message}
          <style jsx>{`
            div {
              color: red;
              font-size: 14px;
            }
          `}</style>
        </div>
      )
    }

    if (tx) {
      return (
        <div>
          <div className='payload'>{tx.toHex()}</div>
          <div className='action'>
            {this.getAction()}
          </div>
          <style jsx>{`
            .payload {
              background-color: #FEFEFE;
              font-family: monospace;
              font-size: 14px;
              word-wrap: break-word;
            }

            .action {
              margin: 3px 0 0 0;
              padding: 3px 0 0 0;
              border-top: 2px solid #FF5722;
            }

            .action :global(button),
            .action :global(div) {
              font-size: 12px;
              font-weight: 600;
            }
          `}</style>
        </div>
      )
    }
  }

  render () {
    return (
      <Container>
        <div className='wrapper'>
          { this.getContent() }
        </div>
        <style jsx>{`
          .wrapper {
            padding: 10px;
          }
        `}</style>
      </Container>
    )
  }
}
