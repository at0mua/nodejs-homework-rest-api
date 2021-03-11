const express = require('express')
const router = express.Router()

const {
  registration,
  login,
  logout,
  currentUser,
  updateSub,
} = require('../../../model/users/usersController')
const {
  validateCreateUser,
  validateLoginUser,
  validateUpdateSub,
} = require('./usersValidator')
const guard = require('../../../helpers/guard')

router.post('/registration', validateCreateUser, registration)
router.post('/login', validateLoginUser, login)
router.get('/logout', guard, logout)
router.get('/current', guard, currentUser)
router.patch('/', guard, validateUpdateSub, updateSub)

module.exports = router
