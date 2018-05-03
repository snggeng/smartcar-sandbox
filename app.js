// load .env config
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bunyan = require('bunyan')
const passport = require('passport')
const path = require('path')
const app = express()
const router = require('./routes/api')
const public = require('./routes/public')
const config = require('./config')(process.env.NODE_ENV)
const auth = require('./middleware/auth.js')
const https = require('https')
const fs = require('fs')

// Helpers
const { log } = require('./utils/logger')

/* CONNECT TO MONGODB */
mongoose.connect(config.database, config.options)
mongoose.Promise = global.Promise

// Debugging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// handle stack trace for unhandledRejection
process.on('unhandledRejection', r => log.error(r));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200)
  } else {
    next()
  }
})

// ROUTES
// Root - API spec for now
// app.get('/', (req, res, next) => {
//   res.sendFile(path.resolve('index.html'))
// })

// public routes
app.use('/public', public)

// Protect '/api/*' route with JWT Auth middleware
app.use('/api', auth)

// keep all api routes in a seperate file - prefix routes with api/ path
app.use('/api', router)

// create admin user
// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') { seed() }

// Initialize Passport.js
app.use(passport.initialize())

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Handle Errors in development
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    // Log errors
    err ?
      log.error(err) :
      next()
  })
}

// Handle errors in production with less information logged
app.use((err, req, res, next) => {
  if (err) {
    if (err.name === 'MongoError' && err.code === 11000 || err.message.includes('E11000')) {
      err.description = 'duplicate key error'
    } else if (err.name === 'ValidationError') {
      err.description = 'validation error'
    }
    res.status(err.status || 500)
  }

  res.json({
    name: err.name,
    message: err.message,
    error: err,
    description: err.description
  })
})

// Start UNIX socket and begin listening for connections on PORT
app.listen(process.env.PORT || 3000)

module.exports = app
