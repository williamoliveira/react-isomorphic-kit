import { call, put, takeLatest } from 'redux-saga/effects'
import productsApi from '../../services/productsApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const cleanQuery = {
      // query defaults can come here
      paginate: false,
      ...query,
    }

    const res = yield call(productsApi.fetchMany, cleanQuery)

    const products = res.data

    yield put(actions.fetchManySuccess({ products }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchMany, fetchManyProductsSaga)
}

export default [watchers]
