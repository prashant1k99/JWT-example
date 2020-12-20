const express = require('express')

const data = require('../../data')
const middlewares = require('../../middleware')

const router = express.Router(),
  posts = data.posts,
  validateAuthToken = middlewares.validateAuthToken

router.get('/', validateAuthToken, (req, res) => {
  res.status(200).json(posts.filter(post => post.user === req.user.username))
})

module.exports = router