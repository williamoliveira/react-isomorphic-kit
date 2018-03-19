import { injectReducer } from '../../store/hooks'
import * as actions from './actions'
import * as reducers from './reducers'
import * as constants from './constants'
import * as selectors from './selectors'

export { actions, reducers, constants, selectors }

export default (store) => {
  injectReducer(store)(reducers.entitiesKey, reducers.entitiesReducer)
}
