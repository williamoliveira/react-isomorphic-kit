

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _react = _interopRequireDefault(require('react'))

const _propTypes = _interopRequireDefault(require('prop-types'))

const _serializeJavascript = _interopRequireDefault(require('serialize-javascript'))

const _filterWithRules = _interopRequireDefault(
  require('../../internal/utils/objects/filterWithRules'),
)

const _values = _interopRequireDefault(require('../values'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const clientConfig = (0, _filterWithRules.default)(
  _values.default.clientConfigFilter,
  _values.default,
)

function ClientConfig({ nonce }) {
  return _react.default.createElement('script', {
    type: 'text/javascript',
    nonce, // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML: {
      __html: `window.__CLIENT_CONFIG__=${serializedClientConfig}`,
    },
  })
}

const serializedClientConfig = (0, _serializeJavascript.default)(clientConfig)
ClientConfig.propTypes = {
  nonce: _propTypes.default.string.isRequired,
}
const _default = ClientConfig
exports.default = _default
