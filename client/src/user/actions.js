export function setUser (token) {  
    return {
      type: USER_SET,
      token,
    }
  }
  
  export function unsetUser () {  
    return {
      type: USER_UNSET,
    }
  }