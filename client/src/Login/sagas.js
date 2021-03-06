import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { push } from 'react-router-redux'

// Helper for api errors
import { handleApiErrors } from '../lib/api-errors'

// Our login constants
import {  
  LOGIN_REQUESTING,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from './constants'

// So that we can modify our User piece of state
import {  
  setUser,
  unsetUser,
} from '../User/actions'

import {  
  USER_UNSET,
} from '../User/constants'

const loginUrl = `${process.env.REACT_APP_API_URL}/public/signin`

const loginApi = (username, password) => {
    return fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => response.json())
        .then(handleApiErrors)
        .then(json => json)
        .catch(error => { throw error })
}
    

const logout = function* () {
    // dispatches the USER_UNSET action
    yield put(unsetUser())

    // remove our tokens
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')

    // redirect to the /login screen
    yield put(push('/login'))
}

const loginFlow = function* (username, password) {
    let token
    try {
        // synchronous
        let response = yield call(loginApi, username, password)
        token = response.token

        // async, non blocking
        yield put(setUser(response.token))

        // async, non blocking
        yield put({ type: LOGIN_SUCCESS })

        // set a stringified version of our token to localstorage on our domain
        localStorage.setItem('token', JSON.stringify(token))

        // redirect them to dashboard
        yield put(push('/dashboard'))
    } catch (error) {
        // error? send it to redux
        yield put({ type: LOGIN_ERROR, error })
    } finally {
        // No matter what, if our `forked` `task` was cancelled
        // we will then just redirect them to login
        if (yield cancelled()) {
            put(push('/login'))
        }
    }

    // return the token for health and wealth
    return token
}

// Our watcher (saga).  It will watch for many things.
const loginWatcher = function* () {

  // Generators halt execution until their next step is ready/occurring
  // So it's not like this loop is firing in the background 1000/sec
  // Instead, it says, "okay, true === true", and hits the first step...
  while (true) {
    const { username, password } = yield take(LOGIN_REQUESTING)

    const task = yield fork(loginFlow, username, password)

    const action = yield take([USER_UNSET, LOGIN_ERROR])

    if (action.type === USER_UNSET) yield cancel(task)

    yield call(logout)
  }
}

export default loginWatcher