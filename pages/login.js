/* global window */

import React from 'react'
import Router from 'next/router'
import Layout from '~/components/Layout'
import { H1, Information } from '~/components/Text'
import { InputField, Description, Input, Submit } from '~/components/Form'
import Button from '~/components/Button'
import Keyfile from '~/lib/keyfile'
import notebook from '~/lib/notebook'

export default class Login extends React.Component {
  state = { currentState: null }

  reset () {
    this.setState({
      currentState: null,
      error: null
    })
  }

  readKeyfile (file) {
    return new Promise((resolve, reject) => {
      const { FileReader } = window
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target.result
        try {
          const keyfileJson = JSON.parse(text)
          resolve(keyfileJson)
        } catch (ex) {
          reject(new Error('Invalid keyfile.'))
        }
      }
      reader.readAsText(file)
    })
  }

  submit (e) {
    e.preventDefault()
    const files = this.keyfile.files
    const password = this.password.value

    if (files.length === 0) {
      window.alert('Select the keyfile.')
      return
    }

    if (password === '') {
      window.alert('Enter the password')
      return
    }

    this.setState({ currentState: 'PROCESSING' })

    this.readKeyfile(files[0])
      .then(keyfileJSON => {
        const keyfile = Keyfile.import(keyfileJSON)
        const address = keyfile.getAddress()
        // An error will be thrown if the password is incorrect.
        keyfile.getKey(password, address)

        notebook.setKeyfile(keyfile)
        Router.push('/wallet')
      })
      .catch((error) => {
        this.setState({ currentState: 'ERRORED', error })
      })
  }

  renderForm () {
    return (
      <form onSubmit={(e) => this.submit(e)}>
        <InputField name='Keyfile'>
          <Description>
            Your keyfile will be processed just inside the browser.
          </Description>
          <input
            type='file'
            tabIndex='1'
            className='keyfile-input'
            ref={(r) => { this.keyfile = r }}
          />
        </InputField>

        <InputField name='Password'>
          <Description>
            Your password to descrypt the keyfile.
          </Description>
          <Input
            type='password'
            tabIndex='2'
            handleRef={(r) => { this.password = r }}
          />
        </InputField>

        <Submit>
          <Button tabIndex='3'>Login to Wallet</Button>
        </Submit>
        <style jsx>{`
          .keyfile-input {
            padding: 10px 0;
          }
        `}</style>
      </form>
    )
  }

  renderProcessing () {
    return (
      <div>
        Processing ...
      </div>
    )
  }

  renderError () {
    const { error } = this.state
    return (
      <div>
        <div className='error-box'>
          <div className='title'>ERROR</div>
          <div className='message'>{ error.message }</div>
        </div>
        <Submit>
          <Button onClick={() => this.reset()}>Login Again</Button>
        </Submit>
        <style jsx>{`
          .title {
            font-weight: 400;
            font-size: 25px;
            letter-spacing: 2px;
            color: #E91E63;
          }

          .message {
            margin: 5px 0;
            font-size: 16px;
          }
        `}</style>
      </div>
    )
  }

  renderContent () {
    switch (this.state.currentState) {
      case 'PROCESSING':
        return this.renderProcessing()
      case 'ERRORED':
        return this.renderError()
      default:
        return this.renderForm()
    }
  }

  render () {
    return (
      <Layout>
        <H1>Login</H1>
        <Information>
          Login to your wallet by providing the keyfile and the password.
        </Information>
        { this.renderContent() }
      </Layout>
    )
  }
}
