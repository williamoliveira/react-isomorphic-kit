import React from 'react'
import PropTypes from 'prop-types'
import serialize from 'serialize-javascript'
import filterWithRules from '../../internal/utils/objects/filterWithRules'
import values from '../values'

const clientConfig = filterWithRules(values.clientConfigFilter, values)

const serializedClientConfig = serialize(clientConfig)

function ClientConfig({ nonce }) {
  return (
    <script
      type="text/javascript"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `window.__CLIENT_CONFIG__=${serializedClientConfig}`,
      }}
    />
  )
}

ClientConfig.propTypes = {
  nonce: PropTypes.string.isRequired,
}

export default ClientConfig
