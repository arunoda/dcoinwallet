export default ({ children }) => (
  <div>
    { children }
    <style jsx>{`
      div {
        border: 1px solid #EAEAEA;
        border-radius: 2px;
        width: 650px;
        margin: 10px 0;
      }
    `}</style>
  </div>
)
