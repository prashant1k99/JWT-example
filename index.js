require('dotenv').config()
const express = require('express')

const routes = require('./routes')

const app = express(),
  authRoute = routes.authRouter,
  postRoute = routes.postRouter

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/auth', authRoute)
app.use('/posts', postRoute)

app.use('*', (_, res) => {
  res.status(200).send('😁 Hi there, this is test server for JWT Authentication.')
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on: https://localhost:${PORT}`)
})