import { call, put, takeLatest } from 'redux-saga/effects'  
import { handleApiErrors } from '../lib/api-errors'  
import {  
  SIGNUP_REQUESTING,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
} from './constants'

const signupUrl = `${process.env.REACT_APP_API_URL}/public/users`

// asynchronous
const signupApi = (username, password, first_name, last_name) => 
    fetch(signupUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, first_name, last_name }),
    })
        .then(response => response.json())
        .then(handleApiErrors)
        .then(json => json)
        .catch((error) => { throw error })


// SIGNUP_REQUESTING action detected by watcher
const signupFlow = function* (action) {
    try {
        const { username, password, first_name, last_name } = action
    
        // synchronous
        const response = yield call(signupApi, username, password, first_name, last_name)
    
        // will throw error if signupApi failed. if not, dispatch action
        yield put({ type: SIGNUP_SUCCESS, response })
      } catch (error) {
        // if the api call fails, it will "put" the SIGNUP_ERROR
        // into the dispatch along with the error.
        yield put({ type: SIGNUP_ERROR, error })
      }
}

// Watches for the SIGNUP_REQUESTING action type
// When it gets it, it will call signupFlow()
// WITH the action we dispatched
const signupWatcher = function* () {  
  // takeLatest() takes the LATEST call of that action and runs it
  // if we we're to use takeEvery, it would take every single
  // one of the actions and kick off a new task to handle it
  // CONCURRENTLY!!!
  yield takeLatest(SIGNUP_REQUESTING, signupFlow)
}

export default signupWatcher  