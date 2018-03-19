export default fn => (...args) =>
  new Promise((resolve, reject) => {
    fn(...args, (err, result) => (err ? reject(err) : resolve(result)))
  })
