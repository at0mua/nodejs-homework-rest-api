// const mongoose = require('mongoose')
const { Schema, model } = require('mongoose')
const bcrytp = require('bcryptjs')
const SALT_WORK_FACTOR = 10

// const { Subscription } = require('../../helpers/constants')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/
        return re.test(String(value).toLowerCase())
      },
    },
    password: {
      type: String,
      required: [true, 'Password required'],
    },
    // subscription: {
    //   type: String,
    //   enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
    //   default: Subscription.FREE,
    // },
    token: {
      type: String,
      defaul: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrytp.genSalt(SALT_WORK_FACTOR)
  this.password = await bcrytp.hash(this.password, salt, null)
  next()
})

userSchema.methods.validPassword = async function (password) {
  return await bcrytp.compare(password, this.password)
}

const userModel = model('User', userSchema)

module.exports = userModel
