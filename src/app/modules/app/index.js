import { injectSaga } from '../../store/hooks'
import * as actions from './actions'
import * as constants from './constants'
import sagas from './sagas'

export { actions, constants, sagas }

export default (store) => {
  injectSaga(store)(sagas)
}
