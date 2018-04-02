

const _react = _interopRequireDefault(require('react'))

const _server = require('react-dom/server')

const _HTML = _interopRequireDefault(require('../../../components/HTML'))

const _config = _interopRequireDefault(require('../../config'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

module.exports = function generate(context) {
  const ClientConfig = context.htmlWebpackPlugin.options.custom.ClientConfig
  const html = (0, _server.renderToStaticMarkup)(
    _react.default.createElement(_HTML.default, {
      bodyElements: _react.default.createElement(ClientConfig, {
        nonce: 'OFFLINE_PAGE_NONCE_PLACEHOLDER',
        config: (0, _config.default)(),
      }),
    }),
  )
  return `<!DOCTYPE html>${html}`
}
