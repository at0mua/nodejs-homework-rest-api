const db = require('../db/db')
const HttpCode = require('../helpers/status')

const { ObjectID } = require('mongodb')

const getCollection = async (db, name) => {
  const client = await db
  const collection = await client.db().collection(name)
  return collection
}

const addContact = async (req, res, next) => {
  try {
    const collection = await getCollection(db, 'contacts')
    await collection.insertOne({ ...req.body })

    res.status(HttpCode.CREATED).json({ message: 'Contact added' })
  } catch (err) {
    next(err)
  }
}

const listContacts = async (_req, res, next) => {
  try {
    const collection = await getCollection(db, 'contacts')
    const results = await collection.find({}).toArray()

    res.status(HttpCode.OK).json(results)
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const collection = await getCollection(db, 'contacts')

    const { contactId } = req.params

    const objectId = new ObjectID(contactId)
    console.log(objectId.getTimestamp())

    const [result] = await collection.find({ _id: objectId }).toArray()

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
    const collection = await getCollection(db, 'contacts')
    const { contactId } = req.params
    const objectId = new ObjectID(contactId)
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: req.body },
    )

    if (result.value) {
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
    const collection = await getCollection(db, 'contacts')
    const { contactId } = req.params
    const objectId = new ObjectID(contactId)
    const { value: result } = await collection.findOneAndDelete({
      _id: objectId,
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
