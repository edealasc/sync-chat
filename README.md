SyncChat

Paste your website URL → SyncChat crawls your content → Embed an intelligent chatbot on your site in minutes.

SyncChat is a full-stack AI chatbot platform built to make websites instantly interactive. It combines a Django backend, a modern Next.js dashboard, and a lightweight embeddable widget.

Unlike typical chatbot templates, SyncChat automatically crawls your website to build its knowledge base — so your bot can start answering questions immediately.

🚀 Demo



✨ Features

AI Chatbot: Context-aware, multi-turn conversations powered by Retrieval-Augmented Generation (RAG).

Zero Setup: Paste your URL → SyncChat crawls your content → Knowledge base ready.

Embeddable Widget: Copy-paste a script tag to add a chatbot to any website.

Admin Dashboard: Manage bots, view conversations, and analyze customer satisfaction.

Business Customization: Configure tone, language, and goals per chatbot.

Feedback Loop: Track user satisfaction to continuously improve.

Secure Authentication: JWT-based user accounts.

🏗️ Architecture

Backend: Django REST API, ChromaDB for embeddings, SQLite for persistence.

Frontend: Next.js (React), TypeScript, Tailwind CSS for UI.

Widget: Vanilla JS, IIFE for safe embedding, Vite bundling.

⚙️ Tech Stack

Backend: Python, Django, DRF, ChromaDB, SQLite

Frontend: Next.js, React, TypeScript, Tailwind, Lucide Icons

Widget: JavaScript (ES6), Vite

📂 Folder Structure
backend/        # Django REST API, business logic, embeddings
frontend/       # Next.js dashboard, user interface
chat-widget/    # Embeddable widget, build scripts
docs/           # Screenshots, GIFs, diagrams for README


Key modules:

rag/ → Retrieval-Augmented Generation logic

user/ → Authentication & user management

components/ → Reusable React UI components

src/ (widget) → Self-contained embeddable script

🛠️ Setup & Installation
Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # configure secrets
python manage.py migrate
python manage.py runserver

Frontend
cd frontend
npm install
npm run dev   # start dev server
npm run build # production build

Chat Widget
cd chat-widget
npm install
npm run build


Embed in your site:

<script src="chat-widget.js" data-api-url="https://your-api.com"></script>

🧪 Testing

Backend: Django test framework → python manage.py test

Frontend: Jest + React Testing Library → add tests in __tests__/

Widget: Browser tests (manual + automated)

🔑 Environment Variables

Backend: DJANGO_SECRET_KEY, DATABASE_URL, …

Frontend: NEXT_PUBLIC_API_URL

Widget: Configurable via script attributes (data-api-url)

🗺️ Future Improvements

Switch SQLite → PostgreSQL for scalability

Add CI/CD pipeline with GitHub Actions

Expand authentication (OAuth, Google login)

Improve analytics dashboard with charts & insights

Accessibility and localization support

📜 License

Apache 2.0 License — see LICENSE
.
