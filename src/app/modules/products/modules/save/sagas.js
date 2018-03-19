import identity from 'lodash/identity'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import { call, put, takeLatest } from 'redux-saga/effects'
import { actions as entitiesActions } from '../../../entities'
import { normalizeList } from '../../schema'
import productsApi from '../../services/productsApi'
import * as actions from './actions'
import { actions as productsFormUiActions } from '.'

export const formatToApi = product => ({
  ...pickBy(pick(product, ['id', 'name', 'password', 'email']), identity),
  ...pick(product, ['roles']),
})

export function* createOneProductSaga(action) {
  try {
    yield put(actions.createOneStarted())

    const { product } = action.payload

    const formattedProduct = formatToApi(product)
    const serverProduct = yield call(productsApi.create, formattedProduct)
    const products = [serverProduct]

    const normalized = normalizeList(products)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.createOneSuccess({ products, normalized }))
  } catch (error) {
    yield put(actions.createOneFailed({ error, action }))
  }
}

export function* updateOneProductSaga(action) {
  try {
    yield put(actions.updateOneStarted())

    const { id, product } = action.payload

    const formattedProduct = formatToApi(product)
    const serverProduct = yield call(productsApi.updateById, id, formattedProduct)
    const products = [serverProduct]

    const normalized = normalizeList(products)

    yield put(entitiesActions.set(normalized.entities))

    yield put(actions.updateOneSuccess({ products, normalized }))
  } catch (error) {
    yield put(actions.updateOneFailed({ error, action }))
  }
}

export function* saveOneProductSaga(action) {
  try {
    yield put(actions.saveOneStarted())

    const { product, product: { id } } = action.payload

    yield put(id ? actions.updateOne({ id, product }) : actions.createOne({ product }))

    // TODO handle this, currently always success
    yield put(actions.saveOneSuccess())
  } catch (error) {
    yield put(actions.saveOneFailed({ error, action }))
  }
}

// ------------------------------------
// Watchers
// ------------------------------------
export function* watchers() {
  yield takeLatest(productsFormUiActions.saveOne, saveOneProductSaga)
  yield takeLatest(productsFormUiActions.createOne, createOneProductSaga)
  yield takeLatest(productsFormUiActions.updateOne, updateOneProductSaga)
}

export default [watchers]
