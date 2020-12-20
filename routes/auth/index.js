const express = require('express'),
  bcrypt = require('bcrypt')

const data = require('../../data'),
  helpers = require('../../helpers'),
  middlewares = require('../../middleware')

const router = express.Router(),
  users = data.users,
  refreshTokens = data.refreshTokens,
  generateAccessToken = helpers.generateAccessToken,
  generateRefreshToken = helpers.generateRefreshToken,
  verifyRefreshToken = helpers.verifyRefreshToken,
  validateAuthToken = middlewares.validateAuthToken

router.get('/users', (_, res) => {
  try {
    const userData = []
    users.forEach((value, key) => {
      userData.push({
        username: key,
        name: value.name
      })
    })
    res.status(200).send(userData)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/signup', async (req, res) => {
  try {
    if (users.has(req.body.username)) {
      res.status(400).send('User with the username already exists.')
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const info = {
      name: req.body.name,
      pwd: hashedPassword
    }
    users.set(req.body.username, info)
    res.status(201).send(true)
  } catch (err) {
    res.status(500).send(err)
  }  
})

// For generating accesstoken from refresh token
router.post('/token', (req, res) => {
  try {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    verifyRefreshToken(refreshToken).then(data => {
      res.status(200).json(data)
    }).catch(() => {
      res.sendStatus(403)
    })
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/login', async (req, res) => {
  try {
    if (!users.has(req.body.username)) {
      res.status(422).send('User with the username does not exists.')
    }
    // Check the user for the same password
    const info = users.get(req.body.username)
    if (await bcrypt.compare(req.body.password, info.pwd)) {
      const userInfo = {
        username: req.body.username,
        name: info.name
      }
      // To generate JWT Access Token
      const accessToken = generateAccessToken(userInfo)
      const refreshToken = generateRefreshToken(userInfo)
      res.status(200).json({
        accessToken: accessToken,
        refreshToken: refreshToken
      })
    } else {
      res.status(422).send('Invalid password')
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

// Remove the refresh token from the storage
router.delete('/logout', validateAuthToken, (req, res) => {
  try {
    refreshTokens.filter(token => token !== req.body.token)
    res.status(204).send('Success')
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router