const Contact = require('./contactsSchema')

const addContact = async (body, userId) => {
  const result = await Contact.create({ ...body, owner: userId })
  return result
}

const getAllContacts = async (
  userId,
  { sortBy, sortByDesc, sub, filter, page = '1', limit = '20' },
) => {
  const options = { owner: userId }
  if (sub) {
    options.subscription = { $all: [sub] }
  }

  const results = await Contact.paginate(options, {
    page,
    limit,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'email subscription -_id',
    },
  })

  const { docs: contacts, totalDocs: total } = results

  return { total: total.toString(), page, limit, contacts }
}

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  })
  return result
}

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  )
  return result
}

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({
    _id: contactId,
    owner: userId,
  })
  return result
}

module.exports = {
  getAllContacts,
  addContact,
  getContactById,
  updateContact,
  removeContact,
}
