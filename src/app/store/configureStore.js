import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'react-router-redux'
import persistStore from 'redux-persist/lib/persistStore'
import { actions as appActions } from '../modules/app'
import { makeRootReducer } from './reducers'
import injectModules from '../modules'
import { makeStartSagas } from './sagas';

const logging = () => next => (action) => {
  console.log(
    'DISPATCHED:',
    action.type,
    // action.payload
  )
  next(action)
}

export default (state, { history, cookies, appWasServerRendered }) => {
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [sagaMiddleware, routerMiddleware(history)]

  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    middlewares.push(logging)
  }

  const enhancers = [applyMiddleware(...middlewares)]

  if (process.env.BUILD_FLAG_IS_DEV === 'true') {
    const devToolsEnhancer = require('redux-devtools-extension').devToolsEnhancer
    enhancers.push(devToolsEnhancer())
  }

  const enhancer = compose(...enhancers)
  const rootReducer = makeRootReducer({}, state)
  const store = createStore(rootReducer, state, enhancer)

  store.custom = {
    history,
    cookies,
    asyncReducers: {},
    sagas: [],
    runningTasks: [],
    runSaga: sagaMiddleware.run,
    startSagas: makeStartSagas(store),
  }

  injectModules(store)

  const persistor = () => new Promise(resolve => persistStore(store, {}, resolve))

  if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
    module.hot.accept('./reducers', () => {
      require('./reducers').reloadReducers(store)
    })
  }

  return (!appWasServerRendered ? persistor() : Promise.resolve())
    .then(() => store.custom.startSagas())
    .then(() => store.dispatch(appActions.beforeAppStart()))
    .then(() => Promise.all(store.custom.runningTasks.map(task => task.done)))
    .then(() => store.custom.startSagas())
    .then(() => store.dispatch(appActions.appStarted()))
    .then(() => store)
}
