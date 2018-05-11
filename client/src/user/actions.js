import { USER_SET, USER_UNSET, USER_SET_SMARTCAR_TOKEN } from './constants'

export const setUser = (token) => ({
    type: USER_SET,
    token,
})

export const updateUser = (access_token) => ({
    type: USER_SET_SMARTCAR_TOKEN,
    access_token
})
  
export const unsetUser = () => ({ type: USER_UNSET })