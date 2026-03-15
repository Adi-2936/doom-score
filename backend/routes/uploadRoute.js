const express = require('express')
const multer = require('multer')
const { uploadPDF } = require('../controllers/uploadController')
const { protect } = require('../middleware/auth')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', protect, upload.array('pdfs', 10), uploadPDF)

module.exports = router