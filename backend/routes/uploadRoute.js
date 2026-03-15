const express = require('express')
const multer = require('multer')
const { uploadPDF } = require('../controllers/uploadController')

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/upload', upload.array('pdfs', 10), uploadPDF)

module.exports = router