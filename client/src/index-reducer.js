import { combineReducers } from 'redux'  
import { reducer as form } from 'redux-form'
import user from './User/reducer'
import signup from './Signup/reducer'
import login from './Login/reducer'
import {logoutReducer as logout } from './Dashboard/reducer'

const IndexReducer = combineReducers({
    login,
    logout,
    signup,  
    user,
    form,
})

export default IndexReducer 