import { put, call } from 'redux-saga/effects'
import * as actions from '../actions'

// eslint-disable-next-line func-names
export default saga =>
  function* (...args) {
    try {
      yield put(actions.initialFetchStarted())

      const result = yield call(saga, ...args)

      yield put(actions.initialFetchSuccess(result && result.payload))
    } catch (error) {
      yield put(actions.initialFetchFailed({ error }))
    }
  }
