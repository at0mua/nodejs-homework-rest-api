const Contact = require('./contactsSchema')

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

module.exports = { getAllContacts }
