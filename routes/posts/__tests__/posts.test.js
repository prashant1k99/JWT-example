const request = require('supertest')
const express = require('express')
const postRoutes = require('../index')
const authRoutes = require('../../auth')
const app = express()

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)

describe('Auth Route Testing : /posts', () => {
  describe('GET /token', () => {
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
        .get('/posts')
        .set('Content-Type', 'application/json')
      expect(res.statusCode).toEqual(401)
      expect(res.text).toEqual('No Auth header')
    })

    it('With Auth Token', async () => {
      const res = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
      expect(res.statusCode).toEqual(200)
      expect(Array.isArray(res.body)).toBeTruthy()
      expect(res.body[0].id).toBeTruthy()
      expect(res.body[0].user).toBeTruthy()
      expect(res.body[0].title).toBeTruthy()
    })
  })

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
        .post('/posts')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ title: "Some of my funny stories." })
      expect(res.statusCode).toEqual(401)
      expect(res.text).toEqual('No Auth header')
    })

    it('With Auth Token, Without Id', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
      expect(res.statusCode).toEqual(422)
      expect(res.text).toEqual('Title missing.')
    })

    it('With Auth Token', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ title: "Some of my funny stories." })
      expect(res.statusCode).toEqual(200)
      expect(res.text).toEqual('Success')
    })
  })

  describe('DELETE /token', () => {
    let tokenData, postNo
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
        .delete('/posts')
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ id: 4 })
      expect(res.statusCode).toEqual(401)
      expect(res.text).toEqual('No Auth header')
    })

    it('With Auth Token, Without Id', async () => {
      const res = await request(app)
        .delete('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
      expect(res.statusCode).toEqual(422)
      expect(res.text).toEqual('Post id missing.')
    })

    it('Get Posts before delete', async () => {
      const res = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
      postNo = res.body.length
    })

    it('With Auth Token, With Id', async () => {
      const res = await request(app)
        .delete('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
        .set('Content-Type', 'application/json')
        .set('Accept', /json/)
        .send({ id: 4 })
      expect(res.statusCode).toEqual(201)
      expect(res.text).toEqual('Success')
    })
    
    it('Post Success Delete, Posts count', async () => {
      const res = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${tokenData.body.accessToken}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body.length).toEqual(postNo - 1)
    })
  })
})