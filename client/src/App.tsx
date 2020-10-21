import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { NotFound } from './components/NotFound'
import { Newsfeed } from './components/Newsfeed'
import { MyPosts } from './components/MyPosts'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  tokenRenewed: boolean
  openNewPostModal: boolean
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  state: AppState = {
    tokenRenewed: false,
    openNewPostModal: false
  }

  componentDidMount() {
    this.props.auth.renewSession(() => {
      this.setState({ tokenRenewed: true })
    })
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    if (!this.state.tokenRenewed) return 'loading...'
    const userAuthenticated = this.props.auth.isAuthenticated()
    return (
      <div>
        <Segment vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu(userAuthenticated)}
                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu(userAuthenticated: boolean) {
    return (
      <Menu pointing secondary>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {userAuthenticated && (
          <Menu.Item name="my posts">
            <Link to="/user/posts">My posts</Link>
          </Menu.Item>
        )}
        <Menu.Menu position="right">
          {this.logInLogOutButton(userAuthenticated)}
        </Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton(userAuthenticated: boolean) {
    if (userAuthenticated) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Newsfeed {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/user/posts"
          exact
          render={props => {
            return <MyPosts {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
