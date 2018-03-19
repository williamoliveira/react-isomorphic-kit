import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Header from './Header'
import Error404 from '../Error404'
import IndexRoute from './routes/Index'

const Site = () => (
  <div>
    <Header />

    <Switch>
      <Route exact path="/" component={IndexRoute} />
      <Route component={Error404} />
    </Switch>
  </div>
)

export default Site
