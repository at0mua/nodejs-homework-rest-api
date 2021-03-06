const express = require('express')
const router = express.Router()

const usersController = require('../../../model/users/usersController')
const validator = require('./usersValidator')

router.post('/registration')
router.post('/login')
router.post('/logout')

module.exports = router
