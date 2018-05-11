import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { push, replace } from 'react-router-redux'

// Helper for api errors
import { handleApiErrors } from '../lib/api-errors'

// Our login constants
import {  
  LOGOUT_REQUESTING,
  LOGOUT_SUCCESS,
  SMARTCAR_AUTH_REQUESTING,
  SMARTCAR_AUTH_SUCCESS,
  SMARTCAR_AUTH_ERROR,
} from './constants'

// So that we can modify our User piece of state
import {  
  unsetUser,
} from '../User/actions'

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

export const logoutWatcher = function* () {
    while (true) {
      const action = yield take(LOGOUT_REQUESTING)

      yield call(logout)
    }
}

const authUrl = `${process.env.REACT_APP_API_URL}/api/smartcar/auth`
const callbackUrl = `${process.env.REACT_APP_API_URL}/api/smartcar/callback`

const api = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
        }
      })
        .then(response => response.json())
        .then(handleApiErrors)
        .then(json => json)
        .catch(error => { throw error })
}

const authFlow = function* () {
    let access
    try {
        // synchronous
        let redirect = yield call(api, authUrl)
        // redirect to Smartcar authorization page
        document.location.replace(redirect)
    } catch (error) {
        // error? send it to redux
        yield put({ type: SMARTCAR_AUTH_ERROR, error })
    } finally {
        // No matter what, if our `forked` `task` was cancelled
        // we will then just redirect them to dashboard
        if (yield cancelled()) {
            put(push('/dashboard'))
        }
    }
}
  

const dashboardWatcher = function* (search) {
    while (true) {
        let access, task
        const action = yield take([SMARTCAR_AUTH_REQUESTING, SMARTCAR_AUTH_SUCCESS, SMARTCAR_AUTH_ERROR])
        
        if (action.type === SMARTCAR_AUTH_REQUESTING) {
            task = yield fork(authFlow)
        }


        if (action.type === SMARTCAR_AUTH_ERROR) yield cancel(task)
        if (action.type === SMARTCAR_AUTH_SUCCESS) {
            console.log('auth success', action.search)
            let callback = yield call(api, callbackUrl + action.search)
            access = JSON.stringify(callback.access)
            // set a stringified version of our token to localstorage on our domain
            localStorage.setItem('access_token', access)
            console.log(`callback ${JSON.stringify(callback)}, access ${access}`)
        }

    }
}

// const smartcarAuthWatcher = function* () {
//     while(true) {
//         const action = yield take(SMARTCAR_AUTH_SUCCESS)
//         if (action.type === SMARTCAR_AUTH_SUCCESS) {
//             let callback = yield call(api, callbackUrl)
//             access = callback.access
//             // set a stringified version of our token to localstorage on our domain
//             localStorage.setItem('access_token', JSON.stringify(access))
//             console.log(`callback ${callback}, access ${access}`)
//         }
//     }
// }

  export default dashboardWatcher