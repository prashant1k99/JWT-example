const request = require('supertest')
const express = require('express')
const authRoute = require('../index')

const app = express()

app.use(express.json())
app.use('/auth', authRoute)

describe('Auth Route Testing : /login', () => {
  describe('POST /login', () => {
    it('PreTest Init', async () => {
      await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ name: "Prashant Singh", username: "prashant1k99", password: "test" })
    })
    
    it('Without Body', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send()
      expect(res.statusCode).toEqual(400)
      expect(res.text).toBe('Payload is not provided.')
    })

    it('Without username Data', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ password: "test1" })
      expect(res.statusCode).toEqual(400)
      expect(res.text).toBe('Payload is not provided.')
    })

    it('Without password Data', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ username: "prashant1k99" })
      expect(res.statusCode).toEqual(400)
      expect(res.text).toBe('Payload is not provided.')
    })

    it('With Wrong username', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ username: "prashant1k999", password: "test" })
      expect(res.statusCode).toEqual(422)
      expect(res.text).toBe('User with the username does not exists.')
    })

    it('With Wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ username: "prashant1k99", password: "test1" })
      expect(res.statusCode).toEqual(422)
      expect(res.text).toBe('Invalid password')
    })

    it('With Correct Body Data', async () => {
      const res = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ username: "prashant1k99", password: "test" })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeTruthy()
      expect(res.body.accessToken).toBeTruthy()
      expect(res.body.refreshToken).toBeTruthy()
    })
  })
})