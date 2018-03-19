import { injectReducer, injectSagas } from '../../store/hooks'
import * as actions from './actions'
import getReducer, { KEY } from './reducers'
import * as constants from './constants'
import * as selectors from './selectors'
import sagas from './sagas'

export { actions, constants, selectors }

export default (store) => {
  injectReducer(store)(KEY, getReducer(store))
  injectSagas(store)(sagas)
}
