import { LOGIN_REQUESTING, } from './constants'
  
// In order to perform an action of type LOGIN_REQUESTING
// we need an email and password
const loginRequest = ({ username, password }) => ({
    type: LOGIN_REQUESTING,
    username,
    password,
})

export default loginRequest  