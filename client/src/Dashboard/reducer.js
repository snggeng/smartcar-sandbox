import {  
    LOGOUT_REQUESTING,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
} from './constants'

import { LOGIN_SUCCESS } from '../Login/constants'
  
const logoutInitialState = {  
    requesting: false,
    successful: false,
    messages: [],
    errors: [],
}

const dashboardInitialState = {}
  
export const logoutReducer = (state = logoutInitialState, action) => {  
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
        return logoutInitialState

        default:
        return state
    }
}

const dashboardReducer = (state = dashboardInitialState, action) => {

}

export default dashboardReducer