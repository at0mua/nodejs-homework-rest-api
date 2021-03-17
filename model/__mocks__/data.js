const User = {
  _id: '604b9bcd376cc525e4bee003',
  subscription: 'pro',
  email: 'zatom89@gmail.com',
  password: '$2a$10$oNV53jDeU6jwbQPJ7W.Pxe287FFIuD6SlEfCGTOz4lmp8u4svJ/ei',
  avatarUrl: '604b9bcd376cc525e4bee003\\1615581838683-IMG_20201007_141250.jpg',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MDRiOWJjZDM3NmNjNTI1ZTRiZWUwMDMiLCJpYXQiOjE2MTU4OTUyMzcsImV4cCI6MTYxNTkwMjQzN30.roJWWyWc5lwBNuyo1e3pj_Ncga0nHoDuIcNxx1cqrYU',
}

const users = []
users[0] = User

const newUser = { email: 'test@test.com', password: '12345678' }

const contacts = [
  {
    _id: '6044e58281f9b813a089c88c',
    subscription: 'free',
    name: 'Test1',
    email: 'Test@gmail.com',
    phone: '(123) 456-7890',
    owner: '6044cac08c8cf733a460da42',
  },
  {
    _id: '6044e6b581f9b813a089c88d',
    subscription: 'free',
    name: 'Test2',
    email: 'Test@mail.com',
    phone: '(123) 456-7890',
    owner: '6043ec0a8e1da84064043cca',
  },
  {
    _id: '6048ad249f33373168eb86ea',
    subscription: 'premium',
    name: 'Anastasia Halitsa',
    email: '7nas7ma@gmail.com',
    phone: '(095) 318-1406',
    owner: '6043ec0a8e1da84064043cca',
  },
]

const newContact = {
  subscription: 'pro',
  name: 'Allen Raymond',
  email: 'nulla.ante@vestibul.co.uk',
  phone: '(992) 914-3792',
}

module.exports = { User, users, newUser, contacts, newContact }
