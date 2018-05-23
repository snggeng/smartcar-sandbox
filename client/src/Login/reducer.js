import {  
    LOGIN_REQUESTING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
} from './constants'

import { LOGOUT_SUCCESS } from '../Dashboard/constants'
  
const initialState = {  
    requesting: false,
    successful: false,
    messages: [],
    errors: [],
}
  
const loginReducer = (state = initialState, action) => {  
    switch (action.type) {
        case LOGIN_REQUESTING:
        return {
            requesting: true,
            successful: false,
            messages: [{ body: 'Logging in...', time: new Date() }],
            errors: [],
        }
        case LOGIN_SUCCESS:
        return {
            errors: [],
            messages: [{ body: 'You are now logged in!', time: new Date() }],
            requesting: false,
            successful: true,
        }
        case LOGIN_ERROR:
        return {
            errors: state.errors.concat([{
            body: action.error.toString(),
            time: new Date(),
            }]),
            messages: [],
            requesting: false,
            successful: false,
        }
        case LOGOUT_SUCCESS: 
        return initialState

        default:
        return state
    }
}

export default loginReducer