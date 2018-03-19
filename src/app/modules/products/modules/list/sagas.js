import { call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import parsePaginationFromResponse from '../../../../utils/parsePaginationFromResponse'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import { actions as productsFormUiActions } from '../save'
import * as actions from './actions'
import { reportErrorSaga } from '../../../app/sagas'

// ------------------------------------
// Sub-routines
// ------------------------------------
export function* fetchManyProductsSaga(action) {
  try {
    yield put(actions.fetchManyStarted())

    const { query } = action.payload || {}

    const res = yield call(productsApi.fetchMany, query)
    const products = res.data

    const normalized = normalizeList(products)
    const pagination = parsePaginationFromResponse(res)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.fetchManySuccess({ products, normalized, pagination }))
  } catch (error) {
    yield put(actions.fetchManyFailed({ error, action }))
  }
}

export function* saveOneSuccessSaga() {
  yield put(actions.fetchMany())
}

// ------------------------------------
// Watchers
// ------------------------------------
export default function* () {
  yield takeLatest(actions.fetchMany, fetchManyProductsSaga)
  yield takeLatest(productsFormUiActions.saveOneSuccess, saveOneSuccessSaga)

  yield takeEvery(actions.fetchManyFailed, reportErrorSaga)
}
