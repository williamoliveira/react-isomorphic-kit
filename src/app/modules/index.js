import injectApp from './app'
import injectAuth from './auth'
import injectEntities from './entities'
import injectProducts from './products'

export default (store) => {
  injectApp(store)
  injectAuth(store)
  injectEntities(store)
  injectProducts(store)
}
