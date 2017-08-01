export const InputField = ({ name, description, children }) => (
  <div className='input'>
    <div className='label'>{ name }</div>
    <div className='description'>{ description }</div>
    { children }
    <style jsx>{`
      .input {
        margin: 10px 0;
      }

      .input .label {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 2px 0;
      }
    `}</style>
  </div>
)

export const Description = ({ children }) => (
  <div>
    { children }
    <style jsx>{`
      div {
        font-size: 13px;
        color: #666;
      }

      div :global(a) {
        color: #2196F3;
        text-decoration: none;
      }
    `}</style>
  </div>
)

export const Input = ({ handleRef = () => null, ...props }) => (
  <div>
    <input
      {...props}
      ref={(r) => handleRef(r)}
    />
    <style jsx>{`
      input {
        margin: 5px 0 0 0;
        font-size: 15px;
        padding: 2px 5px;
      }
    `}</style>
  </div>
)

export const Select = ({ options, handleRef = () => null, ...props }) => (
  <div>
    <select
      {...props}
      ref={(r) => handleRef(r)}
    >
      { Object.keys(options).map(value => (
        <option key={value} value={value}>{options[value]}</option>
      ))}
    </select>
    <style jsx>{`
      select {
        margin: 5px 0 0 0;
        font-size: 15px;
        padding: 2px 5px;
      }
    `}</style>
  </div>
)

export const Submit = ({ children }) => (
  <div>
    { children }
    <style jsx>{`
      div {
        margin: 30px 0 0 0;
      }
    `}</style>
  </div>
)
