import React from 'react'

export default class Create extends React.Component {

  submit (e) {
    e.preventDefault()
    const password = this.password.value
    const keyCount = parseInt(this.keyCount.value)
    const network = this.network.value
    const reuseKeys = this.reuseKeys.value === "true"

    if (password === '') {
      alert('Enter a password for your wallet.')
      return
    }
  }

  networkChanged () {
    const network = this.network.value
    if (network === 'bitcoin') {
      this.keyCount.value = 100
      this.reuseKeys.value = "false"
    } else {
      this.keyCount.value = 10
      this.reuseKeys.value = "true"
    }
  }

  render () {
    return (
      <div id="create-page">
        <h1>Create a Wallet</h1>
        <div className="information">
          This process will create a file a containing a set of Bitcoin addresses and keys. <br/>
          They are encrypted with a password you provided. <br/>
        </div>
        <form id="create-form" onSubmit={(e) => this.submit(e)}>
          <div className="input password">
            <div className="label">Password</div>
            <div className="description">
              Make sure to create a <a href="https://howsecureismypassword.net/" target="_blank">very secure password</a> because you keep money behind it.
            </div>
            <input
              className="input-item"
              type="password"
              tabIndex="1"
              ref={(r) => this.password = r}
            />
          </div>
          <div className="input network">
            <div className="label">Network</div>
            <div className="description">Select the Bitcoin <a href="https://bitcoin.stackexchange.com/q/7908" target="_blank">network</a> you want to use.</div>
            <select
              className="input-item"
              tabIndex="2"
              ref={(r) => this.network = r}
              onChange={(e) => this.networkChanged(e)}
            >
              <option value="testnet">Bitcoin Testnet</option>
              <option value="bitcoin">Bitcoin</option>
            </select>
          </div>
          <div className="input keycount">
            <div className="label">No. of Addresses</div>
            <div className="description">Select the number of Bitcoin addresses to create. <a href="#">Learn more</a></div>
            <input
              className="input-item"
              type="text"
              defaultValue="10"
              tabIndex="3"
              ref={(r) => this.keyCount = r}
            />
          </div>
          <div className="input reuse-keys">
            <div className="label">Reuse Addresses</div>
            <div className="description">Allow to reuse addresses in different transactions. <a href="#">Learn More</a></div>
            <select
              className="input-item"
              tabIndex="4"
              ref={(r) => this.reuseKeys = r}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="submit">
            <button>Create Wallet</button>
          </div>
        </form>
        <style jsx>{`
          #create-page {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            -webkit-font-smoothing: antialiased;
            margin: 20px;
          }

          h1 {
            margin: 30px 0 5px 0;
            padding: 0;
          }

          .information {
            color: #444;
            font-size: 15px;
            line-height: 20px;
          }

          #create-form {
            margin: 30px 0 0 0;
          }

          .input {
            margin: 10px 0;
          }

          .input .label {
            font-size: 18px;
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
      </div>
    )
  }
}