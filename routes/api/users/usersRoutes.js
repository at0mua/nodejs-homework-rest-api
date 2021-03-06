const express = require('express')
const router = express.Router()

const usersController = require('../../../model/users/usersController')
const validator = require('./usersValidator')

router.post('/registration', usersController.registration)
router.post('/login', usersController.login)
router.post('/logout', usersController.logout)

module.exports = router
