const express = require('express')
const { getPosts, clearPosts } = require('../controllers/postsController')

const router = express.Router()

router.get('/posts', getPosts)
router.delete('/posts', clearPosts)

module.exports = router
