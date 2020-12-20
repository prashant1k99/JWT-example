require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const app = express()

app.use(express.json())

const PORT = process.env.PORT || 3000,
  ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET,
  REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET
const users = new Map(),
  posts = [
    {
      user: "prashant1k99",
      title: "Some interesting post 1."
    },
    {
      user: "prashant1k9",
      title: "Some interesting post 2."
    },
    {
      user: "prashant1k99",
      title: "Some interesting post 3."
    }
  ],
  refreshTokens = []

// Function to generate access token
function generateAccessToken(user) {
  return JWT.sign(user, ACCESS_SECRET, { expiresIn: '60m'})
}

// Function to generate refresh token
function generateRefreshToken(user) {
  const refreshToken = JWT.sign(user, REFRESH_SECRET)
  refreshTokens.push(refreshToken)
  return refreshToken
}

// Middleware to authenticate token
function validateAuthToken(req, res, next) {
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

app.get('/users', (req, res) => {
  const userData = []
  users.forEach((value, key) => {
    userData.push({
      username: key,
      name: value.name
    })
  })
  res.status(200).send(userData)
})

app.get('/posts', validateAuthToken, (req, res) => {
  res.status(200).json(posts.filter(post => post.user === req.user.username))
})

app.post('/signup', async (req, res) => {
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
    res.status(500).send()
  }  
})

// For generating accesstoken from refresh token
app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  JWT.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({
      username: user.username,
      name: user.name
    })
    res.status(200).json({
      accessToken: accessToken
    })
  })
})

app.post('/login', async (req, res) => {
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
app.delete('/logout', validateAuthToken, (req, res) => {
  refreshTokens.filter(token => token !== req.body.token)
  res.status(204).send('Success')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on: https://localhost:${PORT}`)
})