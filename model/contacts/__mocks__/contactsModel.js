const { contacts } = require('../../__mocks__/data')

const addContact = jest.fn((body, userId) => {
  const newContact = { ...body, _id: '6048ad249f33373168eb86eb' }
  contacts.push(newContact)
  return newContact
})

const getAllContacts = jest.fn(
  (userId, { sortBy, sortByDesc, sub, filter, page = '1', limit = '20' }) => {
    return { contacts, total: contacts.length, limit, page }
  },
)

const getContactById = jest.fn((contactId, userId) => {
  const [contact] = contacts.filter(el => String(el._id) === String(contactId))
  return contact
})

const updateContact = jest.fn((contactId, body, userId) => {
  let [contact] = contacts.filter(el => String(el._id) === String(contactId))
  if (contact) {
    contact = { ...contact, ...body }
  }
  return contact
})

const removeContact = jest.fn((contactId, userId) => {
  const index = contacts.findIndex(el => String(el._id) === String(contactId))
  if (index === -1) {
    return null
  }
  const [contact] = contacts.splice(index, 1)
  return contact
})

module.exports = {
  getAllContacts,
  addContact,
  getContactById,
  updateContact,
  removeContact,
}
