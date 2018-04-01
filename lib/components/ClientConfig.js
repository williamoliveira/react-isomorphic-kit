

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _react = _interopRequireDefault(require('react'))

const _propTypes = _interopRequireDefault(require('prop-types'))

const _serializeJavascript = _interopRequireDefault(require('serialize-javascript'))

const _filterWithRules = _interopRequireDefault(
  require('../internal/utils/objects/filterWithRules'),
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function ClientConfig({ config, nonce }) {
  const clientConfig = (0, _filterWithRules.default)(config.clientConfigFilter, config)
  const serializedClientConfig = (0, _serializeJavascript.default)(clientConfig)
  return _react.default.createElement('script', {
    type: 'text/javascript',
    nonce, // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML: {
      __html: `window.__CLIENT_CONFIG__=${serializedClientConfig}`,
    },
  })
}

ClientConfig.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  config: _propTypes.default.object.isRequired,
  nonce: _propTypes.default.string.isRequired,
}
const _default = ClientConfig
exports.default = _default
