export default ({ children }) => (
  <div>
    {children}
    <style jsx>{`
      div {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        -webkit-font-smoothing: antialiased;
        padding: 20px;
        font-size: 15px;
        border-top: 3px solid #8BC34A;
      }
    `}</style>

    <style jsx global>{`
      body {
        margin: 0;
        padding: 0;
      }
    `}</style>
  </div>
)
