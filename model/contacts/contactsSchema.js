const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

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

contactSchema.plugin(mongoosePaginate)

const contactModel = model('Contact', contactSchema)

module.exports = contactModel
