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
        .json({ message: 'Email is alredy in uses' })
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
    const validPassword = await user.validPassword(password)

    if (!user || !validPassword) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'Invalid credentionals ' })
    }

    const userId = user._id
    const payload = { userId }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(userId, token)

    res.status(HttpCode.OK).json({ token })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {}

module.exports = { registration, login, logout }
