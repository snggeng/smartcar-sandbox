export const setUser = (token) => ({
    type: USER_SET,
    token,
})
  
export const unsetUser = () => ({ type: USER_UNSET })