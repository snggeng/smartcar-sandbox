import { SIGNUP_REQUESTING } from './constants'

const signupRequest = ({ username, password, first_name, last_name }) => ({
    type: SIGNUP_REQUESTING,
    username,
    password,
    first_name,
    last_name
})

export default signupRequest 