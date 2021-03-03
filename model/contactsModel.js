const mongoose = require('mongoose')
const { Schema, model } = mongoose

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, 'Set contact name'] },
    email: {
      type: String,
      required: [true, 'Set contact email'],
      unique: true,
    },
    phone: { type: String, required: [true, 'Set contact phone'] },
    subscription: { type: String, default: 'free' },
    password: { type: String, default: 'password' },
    token: { type: String, default: '' },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const contactModel = model('Contact', contactSchema)

module.exports = contactModel
