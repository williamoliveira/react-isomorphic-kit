import promisefy from './promisefy'

export default storage => ({
  getItem: promisefy(storage.getItem.bind(storage)),
  setItem: promisefy(storage.setItem.bind(storage)),
  removeItem: promisefy(storage.removeItem.bind(storage)),
  getAllKeys: promisefy(storage.getAllKeys.bind(storage)),
})
