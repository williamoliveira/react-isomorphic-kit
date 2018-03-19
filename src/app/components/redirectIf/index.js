import React from 'react'
import Redirect from 'react-router-dom/Redirect'

export default (checker, to) => WrappedComponent => (props) => {
  const shouldRedirect = checker(props)

  const toObj = typeof to === 'function' ? to(props) : to

  return shouldRedirect ? <Redirect to={toObj} /> : <WrappedComponent {...props} />
}
