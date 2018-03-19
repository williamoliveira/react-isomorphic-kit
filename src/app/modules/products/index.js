import * as constants from './constants'
import injectDelete from './modules/delete'
import injectFilter from './modules/filter'
import injectForm from './modules/save'
import injectList from './modules/list'
import injectShow from './modules/show'
import * as selectors from './selectors'

export { selectors, constants }

export default (store) => {
  injectForm(store)
  injectList(store)
  injectFilter(store)
  injectDelete(store)
  injectShow(store)
}
