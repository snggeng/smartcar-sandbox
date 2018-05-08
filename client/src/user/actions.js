import { USER_SET, USER_UNSET } from './constants'

export const setUser = (token) => ({
    type: USER_SET,
    token,
})
  
export const unsetUser = () => ({ type: USER_UNSET })