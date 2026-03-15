const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const uploadRoute = require('./routes/uploadRoute')
console.log('GEMINI KEY:', process.env.GEMINI_API_KEY)
const app = express()
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})
app.use(cors())
app.use(express.json())
app.use('/api', uploadRoute)
console.log(uploadRoute.stack)
console.log('Routes loaded')
app.get('/test', (req, res) => res.send('server works'))
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log('Connection failed:', err)
    })