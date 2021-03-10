const Contact = require('./contactsSchema')

const getAllContacts = async (
  userId,
  { sortBy, sortByDesc, filter, page = '1', limit = '5' },
) => {
  const results = await Contact.paginate(
    { owner: userId },
    {
      page,
      limit,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'email -_id',
      },
    },
  )
  const { docs: contacts, totalDocs: total } = results

  return { total: total.toString(), page, limit, contacts }
}

module.exports = { getAllContacts }
