const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaCreateUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().optional(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().optional(),
})

module.exports.validateCreateUser = (req, res, next) => {
  const { error } = schemaCreateUser.validate(req.body)
  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'Missing required fields' })
  }
  next()
}

module.exports.validateLoginUser = (req, res, next) => {
  const { error } = schemaLoginUser.validate(req.body)
  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'Missing required fields' })
  }
  next()
}
