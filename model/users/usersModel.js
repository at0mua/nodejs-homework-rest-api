const fs = require('fs').promises
const path = require('path')
const Jimp = require('jimp')
const User = require('./usersSchema')
const createFolderIsExist = require('../../helpers/create-dir')

const findUserByEmail = async email => {
  return await User.findOne({ email })
}

const findUserById = async id => {
  return await User.findOne({ _id: id })
}

const createUser = async ({ email, password }) => {
  const user = new User({ email, password })
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateUserSub = async (id, sub) => {
  return await User.updateOne({ _id: id }, { subscription: sub }, { new: true })
}

const findUserByToken = async token => {
  return await User.findOne({ token })
}

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarUrl: avatarUrl })
}

const saveAvatarToStatick = async req => {
  const userId = req.user._id
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
  const pathFile = req.file.path
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`
  const img = await Jimp.read(pathFile)
  img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)
  await createFolderIsExist(path.join(`${AVATARS_OF_USERS}`, `${userId}`))
  await fs.rename(
    `${pathFile}`,
    path.join(`${AVATARS_OF_USERS}`, `${userId}`, `${newNameAvatar}`),
  )
  const avatarUrl = path.normalize(path.join(`${userId}`, `${newNameAvatar}`))
  try {
    await fs.unlink(
      path.join(process.cwd(), `${AVATARS_OF_USERS}`, `${req.user.avatarUrl}`),
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
