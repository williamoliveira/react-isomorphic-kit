import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import HTML from '../../../components/HTML'

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const config = context.htmlWebpackPlugin.options.custom.config
  const html = renderToStaticMarkup(
    <HTML
      bodyElements={
        <ClientConfig nonce="OFFLINE_PAGE_NONCE_PLACEHOLDER" config={config()} />
      }
    />,
  )
  return `<!DOCTYPE html>${html}`
}
