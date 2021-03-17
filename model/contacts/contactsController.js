const Contacts = require('./contactsModel')
const { HttpCode } = require('../../helpers/constants')

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.addContact(req.body, userId)

    res.status(HttpCode.CREATED).json({ message: 'Contact added', contact })
  } catch (err) {
    next(err)
  }
}

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const results = await Contacts.getAllContacts(userId, req.query)

    res.status(HttpCode.OK).json({ ...results })
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contactId } = req.params
    const contact = await Contacts.getContactById(contactId, userId)

    if (contact) {
      return res.status(HttpCode.OK).json(contact)
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
    const userId = req.user.id
    const { contactId } = req.params

    const contact = await Contacts.updateContact(contactId, req.body, userId)

    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ message: 'Contact updated successfully', contact })
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
    const userId = req.user.id
    const { contactId } = req.params
    const contact = await Contacts.removeContact(contactId, userId)

    if (contact) {
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
