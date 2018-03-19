import React from 'react'
import Route from 'react-router-dom/Route'

const Status = ({ code, context, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        // eslint-disable-next-line no-param-reassign
        staticContext.status = code
        Object.assign(staticContext, context)
      }

      return children
    }}
  />
)

export default Status
