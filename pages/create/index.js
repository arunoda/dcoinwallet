/* global window */
import React from 'react'
import Link from 'next/link'
import Keyfile from '~/lib/keyfile'
import Layout from '~/components/Layout'
import Button from '~/components/Button'
import { H1, Information } from '~/components/Text'
import { InputField, Description, Input, Select, Submit } from '~/components/Form'

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
        <InputField name='Name'>
          <Description>A name for this wallet.</Description>
          <Input
            type='text'
            tabIndex='1'
            handleRef={(r) => { this.name = r }}
          />
        </InputField>

        <InputField name='Password'>
          <Description>
            Make sure to create a <a href='https://howsecureismypassword.net/' target='_blank'>very secure password</a> because you keep money behind it.
          </Description>
          <Input
            type='password'
            tabIndex='2'
            handleRef={(r) => { this.password = r }}
          />
        </InputField>

        <InputField name='Re-Type Password'>
          <Description>Make sure you typed the password correctly.</Description>
          <Input
            type='password'
            tabIndex='3'
            handleRef={(r) => { this.password2 = r }}
          />
        </InputField>

        <InputField name='Network'>
          <Description>
            Select the Bitcoin <a href='https://bitcoin.stackexchange.com/q/7908' target='_blank'>network</a> you want to use.
          </Description>
          <Select
            tabIndex='4'
            handleRef={(r) => { this.network = r }}
            onChange={(e) => this.networkChanged(e)}
            options={{
              testnet: 'Bitcoin Testnet',
              bitcoin: 'Bitcoin'
            }}
          />
        </InputField>

        <InputField name='No. of Addresses'>
          <Description>
            Select the number of Bitcoin addresses to create. <a href='#'>Learn more</a>
          </Description>
          <Input
            type='text'
            defaultValue='10'
            tabIndex='5'
            handleRef={(r) => { this.keyCount = r }}
          />
        </InputField>

        <InputField name='Reuse Addresses'>
          <Description>
            Allow to reuse addresses in different transactions. <a href='#'>Learn More</a>
          </Description>
          <Select
            tabIndex='6'
            handleRef={(r) => { this.reuseKeys = r }}
            onChange={(e) => this.networkChanged(e)}
            options={{
              'true': 'Yes',
              'false': 'No'
            }}
          />
        </InputField>

        <Submit>
          <Button tabIndex='7'>Create Wallet</Button>
        </Submit>
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
      <Layout>
        <H1>Create a Wallet</H1>
        <Information>
          This process will create a file containing a set of Bitcoin addresses and keys. <br />
          They are encrypted with a password you provide. <br />
        </Information>
        { this.renderContent() }
      </Layout>
    )
  }
}
