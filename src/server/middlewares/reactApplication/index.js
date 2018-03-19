import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { renderToNodeStream, renderToStaticMarkup } from 'react-dom/server'
import { AsyncComponentProvider, createAsyncContext } from 'react-async-component'
import asyncBootstrapper from 'react-async-bootstrapper'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import createMemoryHistory from 'history/createMemoryHistory'
import { parsePath } from 'history/PathUtils'
import configureStore from '../../../app/store/configureStore'
import config from '../../../../config'
import ServerHTML from './ServerHTML'
import App from '../../../app/components/App'
import StaticContextProvider from './StaticContextProvider'

const respondStatic = (response, nonce) => {
  const html = `<!DOCTYPE html>${renderToStaticMarkup(<ServerHTML nonce={nonce} />)}`
  response
    .status(200)
    .type('html')
    .send(html)
}

export default async function (request, response) {
  if (typeof response.locals.nonce !== 'string') {
    throw new Error('A "nonce" value has not been attached to the response')
  }
  const nonce = response.locals.nonce

  if (config('disableSSR')) {
    if (process.env.BUILD_FLAG_IS_DEV === 'true') {
      console.log('==> Handling react route without SSR')
    }

    respondStatic(response, nonce)
    return
  }

  try {
    const initialLocation = parsePath(request.url)
    const history = createMemoryHistory({
      initialEntries: [initialLocation],
      initialIndex: 0,
    })
    const asyncComponentsContext = createAsyncContext()
    const reactRouterContext = {}
    const helmetContext = {}

    const store = await configureStore({}, { history, cookies: request.cookies })

    const AppContainer = () => (
      <AsyncComponentProvider asyncContext={asyncComponentsContext}>
        <ReduxProvider store={store}>
          <StaticContextProvider context={reactRouterContext}>
            <ConnectedRouter history={history}>
              <HelmetProvider context={helmetContext}>
                <App />
              </HelmetProvider>
            </ConnectedRouter>
          </StaticContextProvider>
        </ReduxProvider>
      </AsyncComponentProvider>
    )

    await asyncBootstrapper(<AppContainer />)

    const htmlStream = renderToNodeStream(
      <ServerHTML
        nonce={nonce}
        helmet={helmetContext.helmet}
        appState={store.getState()}
        asyncComponentsState={asyncComponentsContext.getState()}
        wasSSR
      >
        <AppContainer />
      </ServerHTML>,
    )

    switch (reactRouterContext.status) {
      case 301:
      case 302:
        response
          .status(reactRouterContext.status)
          .location(reactRouterContext.url)
          .end()
        break
      default:
        response
          .status(reactRouterContext.status || 200)
          .type('html')
          .write('<!doctype html>')
        htmlStream.pipe(response)
    }
  } catch (err) {
    console.error(err)
    respondStatic(response, nonce)
  }
}
