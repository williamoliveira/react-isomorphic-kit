import { call, put, takeLatest } from 'redux-saga/effects'
import productsApi from '../../services/productsApi'
import * as actions from './actions'

export function* deleteOneProductSaga(action) {
  try {
    yield put(actions.deleteOneStarted())

    const { id, product } = action.payload

    yield call(productsApi.deleteById, id || product.id)

    // TODO delete locally

    yield put(actions.deleteOneSuccess({ product }))
  } catch (error) {
    yield put(actions.deleteOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(actions.deleteOne, deleteOneProductSaga)
}

export default [watchers]
