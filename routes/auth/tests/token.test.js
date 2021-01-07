const request = require('supertest')
const express = require('express')
const authRoute = require('../index')

const app = express()

app.use(express.json())
app.use('/auth', authRoute)

describe('Auth Route Testing : /token', () => {
  describe('POST /token', () => {
    let tokenData 
    it('Initialize', async () => {
      await request(app)
        .post('/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ name: "Prashant Singh", username: "prashant1k99", password: "test" })

      tokenData = await request(app)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ username: "prashant1k99", password: "test" })
    })

    it('Without Body', async () => {
      const res = await request(app)
        .post('/auth/token')
        .send()
      expect(res.statusCode).toEqual(401)
    })

    it('With Wrong Token', async () => {
      const res = await request(app)
        .post('/auth/token')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ token: "test1" })
      expect(res.statusCode).toEqual(403)
    })

    it('With Correct Token', async () => {
      const res = await request(app)
        .post('/auth/token')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ token: tokenData.body.refreshToken })
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeTruthy()
      expect(res.body.accessToken).toBeTruthy()
    })
  })
})