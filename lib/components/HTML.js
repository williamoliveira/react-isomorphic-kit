

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = void 0

const _react = _interopRequireDefault(require('react'))

const _propTypes = _interopRequireDefault(require('prop-types'))

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

/* eslint-disable react/no-danger */

/* eslint-disable jsx-a11y/html-has-lang */
function HTML(props) {
  const {
    htmlAttributes, headerElements, bodyElements, appBodyString, children,
  } = props
  return _react.default.createElement(
    'html',
    htmlAttributes,
    _react.default.createElement('head', null, headerElements),
    _react.default.createElement(
      'body',
      null,
      appBodyString
        ? _react.default.createElement('div', {
          id: 'app',
          dangerouslySetInnerHTML: {
            __html: appBodyString,
          },
        })
        : _react.default.createElement(
          'div',
          {
            id: 'app',
          },
          children,
        ),
      bodyElements,
    ),
  )
}

HTML.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  htmlAttributes: _propTypes.default.object,
  headerElements: _propTypes.default.node,
  bodyElements: _propTypes.default.node,
  appBodyString: _propTypes.default.string,
  children: _propTypes.default.node,
}
HTML.defaultProps = {
  htmlAttributes: null,
  headerElements: null,
  bodyElements: null,
  appBodyString: '',
  children: null,
}
const _default = HTML
exports.default = _default
