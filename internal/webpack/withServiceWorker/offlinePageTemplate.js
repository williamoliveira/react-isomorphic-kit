import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import requireFromUserland from '../../utils/requireFromUserland'

const HTML = requireFromUserland('src/app/components/HTML').default

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const html = renderToStaticMarkup(
    <HTML bodyElements={<ClientConfig nonce="OFFLINE_PAGE_NONCE_PLACEHOLDER" />} />,
  )
  return `<!DOCTYPE html>${html}`
}
