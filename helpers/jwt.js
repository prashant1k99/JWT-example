require('dotenv/config')
const JWT = require('jsonwebtoken')

const data = require('../data')

const refreshTokens = data.refreshTokens
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET,
  REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

// Function to generate access token
const generateAccessToken = (user) => new Promise((resolve, reject) =>{
  if (!user) reject('Please provide payload')
  resolve(JWT.sign(user, ACCESS_SECRET, { expiresIn: '60m'}))
})

// Function to generate refresh token
const generateRefreshToken = (user) => new Promise((resolve, reject) =>{
  if (!user) reject('Please provide payload')
  const refreshToken = JWT.sign(user, REFRESH_SECRET)
  refreshTokens.push(refreshToken)
  resolve(refreshToken)
})

// Function to verify refresh Token
const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    if (!token) reject('Please provide payload')
    JWT.verify(token, REFRESH_SECRET, async (err, user) => {
      if (err) reject()
      const accessToken = await generateAccessToken({
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