import React, { Component } from 'react'  
import PropTypes from 'prop-types'
import { Redirect, Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
// import logo from './logo.svg'  

// Import all of our components
import Home from './Home'  
import Login from './login'  
import Signup from './signup'  
import Widgets from './widgets'  
import NoMatch from './NoMatch'

// Import css
import './App.css'

const PrivateRoute = ({ component: Component, loggedIn, ...rest }) => {
  console.log('private route', loggedIn)
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);

  }


  render() {
    return (
      <Router history={this.props.history}>
        <Switch>
          <Route exact path="/" render={() => (
              this.props.loggedIn() ? (
                  <Redirect to="/widgets"/>
              ) : (
                  <Home/>
              ) )}/>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/widgets" component={Widgets} loggedIn={this.props.loggedIn} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    )
  }
}

App.propTypes = {  
  children: PropTypes.node,
}

export default connect()(App)
