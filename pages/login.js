import React from 'react'
import Layout from '~/components/Layout'
import { H1, Information } from '~/components/Text'


export default class Login extends React.Component {
  render () {
    return (
      <Layout>
        <H1>Login</H1>
        <Information>
          Login to your wallet by providing the keyfile and the password.
        </Information>
      </Layout>
    )
  }
}
