const Subscription = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
}

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
}

module.exports = {
  HttpCode,
  Subscription,
}
