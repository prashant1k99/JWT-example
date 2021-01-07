require('dotenv/config')
const JWT = require('jsonwebtoken')

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

// Middleware to authenticate token
const validateAuthToken = (req, res, next) => {
  try {
    const authHeader = req.headers && req.headers['authorization']
    if (!authHeader) {
      res.status(401)
      return res.send('No Auth header')
    }
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      res.status(401)
      return res.send('No Auth header')
    }
    // Verify token
    JWT.verify(token, ACCESS_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  } catch (err) {
    res.status(500)
    res.send(err)
  }
}

module.exports = validateAuthToken