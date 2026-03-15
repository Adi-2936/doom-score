const { PdfReader } = require('pdfreader');
const Post = require('../models/Post');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

const generatePostsFromPDF = async (buffer, subject, fileName, userId) => {
    const extractedText = await extractTextFromBuffer(buffer);

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

    const rawPosts = responseText.split('---').filter(p => p.trim().length > 10);

    return rawPosts.map(raw => {
        const titleMatch = raw.match(/TITLE:\s*(.+)/i);
        const bodyMatch = raw.match(/BODY:\s*([\s\S]+)/i);

        return {
            title: titleMatch ? titleMatch[1].trim() : 'Untitled Topic',
            body: bodyMatch ? bodyMatch[1].trim() : 'Content could not be parsed.',
            subject: subject,
            source: fileName,
            userId: userId
        };
    });
};

const uploadPDF = async (req, res) => {
    try {
        const files = req.files;
        const subjects = req.body.subjects;
        const userId = req.userId

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const subjectsArray = Array.isArray(subjects) ? subjects : [subjects];
        let allPosts = [];

        console.log(`🚀 Processing ${files.length} file(s)...`);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const subject = subjectsArray[i] || subjectsArray[0] || 'General';

            console.log(`📄 Analyzing: ${file.originalname}`);

            const posts = await generatePostsFromPDF(file.buffer, subject, file.originalname, userId);
            allPosts = [...allPosts, ...posts];

            if (files.length > 1 && i < files.length - 1) {
                console.log("Waiting to avoid rate limit...");
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        if (allPosts.length > 0) {
            await Post.insertMany(allPosts);
        }

        res.status(200).json({
            message: 'Successfully generated and saved posts',
            count: allPosts.length,
            posts: allPosts
        });

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({
            message: 'Failed to process PDF',
            error: err.message
        });
    }
};

module.exports = { uploadPDF };