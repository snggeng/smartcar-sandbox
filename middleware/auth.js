
const jwt = require('jsonwebtoken')
const config = require('../config')(process.env.NODE_ENV)

const auth = (req, res, next) => {
    /*
     * Check if authorization header is set
     */
  if (req.hasOwnProperty('headers') && req.headers.hasOwnProperty('authorization')) {
    try {
      /*
       * Try to decode & verify the JWT token
       * The token contains user's id ( it can contain more information )
       * and this is saved in req.user object
       */
      req.user = jwt.verify(req.headers.authorization, config.secret)
    } catch (err) {
      /*
       * If the authorization header is corrupted, it throws exception
       * So return 401 status code with JSON error message
       */
      err.status = 401
      return next(err)
    }
  } else {
    /*
     * If there is no autorization header, return 401 status code with JSON
     * error message
     */
    let err = new Error('Missing authentication token.')
    err.status = 401
    return next(err)
  }
  next()
  return
}

module.exports = auth
