const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const chat = async (req, res) => {
    try {
        const { question, context } = req.body

        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

        const prompt = `
      You are DoomBot, a helpful AI tutor inside an app called DoomScore.
      A student is reading a post about the following topic:

      ${context}

      The student asks: "${question}"

      Answer in 3-4 sentences maximum. Be clear, simple and direct.
      Do not repeat the topic back to them. Just answer the question.
    `

        const result = await model.generateContent(prompt)
        const answer = result.response.text()

        res.status(200).json({ answer })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong', error: err.message })
    }
}

module.exports = { chat }