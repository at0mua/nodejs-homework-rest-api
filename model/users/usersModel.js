const User = require('./usersSchema')

const findUserByEmail = async email => {
  return await User.findOne({ email })
}

// const findUserByEmail = async email => {
//   try {
//     const result = await User.findOne({ email })
//     return result
//   } catch (err) {
//     return console.error(err.message)
//   }
// }

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

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateToken,
}
