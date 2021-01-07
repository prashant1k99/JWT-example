const request = require('supertest')
const express = require('express')
const authRoute = require('../index')

const app = express()

app.use(express.json())
app.use('/auth', authRoute)

describe('Auth Route Testing : /signup', () => {
  describe('POST /signup', () => {

    it('Without Body', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .send()
      expect(res.statusCode).toEqual(400)
      expect(res.text).toBe('Payload is not provided.')
    })

    it('With Body', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ name: "Prashant Singh", username: "prashant1k9", password: "test" })
      expect(res.statusCode).toEqual(201)
      expect(res.text).toBeTruthy()
    })

    test('With duplicate username', async () => {
      const res = await request(app)
        .post('/auth/signup')
        .set('Accept', /json/)
        .set('Content-Type', 'application/json')
        .send({ name: "Prashant Singh", username: "prashant1k9", password: "test" })
      expect(res.statusCode).toEqual(400)
      expect(res.text).toBe('User with the username already exists.')
    })
  })
})