import React from 'react'
import Auth from './auth/Auth'
import { Router, Route, Switch } from 'react-router-dom'
import Callback from './components/Callback'
import createHistory from 'history/createBrowserHistory'
import App from './App'
import { LogIn } from './components/LogIn'
const history = createHistory()

const auth = new Auth(history)

const handleAuthentication = (props: any) => {
  const location = props.location
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication()
  }
}

export const makeAuthRouting = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props)
            return <Callback />
          }}
        />
        <Route
          path="/login"
          render={props => {
            return <LogIn auth={auth} {...props} />
          }}
        />
        <Route
          path="/"
          render={props => {
            return <App auth={auth} {...props} />
          }}
        />
      </Switch>
    </Router>
  )
}
