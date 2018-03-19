import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { render, hydrate } from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import asyncBootstrapper from 'react-async-bootstrapper'
import { AsyncComponentProvider } from 'react-async-component'
import { Provider as ReduxProvider } from 'react-redux'
import { AppContainer as ReactHotLoader } from 'react-hot-loader'
import Raven from 'raven-js'
import configureStore from '../app/store/configureStore'
import config from '../../config'
import App from '../app/components/App'

const sentryDsn = config('sentryDsn')
if (sentryDsn) Raven.config(sentryDsn).install()

const container = document.querySelector('#app')
const supportsHistory = 'pushState' in window.history
const asyncComponentsRehydrateState = window.__ASYNC_COMPONENTS_REHYDRATE_STATE__
const appRehydrateState = window.__APP_REHYDRATE_STATE__

const history = createBrowserHistory()
const appWasServerRendered = !!container.children.length
const renderOrHydrate = appWasServerRendered ? hydrate : render
const helmetContext = {}

async function renderApp(TheApp) {
  const store = await configureStore(appRehydrateState, { history, appWasServerRendered })

  const app = (
    <ReactHotLoader>
      <AsyncComponentProvider rehydrateState={asyncComponentsRehydrateState}>
        <ReduxProvider store={store}>
          <ConnectedRouter
            history={history}
            basename={config('basename')}
            forceRefresh={!supportsHistory}
          >
            <HelmetProvider context={helmetContext}>
              <TheApp />
            </HelmetProvider>
          </ConnectedRouter>
        </ReduxProvider>
      </AsyncComponentProvider>
    </ReactHotLoader>
  )

  await asyncBootstrapper(app)
  await renderOrHydrate(app, container)
}

Raven.context(() => renderApp(App))

if (process.env.BUILD_FLAG_IS_DEV === 'false' && config('serviceWorker.enabled')) {
  require('./registerServiceWorker')
}

if (process.env.BUILD_FLAG_IS_DEV === 'true' && module.hot) {
  module.hot.accept('./index.js')
  module.hot.accept('../app/components/App', () => {
    renderApp(require('../app/components/App').default)
  })
}
