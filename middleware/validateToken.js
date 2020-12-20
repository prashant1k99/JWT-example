require('dotenv/config')
const JWT = require('jsonwebtoken')

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

// Middleware to authenticate token
const validateAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    // Verify token
    JWT.verify(token, ACCESS_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

module.exports = validateAuthToken