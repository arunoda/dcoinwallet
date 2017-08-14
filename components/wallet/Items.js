import React from 'react'
import Modules from '~/lib/modules'

export default class Items extends React.Component {
  state = { items: [] }

  componentDidMount () {
    const { notebook } = this.props
    this.stopWatching = notebook.onChange(() => {
      const items = notebook.getItems()
      this.setState({ items })
    })
  }

  componentWillUnmount () {
    this.stopWatching()
  }

  componentDidUpdate () {
    window.scrollTo(0, document.body.scrollHeight)
  }

  render () {
    const { items } = this.state
    return (
      <div>
        { items.map((item, index) => {
          const Module = Modules[item.type]
          if (!Module) {
            throw new Error(`Incorrect item type: ${item.type}`)
          }
          return (<Module key={index} data={item} />)
        }) }
      </div>
    )
  }
}
