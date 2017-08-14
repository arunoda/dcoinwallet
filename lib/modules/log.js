import Container from '~/components/wallet/ItemContainer'

export default ({ data }) => (
  <Container>
    <pre>
      <code>{data.text}</code>
    </pre>
    <style jsx>{`
      pre {
        padding: 10px;
        margin: 0;
        font-size: 14px;
      }
    `}</style>
  </Container>
)
