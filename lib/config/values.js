

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _requireFromUserland = _interopRequireDefault(
  require('../internal/utils/requireFromUserland'),
)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const _default = (0, _requireFromUserland.default)('src/config/values').default
exports.default = _default
