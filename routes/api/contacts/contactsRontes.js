const express = require('express')
const router = express.Router()

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../../model/contacts/contactsController')
const {
  validateAddContact,
  validateUpdateContact,
} = require('./contactsValidator')

const guard = require('../../../helpers/guard')

router
  .get('/', guard, listContacts)
  .post('/', guard, validateAddContact, addContact)

router
  .get('/:contactId', guard, getContactById)
  .delete('/:contactId', guard, removeContact)
  .patch('/:contactId', guard, validateUpdateContact, updateContact)

module.exports = router
