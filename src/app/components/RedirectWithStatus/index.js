import React from 'react'
import Redirect from 'react-router/Redirect'
import Status from '../Status'

const RedirectWithStatus = ({
  status = 302, from, to, ...rest
}) => (
  <Status code={status} context={{ url: to }}>
    <Redirect from={from} to={to} {...rest} />
  </Status>
)

export default RedirectWithStatus
