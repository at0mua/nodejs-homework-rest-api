const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')
require('dotenv').config()

const { reguestLimit } = require('./helpers/rate-limit')
const { HttpCode } = require('./helpers/constants')

const contactsRouter = require('./routes/api/contacts/contactsRontes')
const usersRouter = require('./routes/api/users/usersRoutes')

const app = express()

const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)))

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(helmet())
app.get('env') !== 'test' && app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 10000 }))

app.use('/api/', reguestLimit)
app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  res
    .status(err.status || HttpCode.SERVER_ERROR)
    .json({ message: err.message || 'unknown error' })
})

module.exports = app
