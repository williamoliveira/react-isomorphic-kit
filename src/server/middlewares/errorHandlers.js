const errorHandlersMiddleware = [
  function notFoundMiddlware(req, res, next) {
    res.status(404).send('Sorry, that resource was not found.')
  },

  function unexpectedErrorMiddleware(err, req, res, next) {
    if (err) {
      console.log(err)
      console.log(err.stack)
    }
    res.status(500).send('Sorry, an unexpected error occurred.')
  },
]

export default errorHandlersMiddleware
