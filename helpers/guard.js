const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const authorization = req.get('Authorization')
    if (!authorization) {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'You are not authorized',
      })
    }
    const [, token] = authorization.split(' ')
    if (!user || err || token !== user.token) {
      return res
        .status(HttpCode.FORBIDDEN)
        .json({ message: 'Access is denied' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard
