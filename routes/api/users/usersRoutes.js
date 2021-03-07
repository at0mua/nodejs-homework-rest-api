const express = require('express')
const router = express.Router()

const {
  registration,
  login,
  logout,
} = require('../../../model/users/usersController')
const { validateCreateUser, validateLoginUser } = require('./usersValidator')
const guard = require('../../../helpers/guard')

router.post('/registration', validateCreateUser, registration)
router.post('/login', validateLoginUser, login)
router.get('/logout', guard, logout)

module.exports = router
