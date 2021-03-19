const jwt = require('jsonwebtoken')
const Users = require('./usersModel')
const { HttpCode } = require('../../helpers/constants')
const { nanoid } = require('nanoid')
require('dotenv').config()

const EmailService = require('../../services/email')

const SECRET_KEY = process.env.JWT_SECRET

const registration = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await Users.findUserByEmail(email)
    if (user) {
      return res
        .status(HttpCode.CONFLICT)
        .json({ message: 'Email is already in use' })
    }

    const verificationToken = nanoid()
    const emailService = new EmailService(process.env.NODE_ENV)
    await emailService.sendEmail(verificationToken, email)

    const newUser = await Users.createUser({
      email,
      password,
      verify: false,
      verificationToken,
    })

    res.status(HttpCode.CREATED).json({
      id: newUser._id,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
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
    if (!user.verification) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .json({ message: 'You have not confirmed your email' })
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
    const userId = req.user._id
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
  const userId = req.user._id
  const sub = req.body.subscription
  try {
    const user = await Users.findUserById(userId)
    if (user.subscription === sub) {
      return res
        .status(HttpCode.BAD_REQUEST)
        .json({ message: `You already have ${sub} subscription.` })
    }

    await Users.updateUserSub(userId, sub)
    const newUser = await Users.findUserById(userId)
    return res.status(HttpCode.OK).json({
      message: `${newUser.email} changed subscription to ${newUser.subscription}`,
    })
  } catch (err) {
    next(err)
  }
}

const avatars = async (req, res, next) => {
  try {
    const userId = req.user._id
    const avatarUrl = await Users.saveAvatarToStatic(req)
    await Users.updateAvatar(userId, avatarUrl)
    return res.status(HttpCode.OK).json(avatarUrl)
  } catch (err) {
    next(err)
  }
}

const verification = async (req, res, next) => {
  try {
    const user = await Users.findByVerificationToken(
      req.params.verificationToken,
    )
    if (user) {
      const userId = user._id
      await Users.updateVerificationToken(userId, true, null)
      return res
        .status(HttpCode.OK)
        .json({ message: 'Verification was successful' })
    }
    return res.status(HttpCode.NOT_FOUND).json({ message: 'User not found' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registration,
  login,
  logout,
  currentUser,
  updateSub,
  avatars,
  verification,
}
