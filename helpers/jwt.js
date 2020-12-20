require('dotenv/config')
const JWT = require('jsonwebtoken')

const data = require('../data')

const refreshTokens = data.refreshTokens
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET,
  REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

// Function to generate access token
const generateAccessToken = (user) => {
  return JWT.sign(user, ACCESS_SECRET, { expiresIn: '60m'})
}

// Function to generate refresh token
const generateRefreshToken = (user) => {
  const refreshToken = JWT.sign(user, REFRESH_SECRET)
  refreshTokens.push(refreshToken)
  return refreshToken
}

// Function to verify refresh Token
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, REFRESH_SECRET, (err, user) => {
      if (err) reject()
      const accessToken = generateAccessToken({
        username: user.username,
        name: user.name
      })
      resolve({
        accessToken: accessToken
      })
    })
  })
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
}