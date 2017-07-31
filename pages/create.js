/* global window */
import React from 'react'
import Link from 'next/link'
import Keyfile from '../lib/keyfile'

export default class Create extends React.Component {
  state = { currentState: null }

  submit (e) {
    e.preventDefault()
    const name = this.name.value
    const password = this.password.value
    const password2 = this.password2.value
    const keyCount = parseInt(this.keyCount.value)
    const network = this.network.value
    const allowReuse = this.reuseKeys.value === 'true'

    if (name === '') {
      window.alert('Enter a name for your wallet.')
      return
    }

    if (password !== password2) {
      window.alert('Both passwords are not the same.')
      return
    }

    if (password === '') {
      window.alert('Enter a password for your wallet.')
      return
    }

    if (!(keyCount > 1)) {
      window.alert('Key count should be greater than 1')
      return
    }

    this.setState({ currentState: 'CREATE' }, () => {
      setTimeout(() => {
        const payload = Keyfile.create(name, password, { network, keyCount, allowReuse })
        this.setState({
          currentState: 'DOWNLOAD',
          payload
        })
      }, 1000)
    })
  }

  networkChanged () {
    const network = this.network.value
    if (network === 'bitcoin') {
      this.keyCount.value = 100
      this.reuseKeys.value = 'false'
    } else {
      this.keyCount.value = 10
      this.reuseKeys.value = 'true'
    }
  }

  renderLoading () {
    return (
      <div>
        <div>Hang tight...</div>
        <div className='info'>(It'll take a while to generate addresses and keys for your wallet.)</div>
        <style jsx>{`
          .info {
            margin: 5px 0 0 0;
            font-size: 13px;
          }
        `}</style>
      </div>
    )
  }

  renderDownload () {
    const { payload } = this.state
    const { Blob, URL } = window
    const keyFileContent = JSON.stringify(payload, null, 2)
    const keyFileBlob = new Blob([keyFileContent], {type: 'application/json'})

    return (
      <div>
        <div className='download'>
          <a href={URL.createObjectURL(keyFileBlob)} download='keyfile.json'>Click here</a> to download the keyfile for your wallet.
        </div>
        <div className='warning'>
          This <b>keyfile</b> and the <b>password</b> is the key to your wallet. <br />
          Make sure to keep them <b>safe</b> and <b>recoverable</b>. <br />
          There's no way to <b>recover</b> or <b>reset</b>.
        </div>
        <div className='next'>
          <h3>What Next?</h3>
          <div className='link'>
            <Link href='/login'><a>Login to your Wallet</a></Link>
          </div>
          <div className='link'>
            <Link href='/'><a>Go Home</a></Link>
          </div>
        </div>
        <style jsx>{`
          a {
            color: #2196F3;
            text-decoration: none;
            border-bottom: 1px solid #2196F3;
          }

          .download {
            padding: 10px;
            border: 2px solid #388E3C;
            max-width: 550px;
            background-color: #4CAF50;
            color: #FFF;
          }

          .download a {
            color: #FFF;
            font-weight: 600;
            border-bottom: 1px solid #FFF;
          }

          .warning {
            max-width: 550px;
            margin: 30px 0 0 0;
            border: 2px solid #FF9800;
            background-color: #FFECB3;
            padding: 10px;
            font-size: 13px;
          }

          .next {
            margin: 30px 0 0 0;
          }

          .next h3 {
            font-size: 18px;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 0;
            margin: 0 0 10px 0;
          }

          .next a {
            border-bottom: 0;
          }

          .next .link {
            margin: 5px 0;
          }
        `}</style>
      </div>
    )
  }

  renderForm () {
    return (
      <form id='create-form' onSubmit={(e) => this.submit(e)}>
        <div className='input name'>
          <div className='label'>Name</div>
          <div className='description'>
            A name for this wallet.
          </div>
          <input
            className='input-item'
            type='text'
            tabIndex='1'
            ref={(r) => { this.name = r }}
          />
        </div>
        <div className='input password'>
          <div className='label'>Password</div>
          <div className='description'>
            Make sure to create a <a href='https://howsecureismypassword.net/' target='_blank'>very secure password</a> because you keep money behind it.
          </div>
          <input
            className='input-item'
            type='password'
            tabIndex='2'
            ref={(r) => { this.password = r }}
          />
        </div>
        <div className='input password2'>
          <div className='label'>Re-Type Password</div>
          <div className='description'>
            Make sure you typed the password correctly.
          </div>
          <input
            className='input-item'
            type='password'
            tabIndex='3'
            ref={(r) => { this.password2 = r }}
          />
        </div>
        <div className='input network'>
          <div className='label'>Network</div>
          <div className='description'>Select the Bitcoin <a href='https://bitcoin.stackexchange.com/q/7908' target='_blank'>network</a> you want to use.</div>
          <select
            className='input-item'
            tabIndex='4'
            ref={(r) => { this.network = r }}
            onChange={(e) => this.networkChanged(e)}
          >
            <option value='testnet'>Bitcoin Testnet</option>
            <option value='bitcoin'>Bitcoin</option>
          </select>
        </div>
        <div className='input keycount'>
          <div className='label'>No. of Addresses</div>
          <div className='description'>Select the number of Bitcoin addresses to create. <a href='#'>Learn more</a></div>
          <input
            className='input-item'
            type='text'
            defaultValue='10'
            tabIndex='5'
            ref={(r) => { this.keyCount = r }}
          />
        </div>
        <div className='input reuse-keys'>
          <div className='label'>Reuse Addresses</div>
          <div className='description'>Allow to reuse addresses in different transactions. <a href='#'>Learn More</a></div>
          <select
            className='input-item'
            tabIndex='6'
            ref={(r) => { this.reuseKeys = r }}
          >
            <option value='true'>Yes</option>
            <option value='false'>No</option>
          </select>
        </div>
        <div className='submit'>
          <button tabIndex='7'>Create Wallet</button>
        </div>
        <style jsx>{`
          .input {
            margin: 10px 0;
          }

          .input .label {
            font-size: 16px;
            font-weight: 600;
            margin: 0 0 2px 0;
          }

          .input .input-item {
            margin: 5px 0 0 0;
            font-size: 15px;
            padding: 2px 5px;
          }

          .input .description {
            font-size: 13px;
            color: #666;
          }

          .input .description a {
            color: #2196F3;
            text-decoration: none;
          }

          .submit {
            margin: 30px 0 0 0;
          }

          .submit button {
            font-size: 18px;
            background-color: #8BC34A;
            border: 1px solid #689F38;
            border-radius: 2px;
            color: #FFF;
            padding: 3px 15px;
            cursor: pointer;
          }

          .submit button:hover {
            opacity: 0.7;
          }
        `}</style>
      </form>
    )
  }

  renderContent () {
    const { currentState } = this.state

    switch (currentState) {
      case 'CREATE':
        return this.renderLoading()
      case 'DOWNLOAD':
        return this.renderDownload()
      default:
        return this.renderForm()
    }
  }

  render () {
    return (
      <div id='create-page'>
        <h1>Create a Wallet</h1>
        <div className='information'>
          This process will create a file containing a set of Bitcoin addresses and keys. <br />
          They are encrypted with a password you provided. <br />
        </div>
        { this.renderContent() }
        <style jsx>{`
          #create-page {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            -webkit-font-smoothing: antialiased;
            margin: 20px;
            font-size: 15px;
          }

          h1 {
            margin: 50px 0 5px 0;
            padding: 0;
          }

          .information {
            color: #444;
            font-size: 15px;
            line-height: 20px;
            margin: 0 0 30px 0;
          }
        `}</style>
      </div>
    )
  }
}
