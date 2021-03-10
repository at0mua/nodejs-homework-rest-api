const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string().min(3).max(50).optional(),
  token: Joi.string().optional(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().required(),
  subscription: Joi.string().min(3).max(50).optional(),
  token: Joi.string().optional(),
})

const schemaUpdateSub = Joi.object({
  subscription: Joi.any().valid('free', 'pro', 'premium').required(),
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

module.exports.validateUpdateSub = (req, res, next) => {
  const { error } = schemaUpdateSub.validate(req.body)
  if (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'Missing required fields' })
  }
  next()
}
