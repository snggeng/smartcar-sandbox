import {  
    LOGOUT_REQUESTING,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
    SMARTCAR_AUTH_REQUESTING,
    SMARTCAR_AUTH_SUCCESS,
    SMARTCAR_AUTH_ERROR,
} from './constants'

import { LOGIN_SUCCESS } from '../Login/constants'
  
const initialState = {  
    requesting: false,
    successful: false,
    messages: [],
    errors: [],
}
  
export const logoutReducer = (state = initialState, action) => {  
    switch (action.type) {
        case LOGOUT_REQUESTING:
        return {
            requesting: true,
            successful: false,
            messages: [{ body: 'Logging out...', time: new Date() }],
            errors: [],
        }
        case LOGOUT_SUCCESS:
        return {
            errors: [],
            messages: [{ body: 'You are now logged out!', time: new Date() }],
            requesting: false,
            successful: true,
        }
        case LOGOUT_ERROR:
        return {
            errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
            }]),
            messages: [],
            requesting: false,
            successful: false,
        }

        case LOGIN_SUCCESS: 
        return initialState

        default:
        return state
    }
}

export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case SMARTCAR_AUTH_REQUESTING:
        return {
            requesting: true,
            successful: false,
            messages: [{ body: 'Requesting for permission from Smartcar API', time: new Date() }],
            errors: [],
        }
        case SMARTCAR_AUTH_SUCCESS:
        return {
            errors: [],
            messages: [{ body: 'Successfully connected to Smartcar API', time: new Date() }],
            requesting: false,
            successful: true,
        }
        case SMARTCAR_AUTH_ERROR:
        return {
            errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
            }]),
            messages: [],
            requesting: false,
            successful: false,
        }

        default:
        return state
    }
}