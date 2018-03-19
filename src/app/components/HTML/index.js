/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react'
import PropTypes from 'prop-types'

function HTML(props) {
  const {
    htmlAttributes, headerElements, bodyElements, appBodyString, children,
  } = props

  return (
    <html {...htmlAttributes}>
      <head>{headerElements}</head>
      <body>
        {appBodyString ? (
          <div id="app" dangerouslySetInnerHTML={{ __html: appBodyString }} />
        ) : (
          <div id="app">{children}</div>
        )}
        {bodyElements}
      </body>
    </html>
  )
}

HTML.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  htmlAttributes: PropTypes.object,
  headerElements: PropTypes.node,
  bodyElements: PropTypes.node,
  appBodyString: PropTypes.string,
  children: PropTypes.node,
}

HTML.defaultProps = {
  htmlAttributes: null,
  headerElements: null,
  bodyElements: null,
  appBodyString: '',
  children: null,
}

export default HTML
