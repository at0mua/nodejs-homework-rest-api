const fs = require('fs').promises
const path = require('path')
const Jimp = require('jimp')
const bcrypt = require('bcryptjs')
const createFolderIsExist = require('../../../helpers/create-dir')
const { users } = require('../../__mocks__/data')

const findUserByEmail = jest.fn(email => {
  const [user] = users.filter(el => String(el.email) === String(email))
  return user
})

const findUserById = jest.fn(id => {
  const [user] = users.filter(el => String(el._id) === String(id))
  return user
})

const createUser = jest.fn(({ email, password }) => {
  const pass = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  const newUser = {
    email,
    password: pass,
    _id: '6044cac08c8cf733a460da42',
    validPassword: function (pass) {
      return bcrypt.compareSync(pass, this.password)
    },
  }
  users.push(newUser)
  return newUser
})

const updateToken = jest.fn((id, token) => {
  const [user] = users.filter(el => String(el._id) === String(id))
  if (user) {
    user.token = token
  }
  return {}
})

const updateUserSub = jest.fn((id, sub) => {
  const [user] = users.filter(el => String(el._id) === String(id))
  if (user) {
    user.subscription = sub
  }
  return user
})

const findUserByToken = jest.fn(token => {
  const [user] = users.filter(el => String(el.token) === String(token))
  return user
})

const updateAvatar = jest.fn((id, avatarUrl) => {
  const [user] = users.filter(el => String(el._id) === String(id))
  if (user) {
    user.avatarUrl = avatarUrl
  }
  return user.avatarUrl
})

const saveAvatarToStatick = async req => {
  const id = req.user._id
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
  const pathFile = req.file.path
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`
  const img = await Jimp.read(pathFile)
  img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id))
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar))
  const avatarUrl = path.normalize(path.join(id, newNameAvatar))
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarUrl),
    )
  } catch (err) {
    console.log(err.message)
  }
  return avatarUrl
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateToken,
  updateUserSub,
  findUserByToken,
  updateAvatar,
  saveAvatarToStatick,
}
