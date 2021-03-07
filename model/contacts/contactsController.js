const Contact = require('./contactsSchema')
const { HttpCode } = require('../../helpers/constants')

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    await Contact.create({ ...req.body, owner: userId })

    res.status(HttpCode.CREATED).json({ message: 'Contact added' })
  } catch (err) {
    next(err)
  }
}

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const results = await Contact.find({ owner: userId }).populate({
      path: 'owner',
      select: 'email',
    })

    res.status(HttpCode.OK).json(results)
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contactId } = req.params
    const result = await Contact.findById({
      _id: contactId,
      owner: userId,
    }).populate({
      path: 'owner',
      select: 'email',
    })

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
    const userId = req.user.id
    const { contactId } = req.params

    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...req.body },
    )

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
    const userId = req.user.id
    const { contactId } = req.params
    const result = await Contact.findByIdAndDelete({
      _id: contactId,
      owner: userId,
    })

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
