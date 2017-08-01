export default (props) => (
  <button {...props}>
    {props.children}
    <style jsx>{`
      button {
        font-size: 18px;
        background-color: #8BC34A;
        border: 1px solid #689F38;
        border-radius: 2px;
        color: #FFF;
        padding: 3px 15px;
        cursor: pointer;
      }

      button:hover {
        opacity: 0.7;
      }
    `}</style>
  </button>
)
