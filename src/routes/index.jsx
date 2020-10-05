import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import LoginRoute from './Login'
import SignupRoute from './Signup'
import AccountRoute from './Account'
import NotFoundRoute from './NotFound'

export default function createRoutes() {
  return (
    <CoreLayout>
      <Switch>
        {
          /* Build Route components from routeSettings */
          [
            AccountRoute,
            SignupRoute,
            LoginRoute
            /* Add More Routes Here */
          ].map((settings) => (
            <Route key={`Route-${settings.path}`} {...settings} />
          ))
        }
        {/* eslint-disable-next-line */}
        <Route path={Home.path} component={() => <Home.component />} />
        <Route component={NotFoundRoute.component} />
      </Switch>
    </CoreLayout>
  )
}
