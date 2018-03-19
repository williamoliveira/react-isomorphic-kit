import assignDeep from 'assign-deep'
import { select, call } from 'redux-saga/effects'
import { selectors } from '../modules/auth/index'

export const addTokenToAxiosConfig = (config, token) =>
  assignDeep(token ? { headers: { Authorization: `Bearer ${token}` } } : {}, config)

// eslint-disable-next-line func-names
export const wrapWithAuthSaga = curriedMethod =>
  function* (...props) {
    const token = yield select(selectors.getAccessToken)
    return yield call(curriedMethod(token), ...props)
  }

export const currifyWithToken = (method, configParamIndex) => token => (...params) => {
  if (!configParamIndex) throw new Error('Missing configParamIndex')

  const paramsWithData = params.slice(0, configParamIndex)
  const filledParams = [
    ...paramsWithData,
    ...new Array(configParamIndex - paramsWithData.length),
  ]
  return method(...filledParams, addTokenToAxiosConfig(params[configParamIndex], token))
}

export const wrapAxiosMethodWithAuthSaga = (...params) =>
  wrapWithAuthSaga(currifyWithToken(...params))

export const wrapResourceMethodWithCurrifyWithToken = resource => ({
  ...resource,
  fetchMany: currifyWithToken(resource.fetchMany, 1),
  fetchById: currifyWithToken(resource.fetchById, 2),
  save: currifyWithToken(resource.save, 1),
  create: currifyWithToken(resource.create, 1),
  updateById: currifyWithToken(resource.updateById, 2),
  deleteById: currifyWithToken(resource.deleteById, 1),
  deleteManyByIds: currifyWithToken(resource.deleteManyByIds, 1),
})

export default resource => ({
  ...resource,
  fetchMany: wrapAxiosMethodWithAuthSaga(resource.fetchMany, 1),
  fetchById: wrapAxiosMethodWithAuthSaga(resource.fetchById, 2),
  save: wrapAxiosMethodWithAuthSaga(resource.save, 1),
  create: wrapAxiosMethodWithAuthSaga(resource.create, 1),
  updateById: wrapAxiosMethodWithAuthSaga(resource.updateById, 2),
  deleteById: wrapAxiosMethodWithAuthSaga(resource.deleteById, 1),
  deleteManyByIds: wrapAxiosMethodWithAuthSaga(resource.deleteManyByIds, 1),
})
