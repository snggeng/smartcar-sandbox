import { LOGIN_REQUESTING } from './constants'
  
// In order to perform an action of type LOGIN_REQUESTING
// we need an username and password
export const loginRequest = ({ username, password }) => ({
    type: LOGIN_REQUESTING,
    username,
    password,
})
