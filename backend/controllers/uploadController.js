const { PdfReader } = require('pdfreader');
const Post = require('../models/Post');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure the API key is being read from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractTextFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const reader = new PdfReader();
        let text = '';
        reader.parseBuffer(buffer, (err, item) => {
            if (err) reject(err);
            else if (!item) resolve(text);
            else if (item.text) text += item.text + ' ';
        });
    });
};

const uploadPDF = async (req, res) => {
    try {
        const subject = req.body.subject;
        const fileName = req.file ? req.file.originalname : 'unknown_file';

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const extractedText = await extractTextFromBuffer(req.file.buffer);

        // FIX: Target the model that worked in your terminal test
        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

        const prompt = `
            You are an expert educator. Read the following text extracted from a PDF and generate 10 short educational posts about distinct topics from the content.

            Each post must follow this exact format:
            TITLE: <topic title>
            BODY: <2-3 sentence explanation of the topic, simple and easy to understand>
            ---

            Text:
            ${extractedText.slice(0, 15000)}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Improved splitting logic to avoid empty items
        const rawPosts = responseText.split('---').map(p => p.trim()).filter(p => p.length > 10);

        const posts = rawPosts.map(raw => {
            const titleMatch = raw.match(/TITLE:\s*(.+)/i);
            const bodyMatch = raw.match(/BODY:\s*([\s\S]+)/i);

            return {
                title: titleMatch ? titleMatch[1].trim() : 'Untitled',
                body: bodyMatch ? bodyMatch[1].trim() : 'No content',
                subject: subject || 'General',
                source: fileName
            };
        });

        if (posts.length > 0) {
            await Post.insertMany(posts);
        }

        res.status(200).json({
            message: 'Posts generated successfully',
            count: posts.length,
            posts
        });

    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({
            message: 'Something went wrong',
            error: err.message,
            tip: "Check if your GEMINI_API_KEY is correctly set in your .env file."
        });
    }
};

module.exports = { uploadPDF };