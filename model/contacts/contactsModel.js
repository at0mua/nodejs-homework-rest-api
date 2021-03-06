const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const { Subscription } = require('../../helpers/constants')

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, 'Set contact name'] },
    email: {
      type: String,
      required: [true, 'Set contact email'],
      unique: true,
    },
    phone: { type: String, required: [true, 'Set contact phone'] },
    subscription: {
      type: String,
      enum: [Subscription.FREE, Subscription.PRO, Subscription.PREMIUM],
      default: Subscription.FREE,
    },
    // password: { type: String, default: 'password' },
    // token: { type: String, default: '' },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const contactModel = model('Contact', contactSchema)

module.exports = contactModel
