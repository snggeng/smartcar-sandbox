import { USER_SET, USER_UNSET, USER_SET_SMARTCAR_TOKEN } from './constants'
import { jwt_decode } from 'jwt-decode'

const initialSate = {  
  id: null,
  token: null,
}

const userReducer = (state = initialSate, action) => {  
  switch (action.type) {
    case USER_SET:
      return {
        token: action.token,
      }

    case USER_UNSET:
      return {
        id: null,
        token: null,
    }

    case USER_SET_SMARTCAR_TOKEN:
    return {
      ...state,
      smartcar: action.access_token,
    }

    default:
      return state
  }
}

export default userReducer  
