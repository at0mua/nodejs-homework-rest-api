const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('./constants')

const guard = (req, res, next) => {}

module.exports = { guard }
