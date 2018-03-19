export default error =>
  (error.response && error.response.data
    ? {
      status: error.response.status,
      message: error.response.data.message,
    }
    : {
      message: error.message,
    })
