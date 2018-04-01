

const _react = _interopRequireDefault(require('react'))

const _server = require('react-dom/server')

const _requireFromUserland = _interopRequireDefault(
  require('../../utils/requireFromUserland'),
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const HTML = (0, _requireFromUserland.default)('src/app/components/HTML').default

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const html = (0, _server.renderToStaticMarkup)(
    _react.default.createElement(HTML, {
      bodyElements: _react.default.createElement(ClientConfig, {
        nonce: 'OFFLINE_PAGE_NONCE_PLACEHOLDER',
      }),
    }),
  )
  return `<!DOCTYPE html>${html}`
}
