const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config({ path: '.env' })

const uploadRoute = require('./routes/uploadRoute')
const chatRoute = require('./routes/chatRoute')
const postsRoute = require('./routes/postsRoute')
const authRoute = require('./routes/authRoute')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api', uploadRoute)
app.use('/api', chatRoute)
app.use('/api', postsRoute)

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