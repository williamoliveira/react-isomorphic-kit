import React from 'react'
import PropTypes from 'prop-types'

class StaticContextProvider extends React.Component {
  static childContextTypes = {
    router: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      router: {
        staticContext: this.props.context || {},
      },
    }
  }

  render() {
    return this.props.children
  }
}

export default StaticContextProvider
