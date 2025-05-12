# Flashcard Generator 🧠⚡

An AI-powered tool that automatically generates study flashcards from your documents (PDF/TXT) using Ollama.

## ✨ Features
- **Smart Document Processing** - Extract key concepts from uploaded files
- **AI-Powered Flashcards** - Generate Q&A pairs suited to your material
- **Interactive Learning** - Flip cards, rate quality, and track progress
- **Responsive Design** - Works on desktop and mobile

## 🛠 Tech Stack

| Component  | Technologies |
|------------|--------------|
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy, Ollama, PDFplumber |
| **Frontend** | React.js 18+, Axios, CSS Modules|
| **Database** | SQLite|

## 🚀 Quick Start

| Step | Command |
|------|---------|
| 1. Clone repo | `git clone https://github.com/meldilen/flashcard-gen.git` |
| 2. Download [ollama](https://ollama.com/download) | `curl -fsSL https://ollama.com/install.sh \| sh` |
| 3. Download and run models | `ollama run llama3.1:8b && ollama run mxbai-embed-large` |
| 4. Backend setup | `cd backend && pip install -r requirements.txt` |
| 5. Frontend setup | `cd frontend && npm install` |
| 6. Run | `npm start` (frontend), `python main.py` (backend) |
