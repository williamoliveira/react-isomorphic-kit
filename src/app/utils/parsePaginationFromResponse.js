/* eslint-disable radix */
export default res => ({
  currentPage: parseInt(res.currentPage),
  total: parseInt(res.total),
  lastPage: parseInt(res.lastPage),
  from: parseInt(res.from),
  to: parseInt(res.to),
})
