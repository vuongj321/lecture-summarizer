# LectureAI 📚

A full stack AI-powered study assistant that lets students upload lecture PDFs and interact with them through an intelligent chat interface — powered by Amazon Nova 2 Lite on AWS Bedrock.

## Demo
[![LectureAI Demo](https://img.youtube.com/vi/lLdwMXBBvaM/0.jpg)](https://www.youtube.com/watch?v=lLdwMXBBvaM)

## Features

- 📄 **PDF Upload** — upload any lecture material or document
- 💬 **Ask Questions** — ask anything about your lecture and get accurate, contextual answers
- ✨ **Summarize** — generate a structured summary in bullet points
- 🖥️ **Split Panel UI** — read your PDF and chat side by side
- 📝 **Markdown Rendering** — responses are formatted with headers, bullet points, and bold text

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Axios
- React Markdown

**Backend**
- FastAPI
- AWS Bedrock (Amazon Nova 2 Lite)
- Boto3
- Python Dotenv

**Infrastructure**
- Docker + Docker Compose
- AWS App Runner (backend)
- Vercel (frontend)

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 22+
- Docker Desktop
- AWS account with Bedrock access

### 1. Clone the repository

```bash
git clone https://github.com/vuongj321/lecture-summarizer.git
cd lecture-summarizer
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
APP_API_KEY=your_api_key
```

Start the backend:

```bash
uvicorn main:app --reload
```

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.development` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173` — your app is running.

### 4. Run with Docker

From the project root:

```bash
docker compose up --build
```

Both services will start together. Visit `http://localhost:5173`.

## Project Structure

```
lecture-summarizer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload a PDF file |
| POST | `/ask` | Ask a question about the uploaded PDF |
| POST | `/summarize` | Generate a summary of the uploaded PDF |

All endpoints require an `X-API-Key` header.

## Deployment

- **Frontend** — deployed on [Vercel](https://vercel.com)
- **Backend** — deployed on [AWS App Runner](https://aws.amazon.com/apprunner/)

## Built For

This project was built for the **AWS Amazon Nova Hackathon** under the Multimodal Understanding category.
