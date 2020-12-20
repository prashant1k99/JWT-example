const JWTMethods = require('./jwt')

module.exports = {
  generateAccessToken: JWTMethods.generateAccessToken,
  generateRefreshToken: JWTMethods.generateRefreshToken,
  verifyRefreshToken: JWTMethods.verifyRefreshToken
}