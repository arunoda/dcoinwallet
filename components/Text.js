export const H1 = ({children}) => (
  <h1>
    { children }
    <style jsx>{`
      h1 {
        margin: 30px 0 5px 0;
        padding: 0;
      }
    `}</style>
  </h1>
)

export const Information = ({ children }) => (
  <div>
    {children}
    <style jsx>{`
      div {
        color: #444;
        font-size: 15px;
        line-height: 20px;
        margin: 0 0 30px 0;
      }
    `}</style>
  </div>
)
