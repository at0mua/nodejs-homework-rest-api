const User = require('./usersSchema')

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

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateToken,
  updateUserSub,
  findUserByToken,
  updateAvatar,
}
