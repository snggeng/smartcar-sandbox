import { LOGOUT_REQUESTING, SMARTCAR_AUTH_REQUESTING, SMARTCAR_AUTH_SUCCESS, SMARTCAR_RESPONSE_SUCCESS,
         LOCK_REQUESTING, UNLOCK_REQUESTING } from './constants'
  
export const logoutRequest = () => ({ type: LOGOUT_REQUESTING })
export const smartcarAuthRequest = () => ({ type: SMARTCAR_AUTH_REQUESTING })
export const smartcarAuthSuccess = (search) => ({ type: SMARTCAR_AUTH_SUCCESS, search })
export const smartcarResponse = (response) => ({ type: SMARTCAR_RESPONSE_SUCCESS, response })
export const lockRequest = (id) => ({ type: LOCK_REQUESTING, id })
export const unlockRequest = (id) => ({ type: UNLOCK_REQUESTING, id })