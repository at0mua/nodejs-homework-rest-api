const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaCreateUser = Joi.object({
  email: Joi.string()
    .min(8)
    .max(50)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(4).max(50).required(),
  subscription: Joi.string().min(3).max(50).optional(),
  token: Joi.string().optional(),
})

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .min(8)
    .max(50)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(4).max(50).required(),
  subscription: Joi.string().min(3).max(50).optional(),
  token: Joi.string().optional(),
})

const schemaUpdateSub = Joi.object({
  subscription: Joi.any().valid('free', 'pro', 'premium').required(),
})

module.exports.validateCreateUser = (req, res, next) => {
  const { error } = schemaCreateUser.validate(req.body)
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).json({
      message: 'Missing required fields. Enter your email and password',
    })
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
      .json({ message: 'Missing required fields. Enter new subscription' })
  }
  next()
}

module.exports.validateUploadAvatar = (req, res, next) => {
  if (!req.file) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: 'Field of avatar fith file not found' })
  }
  next()
}
