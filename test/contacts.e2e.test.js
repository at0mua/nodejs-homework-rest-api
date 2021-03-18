const request = require('supertest')
const jwt = require('jsonwebtoken')
require('dotenv').config

const { User, contacts, newContact } = require('../model/__mocks__/data')
const app = require('../app')
const SECRET_KEY = process.env.JWT_SECRET

const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ userId: User._id }, SECRET_KEY)
User.token = token

jest.mock('../model/contacts/contactsModel.js')
jest.mock('../model/users/usersModel.js')

describe('Testing the route api/contacts', () => {
  const contact = contacts[0]
  let newContactId
  const wrongToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDRiOWJjZDM3NmNjNTI1ZTRiZWUwMDMiLCJpYXQiOjE2MTU4MjQwOTIsImV4cCI6MTYxNTgzMTI5Mn0.pnr1lutB5CFSEFyjxMKjOaHb9Nw2foGPEeZ5FOq4TRM'
  const wrongId = 123456

  describe('Testing add new contact', () => {
    it('Add new contact, should return status 201', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(201)
      expect(res.body.contact).toBeDefined()
      newContactId = res.body.contact._id
      done()
    })

    it('Wrong field, should return 400 status', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...newContact, test: 1 })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })

    it('Unauthorized, should return 401 status', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .send(newContact)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${wrongToken}`)
        .send(newContact)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing get all contacts', () => {
    it('Get all contacts, should return 200 status', async done => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.contacts).toBeInstanceOf(Array)
      done()
    })

    it('Unauthorized, should return 401 status', async done => {
      const res = await request(app).get('/api/contacts')
      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${wrongToken}`)
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing get contact by id', () => {
    it('Get contact by id, should return status 200', async done => {
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body).toHaveProperty('_id')
      expect(res.body._id).toBe(contact._id)
      done()
    })

    it('Unauthorized, should return 401 status', async done => {
      const res = await request(app).get(`/api/contacts/${contact._id}`)
      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${wrongToken}`)
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })

    it('Wrong contact id, should return status 404 by', async done => {
      const res = await request(app)
        .get(`/api/contacts/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing update contact', () => {
    it('Update contact success should return 200 status', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'At0mUA' })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.contact.name).toBe('At0mUA')
      done()
    })

    it('Empty request, should return 400 status', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .set('Accept', 'application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      done()
    })

    it('Unauthorized, should return 401 status', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .send({ phone: '(123) 456-7890' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${wrongToken}`)
        .send({ phone: '(123) 456-7890' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })

    it('Wrong contact id, should return 404 status', async done => {
      const res = await request(app)
        .patch(`/api/contacts/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ phone: '(123) 456-7890' })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing remove contact', () => {
    it('Remove contact success, should return 200 status', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      done()
    })

    it('Unauthorized, should return 401 status', async done => {
      const res = await request(app).delete(`/api/contacts/${newContactId}`)

      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${newContactId}`)
        .set('Authorization', `Bearer ${wrongToken}`)

      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })

    it('Wrong contact id, should return 404 status with ', async done => {
      const res = await request(app)
        .delete(`/api/contacts/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(404)
      expect(res.body).toBeDefined()
      done()
    })
  })
})
