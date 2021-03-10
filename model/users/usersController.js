const jwt = require('jsonwebtoken')
const Users = require('./usersModel')
const { HttpCode } = require('../../helpers/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const registration = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Users.findUserByEmail(email)
    if (user) {
      return res
        .status(HttpCode.CONFLICT)
        .json({ message: 'Email is alredy in use' })
    }

    const newUser = await Users.createUser({ email, password })

    res.status(HttpCode.CREATED).json({
      id: newUser.id,
      email: newUser.email,
      message: 'User created successfully',
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Users.findUserByEmail(email)
    const validPassword = await user?.validPassword(password)

    if (!user || !validPassword) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'Email or password is wrong' })
    }

    const userId = user._id
    const payload = { userId }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(userId, token)

    return res.status(HttpCode.OK).json({
      token: token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id
    await Users.updateToken(userId, null)
    return res.status(HttpCode.NO_CONTENT).json()
  } catch (err) {
    next(err)
  }
}

const currentUser = async (req, res, next) => {
  try {
    const token = req.user.token
    const user = await Users.findUserByToken(token)

    return res.status(HttpCode.OK).json({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSub = async (req, res, next) => {
  const id = req.user.id
  const sub = req.body.subscription
  try {
    const user = await Users.findUserById(id)
    if (user.subscription === sub) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: `You already have ${sub} subscription.` })
    }

    await Users.updateUserSub(id, sub)
    const newUser = await Users.findUserById(id)
    return res.status(HttpCode.OK).json({
      message: `${newUser.email} changed subscription to ${newUser.subscription}`,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { registration, login, logout, currentUser, updateSub }
