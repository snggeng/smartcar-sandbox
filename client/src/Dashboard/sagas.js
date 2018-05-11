import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { push } from 'react-router-redux'

// Helper for api errors
import { handleApiErrors } from '../lib/api-errors'

// Our login constants
import {  
  LOGOUT_REQUESTING,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
} from './constants'

// So that we can modify our User piece of state
import {  
  unsetUser,
} from '../User/actions'

import {  
  USER_UNSET,
} from '../User/constants'

const logout = function* () {
    // dispatches the USER_UNSET action
    yield put(unsetUser())
    // remove our token
    localStorage.removeItem('token')
    // update store
    yield put({ type: LOGOUT_SUCCESS })
    // redirect to the home screen
    yield put(push('/'))
}

// Our watcher (saga).  It will watch for many things.
export const logoutWatcher = function* () {

    // Generators halt execution until their next step is ready/occurring
    // So it's not like this loop is firing in the background 1000/sec
    // Instead, it says, "okay, true === true", and hits the first step...
    while (true) {
      const action = yield take(LOGOUT_REQUESTING)

      yield call(logout)
    }
  }
  

  const dashboardWatcher = function* () {}

  export default dashboardWatcher