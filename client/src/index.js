import React from 'react'  
import ReactDOM from 'react-dom'  
import { applyMiddleware, createStore, compose } from 'redux'  
import { Provider } from 'react-redux'  
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import { Redirect, Router, Route, Switch } from 'react-router-dom'

import { checkAuthorization } from './lib/check-auth'

// Import all of our components
import App from './App'  
import Login from './login'  
import Signup from './signup'  
import Widgets from './widgets'  
import NoMatch from './NoMatch'
import './index.css'

// Import the index reducer and sagas
import IndexReducer from './index-reducer'  
import IndexSagas from './index-sagas'

// Setup the middleware to watch between the Reducers and the Actions
const sagaMiddleware = createSagaMiddleware()
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
// Build the middleware for intercepting and dispatching navigation actions
const reduxRouterMiddleware = routerMiddleware(history)

/*eslint-disable */
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&  
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */

const store = createStore(  
  IndexReducer,
  composeSetup(applyMiddleware(sagaMiddleware, reduxRouterMiddleware)), // allows redux devtools to watch sagas
)

// Begin our Index Saga
sagaMiddleware.run(IndexSagas, store.dispatch)

const loggedIn = checkAuthorization(store.dispatch)

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        loggedIn ? (
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

// Setup the top level router component for our React Router
ReactDOM.render(  
  <Provider store={store}>
    <Router history={history}>
        <Switch>
        <Route exact path="/" render={() => (
            loggedIn ? (
                <Redirect to="/widgets"/>
            ) : (
                <App/>
            ) )}/>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/widgets" component={Widgets} />
        <Route component={NoMatch}/>
        </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'),
)
