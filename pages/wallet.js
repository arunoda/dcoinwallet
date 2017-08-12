import React from 'react'
import Layout from '~/components/Layout'
import notebook from '~/lib/notebook'

export default class Wallet extends React.Component {
  state = { error: null }

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
      .catch((error) => {
        this.setState({ error })
      })
  }

  render () {
    const { error } = this.state

    return (
      <Layout>
        <div className='paper'>
          <div className='information' />
          <div className='items' />
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
      </Layout>
    )
  }
}
