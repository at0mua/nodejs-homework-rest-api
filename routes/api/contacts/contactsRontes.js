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

router.get('/', listContacts).post('/', validateAddContact, addContact)

router
  .get('/:contactId', getContactById)
  .delete('/:contactId', removeContact)
  .patch('/:contactId', validateUpdateContact, updateContact)

module.exports = router
