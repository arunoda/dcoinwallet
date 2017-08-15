import Container from '~/components/wallet/ItemContainer'

function getAddressUrl (network, address) {
  const type = network === 'testnet' ? 'tBTC' : 'BTC'
  return `https://www.blocktrail.com/${type}/address/${address}`
}

export default ({ notebook }) => (
  <Container>
    <div className='coins'>
      {notebook.blockchain.getCoins().map((coin) => (
        <div className='coin'>
          <span className='value'>{(coin.value / 100000000)} BTC</span>
           in
          <span className='address'>
            <a
              href={getAddressUrl(notebook.keyfile.payload.meta.network, coin.address)}
              target='_blank'
            >
              {coin.address}
            </a>
          </span>
          {coin.confirmations === 0 ? (<span className='unconfirmed'>Unconfirmed</span>) : null}
        </div>
      ))}
    </div>
    <style jsx>{`
      .coins {
        padding: 10px;
        font-size: 14px;
      }

      .coin {
        margin: 3px 0;
      }

      .value {
        font-weight: 600;
        margin-right: 5px;
      }

      .address a {
        color: #2196F3;
        margin-left: 5px;
        text-decoration: none;
      }

      .unconfirmed {
        margin-left: 5px;
        background-color: #FF9800;
        padding: 2px 5px;
        color: #FFF;
        text-transform: uppercase;
        font-size: 10px;
        border-radius: 2px;
      }
    `}</style>
  </Container>
)
