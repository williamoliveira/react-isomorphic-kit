import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import * as actions from './actions'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchOneProductSaga(action) {
  try {
    yield put(actions.fetchOneStarted())

    const { id, query } = action.payload

    const cleanQuery = {
      include: ['roles'],
      ...query,
    }

    const res = yield call(productsApi.fetchById, id, cleanQuery)
    const products = [res]

    const normalized = normalizeList(products)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchOneSuccess({ products, normalized }))
  } catch (error) {
    yield put(actions.fetchOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.fetchOne, fetchOneProductSaga)
}

export default [watchers]
