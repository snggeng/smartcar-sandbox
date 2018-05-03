const express = require('express')
const router = express.Router()

// Controllers
const userController = require('../controllers/users')

// AUTH ROUTES
router.post('/signin', userController.signIn)
router.get('/signout', userController.signOut)
router.post('/sso', userController.sso)
router.get('/refresh', userController.refreshUser)
router.get('/', (req, res) => res.json({message: 'hi'}))

// USER ROUTES
router.route('/users')
  .get(userController.getAll)
  .post(userController.createUser)

module.exports = router
