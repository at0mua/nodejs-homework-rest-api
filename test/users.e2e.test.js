const request = require('supertest')
const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
require('dotenv').config

const { User, newUser } = require('../model/__mocks__/data')
const app = require('../app')
const SECRET_KEY = process.env.JWT_SECRET

const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ userId: User._id }, SECRET_KEY)
User.token = token

jest.mock('../model/contacts/contactsModel.js')
jest.mock('../model/users/usersModel.js')

describe('Testing the route api/users', () => {
  const wrongToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDRiOWJjZDM3NmNjNTI1ZTRiZWUwMDMiLCJpYXQiOjE2MTU4MjQwOTIsImV4cCI6MTYxNTgzMTI5Mn0.pnr1lutB5CFSEFyjxMKjOaHb9Nw2foGPEeZ5FOq4TRM'

  describe('Testing user registration', () => {
    it('Registration success, should return 201 status', async done => {
      const res = await request(app)
        .post('/api/users/registration')
        .send(newUser)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(201)
      expect(res.body).toBeDefined()
      done()
    })

    it('Registration without required fields, should return 400 status', async done => {
      const res = await request(app)
        .post('/api/users/registration')
        .send({ email: '', password: '' })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(400)
      done()
    })

    it('Registration with the same email, should return 409 status', async done => {
      const res = await request(app)
        .post('/api/users/registration')
        .send(newUser)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(409)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing user login', () => {
    it('Login success, should return 200 status', async done => {
      const res = await request(app)
        .post('/api/users/login')
        .send(newUser)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      done()
    })

    it('Login without required fields, should return 404 status', async done => {
      const res = await request(app)
        .post('/api/users/registloginration')
        .send({ email: '', password: '' })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(404)
      done()
    })

    it('Login with unauthorized email, should return 401 status', async done => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'wrongUser@fake.com', password: '12345678' })
        .set('Accept', 'application/json')
      expect(res.status).toEqual(401)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing current user', () => {
    it('Get current user, should return 200 status', async done => {
      const res = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${wrongToken}`)
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing update subscription', () => {
    it('Update subscription success should return 200 status', async done => {
      const res = await request(app)
        .patch('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send({ subscription: 'premium' })
      expect(res.status).toEqual(200)
      done()
    })

    it('Update from the same subscription, should return 400 status', async done => {
      const res = await request(app)
        .patch('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send({ subscription: 'premium' })
      expect(res.status).toEqual(400)
      done()
    })

    it('No valid subscription, should return 400 status', async done => {
      const res = await request(app)
        .patch('/api/users/')
        .set('Authorization', `Bearer ${token}`)
        .send({ subscription: 'abc' })
      expect(res.status).toEqual(400)
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .patch('/api/users/')
        .set('Authorization', `Bearer ${wrongToken}`)
        .send({ subscription: 'free' })
      expect(res.status).toEqual(403)
      done()
    })
  })

  describe('Testing upload avatars', () => {
    it('Upload avatar, should return 200 status', async done => {
      const buffer = await fs.readFile('./test/user.jpg')
      const res = await request(app)
        .patch('/api/users/avatars')
        .set('Authorization', `Bearer ${token}`)
        .attach('avatar', buffer, 'user.jpg')
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const buffer = await fs.readFile('./test/user.jpg')
      const res = await request(app)
        .patch('/api/users/avatars')
        .set('Authorization', `Bearer ${wrongToken}`)
        .attach('avatar', buffer, 'user.jpg')
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })
  })

  describe('Testing user logout', () => {
    it('Logout success, should return 204 status', async done => {
      const res = await request(app)
        .get('/api/users/logout')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(204)
      expect(res.body).toBeDefined()
      done()
    })

    it('Authorisation Error, wrong token, should return 403 status', async done => {
      const res = await request(app)
        .get('/api/users/logout')
        .set('Authorization', `Bearer ${wrongToken}`)
      expect(res.status).toEqual(403)
      expect(res.body).toBeDefined()
      done()
    })
  })
})
