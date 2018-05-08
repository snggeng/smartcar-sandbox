import { combineReducers } from 'redux'  
import { reducer as form } from 'redux-form'
import user from './user/reducer'
import signup from './signup/reducer'

const IndexReducer = combineReducers({
    signup,  
    user,
    form,
})

export default IndexReducer 