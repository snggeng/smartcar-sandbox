// because Fetch doesn't recognize error responses as
// actual errors since it's technically completing the response...
export function handleApiErrors (response) {  
    // console.log(response)
    if (response.message) throw Error(response.message)
    return response
  }