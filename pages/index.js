import Link from 'next/link'

export default () => (
  <div>
    <h1>DCoinWallet</h1>
    <p>A Bitcoin wallet for power users.</p>
    <Link href='/create'>
      <a>Create a Wallet</a>
    </Link>
    <br />
    <Link href='/login'>
      <a>Login to your Wallet</a>
    </Link>
  </div>
)
