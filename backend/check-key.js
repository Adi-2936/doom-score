require('dotenv').config();
const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.log("❌ ERROR: No API Key found in .env file!");
} else {
    console.log("✅ Key found!");
    console.log("Ends with:", key.substring(key.length - 4));
    console.log("Full length:", key.length);
}