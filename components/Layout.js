export default ({ children }) => (
  <div>
    {children}
    <style jsx>{`
      div {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        padding: 20px;
        font-size: 15px;
      }
    `}</style>
  </div>
)
