const fs = require('fs/promises')
const path = require('path')
const HttpCode = require('../helpers/status')

const contactsPath = path.resolve('db', 'contacts.json')

const listContacts = async (_req, res, next) => {
  try {
    const contacts = await fs.readFile(contactsPath, 'utf-8')
    const parsedContacts = JSON.parse(contacts)
    res.status(HttpCode.OK).json(parsedContacts)
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contacts = await fs.readFile(contactsPath, 'utf-8')
    const parsedContacts = JSON.parse(contacts)
    const contactById = parsedContacts.find(
      contact => contact.id === Number(contactId),
    )
    if (contactById) {
      return res.status(HttpCode.OK).json(contactById)
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
    const contacts = await fs.readFile(contactsPath, 'utf-8')
    const parsedContacts = JSON.parse(contacts)
    const contactIndex = parsedContacts.findIndex(
      contact => contact.id === Number(contactId),
    )
    if (contactIndex !== -1) {
      parsedContacts.splice(contactIndex, 1)
      fs.writeFile(contactsPath, JSON.stringify(parsedContacts, null, 2))
      return res.status(HttpCode.OK).json({ message: 'Contact deleted' })
    } else {
      return res
        .status(HttpCode.NOT_FOUND)
        .json({ message: 'Contact not Found' })
    }
  } catch (err) {
    next(err)
  }
}

const addContact = async (req, res, next) => {
  const newContact = req.body
  try {
    const contacts = await fs.readFile(contactsPath, 'utf-8')
    const parsedContacts = JSON.parse(contacts)
    const id = parsedContacts.length > 0 ? [...parsedContacts].pop().id + 1 : 1
    fs.writeFile(
      contactsPath,
      JSON.stringify([...parsedContacts, { id, ...newContact }], null, 2),
    )
    res.status(HttpCode.CREATED).json(newContact)
  } catch (err) {
    next(err)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contacts = await fs.readFile(contactsPath, 'utf-8')
    const parsedContacts = JSON.parse(contacts)
    const contactIndex = parsedContacts.findIndex(
      contact => contact.id === Number(contactId),
    )
    if (contactIndex !== -1) {
      const updatedContact = {
        ...parsedContacts[contactIndex],
        ...req.body,
      }
      const updatedContacts = [
        ...parsedContacts.slice(0, contactIndex),
        updatedContact,
        ...parsedContacts.slice(contactIndex + 1),
      ]
      fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2))
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

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
