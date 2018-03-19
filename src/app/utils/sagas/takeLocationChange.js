import { call, take, fork } from 'redux-saga/effects'
import { LOCATION_CHANGE } from 'react-router-redux'

// eslint-disable-next-line func-names
export default (route, saga, ...args) =>
  fork(function* () {
    const routes = Array.isArray(route) ? route : [route]

    while (true) {
      const action = yield take(LOCATION_CHANGE)

      if (routes.indexOf(action.payload.pathname) !== -1) {
        yield call(saga, ...args.concat(action))
      }
    }
  })
