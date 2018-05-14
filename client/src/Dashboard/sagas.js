import { take, fork, cancel, call, put, cancelled } from 'redux-saga/effects'

// We'll use this function to redirect to different routes based on cases
import { push, replace } from 'react-router-redux'

// Helper for api errors
import { handleApiErrors } from '../lib/api-errors'

// Our constants
import {  
  LOGOUT_REQUESTING,
  LOGOUT_SUCCESS,
  SMARTCAR_AUTH_REQUESTING,
  SMARTCAR_AUTH_SUCCESS,
  SMARTCAR_AUTH_ERROR,
} from './constants'

// Import actions
import {  
  unsetUser,
  updateUser
} from '../User/actions'
import { smartcarResponse } from './actions'

const logout = function* () {
    // dispatches the USER_UNSET action
    yield put(unsetUser())
    // remove our tokens
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
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
const url =  `${process.env.REACT_APP_API_URL}/api/smartcar`
const authUrl = `${url}/auth`
const callbackUrl = `${url}/callback`

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

const smartcarApi = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token'))
            // 'Authorization': JSON.parse(localStorage.getItem('access_token')).accessToken
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
        
        if (action.type === SMARTCAR_AUTH_REQUESTING) task = yield fork(authFlow)

        if (action.type === SMARTCAR_AUTH_ERROR) yield cancel(task)

        if (action.type === SMARTCAR_AUTH_SUCCESS) {
            access = JSON.parse(localStorage.getItem('access_token'))
            if (access && access.accessToken) {
                yield put(updateUser(access))
                let vehicles = yield call(smartcarApi, url + `/vehicles/${access.accessToken}`)
                console.log(vehicles)
                yield put(smartcarResponse(vehicles))
                // TODO: getVehicles and display
            } else {
                console.log('else')
                let callback = yield call(api, callbackUrl + action.search)
                access = JSON.stringify(callback.access)
                // set a stringified version of our token to localstorage on our domain
                localStorage.setItem('access_token', access)
                yield put(updateUser(access))
                yield put(smartcarResponse(callback))
            }
        }

    }
}

export default dashboardWatcher