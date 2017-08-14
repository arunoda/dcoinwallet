import Container from '~/components/wallet/ItemContainer'

function resultToText (result) {
  if (typeof result === 'string') return result
  return JSON.stringify(result)
}

export default ({ data }) => (
  <Container>
    <pre className='code'>
      <code>{data.code}</code>
    </pre>
    {
      data.result ? (
        <div className='result'>
          <div className='title'>RESULT:</div>
          <pre>
            <code>{resultToText(data.result)}</code>
          </pre>
        </div>
      ) : null
    }
    <style jsx>{`
      .code {
        background-color: #f7f7f7;
        padding: 10px;
        margin: 0;
        font-size: 14px;
      }

      .result {
        border-top: 2px solid #8BC34A
      }

      .result .title {
        font-size: 10px;
        font-weight: 800;
        color: #444;
        letter-spacing: 0.5px;
        padding: 5px 0 0 10px;
      }

      .result pre {
        padding: 5px 0 10px 10px;
        margin: 0;
        font-size: 13px;
      }
    `}</style>
  </Container>
)
