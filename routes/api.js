const express = require('express')
const router = express.Router()
const passport = require('passport')
const permit = require('../middleware/permission')

// Controllers
const userController = require('../controllers/users')
const smartcarController = require('../controllers/smartcar')

// USER ROUTES
// router.route('/users')
//   .all(permit('admin'))
//   .get(userController.getAll)
//   .post(userController.createUser)

router.get('/users/:id', permit('admin', 'user'), userController.getUser)
router.put('/users/:id', permit('admin', 'user'), userController.updateUser)
router.delete('/users/:id', permit('admin', 'user'), userController.deleteUser)
router.get('/users/page/:page/limit/:limit/q', permit('admin', 'user'), userController.getPaginated)

// SMARTCAR ROUTES
router.get('/smartcar/auth', permit('admin', 'user'), smartcarController.authFlow)
router.get('/smartcar/callback', permit('admin', 'user'), smartcarController.callback)
router.get('/smartcar/access', permit('admin', 'user'), smartcarController.getAccess)
router.get('/smartcar/vehicles/:token', permit('admin', 'user'), smartcarController.getVehicles)
router.get('/smartcar/lock/:id/:token', permit('admin', 'user'), smartcarController.lockVehicle)
router.get('/smartcar/unlock/:id/:token', permit('admin', 'user'), smartcarController.unlockVehicle)

module.exports = router
