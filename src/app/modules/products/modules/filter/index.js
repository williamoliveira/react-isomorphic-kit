import { injectReducer, injectSagas } from '../../../../store/hooks'
import * as actions from './actions'
import * as constants from './constants'
import reducer, { KEY } from './reducer'
import sagas from './sagas'
import * as selectors from './selectors'

export { actions, constants, sagas, selectors, reducer }

export default (store) => {
  injectReducer(store)(KEY, reducer)
  injectSagas(store)(sagas)
}
