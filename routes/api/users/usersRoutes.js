const express = require('express')
const router = express.Router()

const {
  registration,
  login,
  logout,
  currentUser,
  updateSub,
  avatars,
} = require('../../../model/users/usersController')
const {
  validateCreateUser,
  validateLoginUser,
  validateUpdateSub,
  validateUploadAvatar,
} = require('./usersValidator')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

router.post('/registration', validateCreateUser, registration)
router.post('/login', validateLoginUser, login)
router.get('/logout', guard, logout)
router.get('/current', guard, currentUser)
router.patch('/', guard, validateUpdateSub, updateSub)
router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  validateUploadAvatar,
  avatars,
)

module.exports = router
