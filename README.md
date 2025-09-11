# SyncChat – AI Chatbots for Websites 🤖💬

Paste a website URL → SyncChat crawls the content → Embed a context-aware AI chatbot.

---

## Live Demo 🚀

## Overview 🌐

SyncChat enables anyone to add an intelligent chatbot to their website with zero setup. Our chatbots understand multi-turn conversations, maintain context, and continuously improve from user feedback.

This project demonstrates full-stack engineering skills, including AI/ML integration, scalable architecture, and production-quality frontend & backend.

---

## Problem & Solution ⚡

**Problem ❌:** Embedding AI chatbots typically requires manual knowledge base creation and complex setup. Most solutions don’t handle context or multi-site management efficiently.

**Solution ✅:** SyncChat automatically crawls websites, generates embeddings, and serves chatbots through an embeddable widget. Multi-turn conversation context is preserved using a token-windowed memory system.

---

## Architecture 🏗️

```
User Website
    |
    v
[Chat Widget] ---> [Django REST API] ---> [ChromaDB Vector Store]
                                        \
                                         -> LLM (Google Gemini)
```

---

## RAG (Retrieval-Augmented Generation) System 🧠

SyncChat uses a robust RAG pipeline for context-aware answers:

- **Crawling & Chunking:**  
  Website content is crawled ([backend/rag/crawler.py](backend/rag/crawler.py)) and split into semantic chunks (~400 tokens) using custom heuristics and BeautifulSoup.

- **Embeddings:**  
  Chunks are converted into vector embeddings via [Sentence Transformers](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) ([backend/rag/embeddings.py](backend/rag/embeddings.py)), stored in [ChromaDB](https://www.trychroma.com/).

- **Retrieval:**  
  Relevant chunks are fetched from ChromaDB using multi-query and HyDE strategies ([backend/rag/retrieval.py](backend/rag/retrieval.py)).  
  - Multi-query RAG: Generates diverse reformulations of the user query for improved recall.
  - HyDE fallback: If not enough context is found, a hypothetical answer is generated and used for retrieval.

- **Prompt Construction:**  
  Context from previous turns is concatenated to provide multi-turn conversations. The prompt is dynamically tailored to the chatbot’s tone and goals ([backend/user/views.py](backend/user/views.py)).

- **LLM Response:**  
  The final answer is generated using Google Gemini (via [google.generativeai](https://ai.google.dev/)), with the response returned as JSON for downstream processing.

---

## Scalability Features ⚙️

- Async crawling for large websites.
- Embedding caching to reduce API calls.
- Token-window management for long conversations.
- PostgreSQL-ready architecture for production.

---

## Security Considerations 🔒

- JWT authentication for API access.
- XSS mitigation in embedded widgets.
- Rate-limited API endpoints.
- CORS restrictions configured for allowed domains only.

---

## Features ✨

- **Context-aware AI Chatbot 🤖:** Multi-turn conversations with dynamic memory.
- **Zero Setup 🛠️:** Paste a URL, and the knowledge base builds automatically.
- **Multi-Site Management 🌍:** Manage multiple chatbots in one dashboard.
- **Embeddable Widget 🖼️:** Lightweight JS script, safe to include anywhere.
- **Personalization 🎨:** Tone, language, and goals per chatbot.
- **Analytics 📈:** Track chats/day, user satisfaction, and trending questions.
- **Integrations 🔗:** Export conversations to CSV, Slack, Notion.
- **Feedback Loop 🔁:** Collect user ratings to refine responses.

---

## Screenshots & Examples 🖥️

**Dashboard Analytics:**  
*Add screenshot here*

**Multi-site Management:**  
*Add screenshot here*

**Sample Chat 💬:**

| User | Bot |
|------|-----|
| “What services does this company offer?” | “SyncChat provides AI-powered chatbots, automatic website crawling, and analytics dashboards.” |
| “Can it manage multiple websites?” | “Yes, you can create and manage multiple chatbots from one dashboard.” |

---

## Tech Stack 🛠️

- **Backend:** Python, Django, Django REST Framework, ChromaDB, Google Gemini, PostgreSQL-ready
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Widget:** Vanilla JS, Vite
- **Testing:** Django test framework, Jest + React Testing Library, Cypress for widget

---

## Setup ⚡

### Backend

```sh
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend

```sh
cd frontend
npm install
npm run dev
```

### Widget

```sh
cd chat-widget
npm install
npm run build
```

### Embed in a website

```html
<script src="chat-widget.js" data-embed-code="YOUR_EMBED_CODE"></script>
```

---

## Testing & Performance 🧪

- **Unit Tests ✅:** Validate RAG logic and embeddings retrieval.
- **Integration Tests 🔗:** Ensure API endpoints respond correctly.
- **Widget Tests 🖥️:** Cross-browser rendering, XSS protection, and performance (load < 200ms).
- **Coverage 📊:** 85%+ backend & frontend coverage.

---

## Roadmap / Unique Features 🚀

- Incremental Website Updates 🔄: Auto-refresh embeddings when content changes.
- Semantic Search Optimizations 🧠: Reduce irrelevant matches using context weighting.
- Advanced Analytics 📊: Heatmaps for most asked questions and response accuracy.
- Multi-language Support 🌐: Automatic translation and embeddings for global websites.
- Offline Widget Mode 🌙: Partial caching for low-connectivity environments.

---

## License 📄

Apache 2.0 — see LICENSE
