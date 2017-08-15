import React from 'react'
import Container from '~/components/wallet/ItemContainer'

export default class Sync extends React.Component {
  state = { currentState: 'READY' }

  componentDidMount () {
    const { notebook } = this.props
    this.setState({ currentState: 'SYNC' })

    notebook.blockchain.sync()
      .then(() => {
        notebook.blockchain.buildCoins()
        this.setState({ currentState: 'READY' })
      })
      .catch((error) => {
        this.setState({ currentState: 'ERROR', error })
      })
  }

  getContent () {
    const { currentState, error } = this.state
    switch (currentState) {
      case 'SYNC':
        return (
          <div>
            Syncing ...
            <style jsx>{`
              div {
                color: blue;
              }
            `}</style>
          </div>
        )
      case 'READY':
        return (
          <div>
            Synced
            <style jsx>{`
              div {
                color: green;
              }
            `}</style>
          </div>
        )
      case 'ERROR':
        return (
          <div>
            {error.message}
            <style jsx>{`
              div {
                color: red;
              }
            `}</style>
          </div>
        )
    }
  }

  render () {
    return (
      <Container>
        <div className='sync'>
          { this.getContent() }
          <style jsx>{`
            .sync {
              padding: 10px;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: 600;
            }
          `}</style>
        </div>
      </Container>
    )
  }
}
