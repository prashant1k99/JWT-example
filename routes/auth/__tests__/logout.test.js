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
    it('Without Auth Token in Header', async () => {
      const res = await request(app)
        .delete('/auth/logout')
        .set('Content-Type', 'application/json')
        .send({ token: tokenData.body.refreshToken })
      expect(res.statusCode).toEqual(401)
      expect(res.text).toEqual('No Auth header')
    })

    it('With Auth Token without refresh token', async () => {
      const res = await request(app)
        .delete('/auth/logout')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send()
      expect(res.statusCode).toEqual(400)
      expect(res.text).toEqual('Payload is not provided.')
    })

    it('With Auth Token with incorrect refresh token', async () => {
      const res = await request(app)
        .delete('/auth/logout')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ token: "wrong token"})
      expect(res.statusCode).toEqual(400)
      expect(res.text).toEqual('Incorrect Payload')
    })

    it('With Correct Token', async () => {
      const res = await request(app)
        .delete('/auth/logout')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ token: tokenData.body.refreshToken })
      expect(res.statusCode).toEqual(200)
      expect(res.text).toBe('Success')
    })
  })
})