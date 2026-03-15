const Post = require('../models/Post')

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })

        const grouped = {}
        posts.forEach(post => {
            if (!grouped[post.subject]) grouped[post.subject] = []
            grouped[post.subject].push(post)
        })

        const subjects = Object.keys(grouped)
        const interleaved = []
        let hasMore = true

        while (hasMore) {
            hasMore = false
            subjects.forEach(subject => {
                if (grouped[subject].length > 0) {
                    interleaved.push(grouped[subject].shift())
                    hasMore = true
                }
            })
        }

        res.status(200).json({ posts: interleaved })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong', error: err.message })
    }
}

const clearPosts = async (req, res) => {
    try {
        await Post.deleteMany({})
        res.status(200).json({ message: 'All posts cleared' })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message })
    }
}

module.exports = { getPosts, clearPosts }