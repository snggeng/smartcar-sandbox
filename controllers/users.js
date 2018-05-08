const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../config')(process.env.NODE_ENV)
const { log } = require('../utils/logger')

// Models
const User = require('../models/user')

// Initialize passport config
require('../config/passport')(passport)

// CREATE
const createUser = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return next(new Error('Username and password are required'))
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role
    })
    if (req.body.first_name !== undefined) newUser.first_name = req.body.first_name
    if (req.body.last_name !== undefined) newUser.last_name = req.body.last_name
    // save the user
    newUser.save((err) => {
      if (err) return next(err)
      res.json(newUser)
    })
  }
}

// READ
const getAll = (req, res, next) => {
  User.find((err, users) => {
    if (err) return next(err)

    res.send(users)
  })
}

// PAGINATION
const getPaginated = async (req, res, next) => {
  let query = {}
  // Add options from query params if they exist
  if (req.query) {
    if (req.query.username) { query['username'] = req.query.username }
    // if (req.query.password) { query['password'] = req.query.password } // why would you query hash?
    if (req.query.role) { query['role'] = req.query.role }
  }
  let limit = parseInt(req.params.limit)
  let page = parseInt(req.params.page)

  // Get number of pages
  let count = await User.count().exec()
  let numPages = Math.ceil(count / limit)

  // search for ingredients based on pagination
  User.paginate(query, { page: page, limit: limit }, (err, result) => {
    if (err) return next(err)
    // log.info(`docs: ${result.docs}\n total: ${result.total}\n limit: ${result.limit}\n page: ${result.page}`)
    res.json({
      users: result.docs,
      page: result.page,
      numPages: numPages
    })
  })
}

// GET ONE
const getUser = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return next(err)
    res.json(user)
  })
}

// UPDATE
const updateUser = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return next(err)

    if (req.body.username) user.username = req.body.username
    if (req.body.password) user.password = req.body.password
    if (req.body.role) user.role = req.body.role
    if (req.body.first_name !== undefined) user.first_name = req.body.first_name
    if (req.body.last_name !== undefined) user.last_name = req.body.last_name
    if (req.body.netId) user.netId = req.body.netId

    user.save((err) => {
      if (err) return next(err)
      res.send(user)
    })
  })
}

// DELETE
const deleteUser = (req, res, next) => {
  User.findById({'_id': req.params.id}, (err, user) => {
    if (err) return next(err)

    user.remove((err) => {
      if (err) return next(err)
      res.json(user)
    })
  })
}

// SIGN IN
const signIn = (req, res, next) => {
  User.findOne({
    username: req.body.username
  }, async (err, user) => {
    if (err) return next(err)

    if (!user) {
      // User not found
      let error = new Error('Authentication failed. User not found.')
      error.status = 401
      error.type = 'user not found'
      return next(error)
      // res.status(401).send({success: false, message: 'Authentication failed. User not found.'})
    } else {
      // check if password matches
      let isMatch = await user.comparePassword(req.body.password)

      if (isMatch) {
        let token = jwt.sign(user.toObject(), config.secret, {expiresIn: '1d'})
        res.json({success: true, token: token})
      } else {
        log.error('Wrong password')
        let error = new Error('Authentication failed. Wrong password.')
        error.status = 401
        error.type = 'wrong password'
        return next(error)
      }
    }
  })
}

// SIGN OUT
const signOut = (req, res) => {
  // remove user
  delete req.user
  // Sign out
  res.status(200).json({
    success: true,
    message: 'User has been successfully logged out'
  })
}


// ENABLE USER REFRESH
// To fetch this endpoint on refresh in frontend to populate req.user
const refreshUser = (req, res, next) => {
  // validate jwt from headers and populate req.user
  jwt.verify(req.headers.authorization, config.secret, (err, decoded) => {
    if (err) return next(err)
    req.user = decoded
    res.status(200).json('User successfully refreshed')
  })
}

module.exports = {
  createUser,
  getAll,
  getPaginated,
  getUser,
  updateUser,
  deleteUser,
  signIn,
  signOut,
  refreshUser
}
