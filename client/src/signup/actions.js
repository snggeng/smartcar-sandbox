import { SIGNUP_REQUESTING } from './constants'

const signupRequest = ({ username, password }) => ({
    type: SIGNUP_REQUESTING,
    username,
    password,
  })

export default signupRequest 