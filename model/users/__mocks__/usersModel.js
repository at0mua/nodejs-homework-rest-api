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
  return {}
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
  return {}
})

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateToken,
  updateUserSub,
  findUserByToken,
  updateAvatar,
}
