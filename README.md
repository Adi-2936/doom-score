# DoomScore

> Turn your study PDFs into an addictive scrollable knowledge feed — powered by AI.

**Live → [doom-score.vercel.app](https://doom-score.vercel.app)**

---

## What is it?

DoomScore takes your course PDFs and converts them into a TikTok-style scrollable feed of bite-sized educational posts using Gemini AI. Instead of reading through 50 pages of notes, you scroll through clean, focused topic cards — one concept at a time.

You can ask **DoomBot** (an AI chatbot) to explain any topic in depth, organise your content by subject in the **Library**, and track your reading progress in **Stats**.

---

## Features

- Upload multiple PDFs, each tagged with a subject
- AI generates 10 educational posts per PDF
- Smart interleaving — posts from different subjects are mixed in the feed
- Focused study mode — filter the feed to a single chapter
- DoomBot chatbot — ask questions about any post
- Library with subject/chapter filtering and search
- Progress tracking and bookmarks
- JWT authentication — each user sees only their own posts
- Responsive design (sidebar on desktop, bottom nav on mobile)

---

## Tech Stack

**Frontend** — React, Vite, React Router, Axios — deployed on Vercel

**Backend** — Node.js, Express, MongoDB Atlas, Mongoose — deployed on Render

**AI & Auth** — Google Gemini API, pdfreader, bcryptjs, JWT

---

## How it works

```
PDF upload → text extracted by pdfreader → sent to Gemini AI
→ 10 posts generated → saved to MongoDB → served as a scrollable feed
```

---

## Running Locally

```bash
# Backend
cd backend
npm install
# Add .env with MONGO_URI, GEMINI_API_KEY, JWT_SECRET
npm run dev

# Frontend
cd frontend
npm install
# Add .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

Built by **Adithya Singh** ·
