// middleware for doing role-based permissions
const permit = function(...allowed) {
  const isAllowed = role => allowed.indexOf(role) > -1

  // return a middleware
  return (req, res, next) => {
    if (req.user && isAllowed(req.user.role)) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      let err = new Error("Forbidden. You do not have permission to access this information.")
      err.status = 403
      return next(err)
    }
  }
}

module.exports = permit
