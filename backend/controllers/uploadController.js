const { PdfReader } = require('pdfreader')
const Post = require('../models/Post')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const extractTextFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const reader = new PdfReader()
        let text = ''
        reader.parseBuffer(buffer, (err, item) => {
            if (err) reject(err)
            else if (!item) resolve(text)
            else if (item.text) text += item.text + ' '
        })
    })
}

const uploadPDF = async (req, res) => {
    console.log('API KEY:', process.env.GEMINI_API_KEY)
    try {
        const subject = req.body.subject
        const fileName = req.file.originalname

        const extractedText = await extractTextFromBuffer(req.file.buffer)

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `
      You are an expert educator. Read the following text extracted from a PDF and generate 10 short educational posts about distinct topics from the content.

      Each post must follow this exact format:
      TITLE: <topic title>
      BODY: <2-3 sentence explanation of the topic, simple and easy to understand>
      ---

      Text:
      ${extractedText.slice(0, 10000)}
    `

        const result = await model.generateContent(prompt)
        const responseText = result.response.text()

        const rawPosts = responseText.split('---').filter(p => p.trim() !== '')

        const posts = rawPosts.map(raw => {
            const titleMatch = raw.match(/TITLE:\s*(.+)/)
            const bodyMatch = raw.match(/BODY:\s*([\s\S]+)/)

            return {
                title: titleMatch ? titleMatch[1].trim() : 'Untitled',
                body: bodyMatch ? bodyMatch[1].trim() : 'No content',
                subject: subject,
                source: fileName
            }
        })

        await Post.insertMany(posts)

        res.status(200).json({
            message: 'Posts generated successfully',
            count: posts.length,
            posts
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong', error: err.message })
    }
}

module.exports = { uploadPDF }