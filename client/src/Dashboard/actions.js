import { LOGOUT_REQUESTING, SMARTCAR_AUTH_REQUESTING, SMARTCAR_AUTH_SUCCESS } from './constants'
  
export const logoutRequest = () => ({ type: LOGOUT_REQUESTING })
export const smartcarAuthRequest = () => ({ type: SMARTCAR_AUTH_REQUESTING })
export const smartcarAuthSuccess = (search) => ({ type: SMARTCAR_AUTH_SUCCESS, search })