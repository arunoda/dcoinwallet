import React from 'react'
import Layout from '~/components/Layout'
import notebook from '~/lib/notebook'

import Items from '~/components/wallet/Items'

export default class Wallet extends React.Component {
  state = { error: null, currentState: null }

  componentDidMount () {
    if (!notebook.keyfile) {
      this.setState({ currentState: 'NO_KEYFILE' })
      return
    }

    this.setState({ currentState: 'SYNC' })
    notebook.sync()
      .then(() => {
        this.setState({ currentState: 'READY' })
      })
      .catch((error) => {
        this.setState({ currentState: 'ERROR', error })
      })
  }

  onShellKeyEnter (e) {
    // Make sure to clear errors for any keystroke
    this.setState({ error: null })
    // Only process if this is SHIFT + ENTER
    if (!(e.keyCode === 13 && e.shiftKey)) return

    // Do for add the new line.
    e.preventDefault()

    const code = this.shell.value
    this.shell.value = ''
    notebook.run(code)
      .then((result) => {
        notebook.addItem({
          type: 'code',
          code,
          result
        })
      })
      .catch((error) => {
        this.setState({ error })
      })
  }

  renderPaper () {
    const { error } = this.state

    return (
      <div>
        <div className='paper'>
          <div className='information' />
          <div className='items'>
            <Items notebook={notebook} />
          </div>
          <div className='shell'>
            {error ? (<div className='error'>{error.message}</div>) : null}
            <textarea
              ref={(r) => { this.shell = r }}
              onKeyDown={(e) => this.onShellKeyEnter(e)}
            />
            <div className='instructions'>To run, type "SHIFT + ENTER"</div>
          </div>
        </div>
        <style jsx>{`
          .paper {
            width: 650px;
          }

          .shell textarea {
            display: block;
            width: 100%;
            height: 18px;
            font-size: 14px;
            padding: 10px;
            font-family: monospace;
            outline: 0;
            border: 1px solid #EEE;
            margin: 5px 0;
          }

          .shell .instructions {
            font-size: 12px;
            color: #888;
          }

          .shell .error {
            font-size: 12px;
            color: red;
          }
        `}</style>
      </div>
    )
  }

  renderError () {
    const { error } = this.state
    return (
      <div>
        <h3>Error</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  getContent () {
    const { currentState } = this.state

    switch (currentState) {
      case 'NO_KEYFILE':
        return (<div>No Keyfile Found!</div>)
      case 'SYNC':
        return (<div>Syncing</div>)
      case 'ERROR':
        return this.renderError()
      case 'READY':
        return this.renderPaper()
    }
  }

  render () {
    return (
      <Layout>
        { this.getContent() }
      </Layout>
    )
  }
}
