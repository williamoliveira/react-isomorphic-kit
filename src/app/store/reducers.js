/* eslint-disable no-param-reassign */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const combineLazyReducers = (reducers, initialState = {}) => {
  const reducerKeys = new Set(Object.keys(reducers))

  Object.keys(initialState)
    .filter(k => !reducerKeys.has(k))
    .forEach((k) => {
      reducers[k] = state => (state === undefined ? null : state)
    })

  return combineReducers(reducers)
}

export const makeRootReducer = (reducers, state) =>
  combineLazyReducers(
    {
      router: routerReducer,
      ...reducers,
    },
    state,
  )

export const reloadReducers = (store) => {
  const reducer = makeRootReducer(store.custom.asyncReducers, store.getState())
  store.replaceReducer(reducer)
  return reducer
}

export const injectReducer = store => (key, reducer) => {
  store.custom.asyncReducers[key] = reducer
  return reloadReducers(store)
}
