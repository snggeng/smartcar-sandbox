import { USER_SET, USER_UNSET } from './constants'

const initialSate = {  
  id: null,
  token: null,
}

const userReducer = (state = initialSate, action) => {  
  switch (action.type) {
    case USER_SET:
      return {
        id: action.token.userId,
        token: action.token,
      }

    case USER_UNSET:
      return {
        id: null,
        token: null,
      }

    default:
      return state
  }
}

export default userReducer  
