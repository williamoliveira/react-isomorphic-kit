import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import HTML from '../../../components/HTML'

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const html = renderToStaticMarkup(
    <HTML bodyElements={<ClientConfig nonce="OFFLINE_PAGE_NONCE_PLACEHOLDER" />} />,
  )
  return `<!DOCTYPE html>${html}`
}
