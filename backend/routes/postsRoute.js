const express = require('express')
const { getPosts, clearPosts } = require('../controllers/postsController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/posts', protect, getPosts)
router.delete('/posts', protect, clearPosts)

module.exports = router