import React from 'react'
import PropTypes from 'prop-types'
import serialize from 'serialize-javascript'
import filterWithRules from '../internal/utils/objects/filterWithRules'

function ClientConfig({ config, nonce }) {
  const clientConfig = filterWithRules(config.clientConfigFilter, config)
  const serializedClientConfig = serialize(clientConfig)

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
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
  nonce: PropTypes.string.isRequired,
}

export default ClientConfig
