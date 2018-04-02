import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import HTML from '../../../components/HTML'
import config from '../../config'

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const html = renderToStaticMarkup(
    <HTML
      bodyElements={
        <ClientConfig nonce="OFFLINE_PAGE_NONCE_PLACEHOLDER" config={config()} />
      }
    />,
  )
  return `<!DOCTYPE html>${html}`
}
