const request = require('supertest')
const express = require('express')
const authRoute = require('../index')

const app = express()

app.use(express.json())
app.use('/auth', authRoute)

describe('Auth Route Testing : /User', () => {
  it('GET /users', async () => {
    const res = await request(app)
      .get('/auth/users')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
  })
})