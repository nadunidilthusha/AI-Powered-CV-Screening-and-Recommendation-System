# AI-Powered CV Screening and Recommendation System

A web-based recruitment platform that automates CV screening for HR professionals. Recruiters create job postings, upload candidate CVs (PDF), and a multi-agent AI pipeline extracts candidate information, compares it against the job description, and produces a ranked list with a match percentage, missing-skills analysis, and a hiring recommendation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Default Admin Credentials](#default-admin-credentials)
- [User Roles](#user-roles)
- [API Overview](#api-overview)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Authentication** – register, login, logout, forgot password, JWT-based sessions with "Remember workstation" support
- **Job Management** – create, view, edit, delete job postings with Draft / Active / Closed status, filters and search
- **CV Upload** – drag-and-drop PDF upload (max 5 MB per file, bulk upload supported)
- **AI Screening Pipeline** – three cooperating agents:
  1. **Information Extractor** – PDF text extraction, name, contact info, education, experience, technical skills → structured JSON
  2. **HR Evaluator** – compares CV with the job description, finds matching/missing skills, evaluates experience, calculates match percentage
  3. **Decision Maker** – produces *Highly Recommended / Recommended / Not Recommended* with a written justification
- **Candidates & Reports** – ranked candidate list, candidate details, export to CSV / PDF
- **Dashboard** – job and candidate statistics, processing status
- **Account Settings** – profile information and profile photo
- **Admin Console** – user management, API configuration, system status, database status

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Lucide icons, jsPDF |
| Backend | Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Multer, BullMQ |
| AI Microservice | Python, FastAPI, pdfplumber / PyPDF2, OpenAI or Google Gemini |

---

## Project Structure

```
AI-Powered-CV-Screening-and-Recommendation-System/
├── Frontend/          # React + Vite web application
│   └── src/
│       ├── components/    # common UI, layouts, modals
│       ├── features/      # admin, auth, candidates, cv-upload, dashboard, jobs, reports
│       ├── pages/         # route-level pages
│       ├── services/      # API calls (axios)
│       ├── context/       # AuthContext
│       └── routes/        # route definitions and guards
├── Backend/           # Node.js + Express REST API
│   └── src/
│       ├── config/        # env + database connection
│       ├── controllers/   # request handlers
│       ├── middleware/    # auth, roles, validation, uploads, error handling
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API routes
│       ├── services/      # AI service client
│       ├── utils/         # helpers
│       └── validators/    # express-validator rules
├── AI-Service/        # Python + FastAPI AI microservice
│   └── app/
│       ├── agents/        # the three AI agents
│       ├── api/           # /screen and /health endpoints
│       ├── pipeline/      # agent orchestrator
│       └── schemas/       # request/response models
├── .gitignore
└── README.md
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, **or** a MongoDB Atlas cluster
- [Python](https://www.python.org/) 3.10 or later (for the AI service)
- An OpenAI or Google Gemini API key (for the AI service)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Powered-CV-Screening-and-Recommendation-System
```

### 2. Backend

```bash
cd Backend
npm install
cp .env.example .env      # Windows PowerShell: copy .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET
npm run dev
```

The API runs on **http://localhost:5000**. Verify it with:

```
GET http://localhost:5000/api/health
```

### 3. Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=TalentLens
VITE_ENVIRONMENT=development
```

Then start it:

```bash
npm run dev
```

The app runs on **http://localhost:5173**.

### 4. AI Service

```bash
cd AI-Service
python -m venv venv
venv\Scripts\activate            # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # Windows PowerShell: copy .env.example .env
# edit .env: set AI_SERVICE_API_KEY and your OpenAI/Gemini key
uvicorn app.main:app --reload --port 8000
```

The AI service runs on **http://localhost:8000** (interactive docs at `/docs`).

> Start order: MongoDB → Backend → AI Service → Frontend.

---

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/cv-screening` |
| `JWT_SECRET` | Secret used to sign JWTs (use a long random string) |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `1d` |
| `CLIENT_URL` | Frontend origin for CORS (default `http://localhost:5173`) |
| `AI_SERVICE_BASE_URL` | AI microservice URL (default `http://localhost:8000`) |
| `AI_SERVICE_API_KEY` | Shared secret with the AI service (must match its `.env`) |
| `MAX_FILE_SIZE_MB` | Max CV upload size (default `5`) |

### Frontend (`Frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_APP_NAME` | Application name |
| `VITE_ENVIRONMENT` | `development` or `production` |

### AI Service (`AI-Service/.env`)

| Variable | Description |
|---|---|
| `AI_SERVICE_API_KEY` | Shared secret sent by the backend as `X-API-Key` |
| `LLM_PROVIDER` | `openai` or `gemini` |
| `OPENAI_API_KEY` / `GEMINI_API_KEY` | Provider API key |

> Never commit `.env` files. They are already listed in `.gitignore`.

---

## Default Admin Credentials

Use these to sign in during development and testing:

| Field | Value |
|---|---|
| **Email** | `test@example.com` |
| **Password** | `Test1234` |

> ⚠️ These are **demo credentials for local development only**. Change or remove this account before deploying to any shared or production environment.

---

## User Roles

| Role | Access |
|---|---|
| **HR Manager** | Dashboard, job postings, CV upload, candidates, reports, account settings |
| **Admin** | Everything an HR Manager can access, plus user management, API configuration, system status and database status |

---

## API Overview

Base URL: `http://localhost:5000/api`

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/logout`, `GET /auth/me` |
| Jobs | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id` |
| CV Upload | `POST /jobs/:jobId/cvs`, `GET /jobs/:jobId/cvs/status` |
| Candidates | `GET /jobs/:jobId/candidates`, `GET /candidates/:id`, `GET /candidates/:id/recommendation` |
| Reports | `GET /jobs/:jobId/ranking`, `GET /jobs/:jobId/export/csv`, `GET /jobs/:jobId/export/pdf` |
| Admin | `GET /admin/users`, `PUT /admin/api-config`, `GET /admin/system-status`, `GET /admin/database-status` |

All routes except `/auth/register`, `/auth/login`, `/auth/forgot-password` and `/health` require an `Authorization: Bearer <token>` header.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection failed` | Confirm MongoDB is running and `MONGO_URI` in `Backend/.env` is correct |
| `querySrv ECONNREFUSED` (Atlas) | Your network is blocking Atlas DNS lookups — try a different network, or use a local MongoDB |
| `401 jwt expired` | Log out and log in again to get a fresh token |
| Frontend shows no data | Check `VITE_API_BASE_URL` and that the backend is running; restart `npm run dev` after editing `.env` |
| `Failed to resolve import "<package>"` | Run `npm install <package>` in the `Frontend` folder |
| Login always fails | Make sure the account exists in your database (register it, or insert it and set its role) |

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit using the `feat:` / `fix:` convention
3. Open a pull request into `main`
