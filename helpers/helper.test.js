const atob = require('atob')
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('./index')

describe('Helper Test', () => {
  function parseJwt(token) {
    return (JSON.parse(atob(token.split('.')[1])))
  }
  
  describe('Test Generate Access Token', () => {
    test('Without Payload', async () => {
      await generateAccessToken().catch((err) => {
        expect(err).toBe('Please provide payload')
      })
    })
    test('With Payload', async () => {
      const userInfor = {
        "name": "Prashant Singh",
        "username": "prashant1k9"
      }
      const token = await generateAccessToken(userInfor)
      expect(token).toBeTruthy()
      expect(parseJwt(token)).toBeTruthy()
      expect(parseJwt(token).name).toBe('Prashant Singh')
      expect(parseJwt(token).username).toBe('prashant1k9')
    })
  })
  
  describe('Test Generate Refresh Token', () => {
    test('Without Payload', async () => {
      await generateRefreshToken().catch((err) => {
        expect(err).toBe('Please provide payload')
      })
    })
    test('With Payload', async () => {
      const userInfor = {
        "name": "Prashant Singh",
        "username": "prashant1k9"
      }
      const token = await generateRefreshToken(userInfor)
      expect(token).toBeTruthy()
      expect(parseJwt(token)).toBeTruthy()
      expect(parseJwt(token).name).toBe('Prashant Singh')
      expect(parseJwt(token).username).toBe('prashant1k9')
    })
  })
  
  describe('Test Verify Refresh Token and Generate Access token', () => {
    test('Without Payload', async () => {
      await verifyRefreshToken().catch((err) => {
        expect(err).toBe('Please provide payload')
      })
    })

    test('With Payload', async () => {
      const userInfor = {
        "name": "Prashant Singh",
        "username": "prashant1k9"
      }
      const token = await generateRefreshToken(userInfor)
      const refreshToken = await verifyRefreshToken(token)
      expect(typeof refreshToken).toBe('object')
      expect(parseJwt(refreshToken.accessToken)).toBeTruthy()
      expect(parseJwt(token).name).toBe('Prashant Singh')
      expect(parseJwt(token).username).toBe('prashant1k9')
    })
  })
})