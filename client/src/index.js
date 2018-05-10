import React from 'react'  
import ReactDOM from 'react-dom'  
import { applyMiddleware, createStore, compose } from 'redux'  
import { Provider } from 'react-redux'  
import createSagaMiddleware from 'redux-saga'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

// Import components
import App from './App'

// Helpers
import { checkAuthorization } from './lib/check-auth'

// Import css
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

const loggedIn = () => checkAuthorization(store.dispatch)

// Setup the top level router component for our React Router
ReactDOM.render(  
  <Provider store={store}>
    <App history={history} loggedIn={loggedIn} />
  </Provider>,
  document.getElementById('root'),
)
