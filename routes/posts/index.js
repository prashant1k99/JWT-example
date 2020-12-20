const express = require('express')

const data = require('../../data')
const middlewares = require('../../middleware')

const router = express.Router(),
  posts = data.posts,
  validateAuthToken = middlewares.validateAuthToken

router.get('/', validateAuthToken, (req, res) => {
  res.status(200).json(posts.filter(post => post.user === req.user.username))
})

router.post('/', validateAuthToken, (req, res) => {
  try {
    if (!req.body.title) res.status(422).send('Title missing.')
    const lastElOfPost = posts[posts.length - 1]
    posts.push({
      id: lastElOfPost.id + 1,
      user: req.user.username,
      title: req.body.title
    })
    res.status(200).send('Success')
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete('/', validateAuthToken, (req, res) => {
  try {
    if (!req.body.id) res.status(422).send('Post id missing.')
    posts.map((post, i) => {
      if (post.user === req.user.username && post.id === req.body.id) {
        posts.splice(i, 1)
        return
      }
    })
    res.status(201).send('Success')
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router