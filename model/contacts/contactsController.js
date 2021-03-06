const Contact = require('./contactsModel')
const { HttpCode } = require('../../helpers/constants')

const addContact = async (req, res, next) => {
  try {
    await Contact.create({ ...req.body })

    res.status(HttpCode.CREATED).json({ message: 'Contact added' })
  } catch (err) {
    next(err)
  }
}

const listContacts = async (_req, res, next) => {
  try {
    const results = await Contact.find({})

    res.status(HttpCode.OK).json(results)
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await Contact.findById(contactId)

    if (result) {
      return res.status(HttpCode.OK).json(result)
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: 'Contact not Found' })
    }
  } catch (err) {
    next(err)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params

    const result = await Contact.findByIdAndUpdate(contactId, req.body)

    if (result) {
      return res
        .status(HttpCode.OK)
        .json({ message: 'Contact updated successfully' })
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: 'Contact not Found' })
    }
  } catch (err) {
    next(err)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await Contact.findByIdAndDelete(contactId)

    if (result) {
      return res.status(HttpCode.OK).json({ message: 'Contact deleted' })
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: 'Contact not found' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
