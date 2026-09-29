# AI Microservice — Setup & Testing Guide

**For:** QA team, developers, and anyone testing the CV screening pipeline
**Last updated:** September 2026
**Owner:** Rashaan (AI pipeline)

---

## 1. What is this service?

This is a small **Python service** that does the AI work for our CV Screening system.

When a CV is uploaded through our app, the Node backend sends it to this service.
This service then:

1. **Reads the PDF** and extracts text from it.
2. **Extracts candidate details** (name, email, education, skills) using Google Gemini AI.
3. **Compares the CV against the job description** — finds matching skills, missing skills, and calculates a match percentage.
4. **Produces a recommendation** — Highly Recommended, Recommended, or Not Recommended.

The result is sent back to Node, which saves it to MongoDB. The frontend then displays it.

**You do not need to understand the Python code to test this service.**
This guide shows you everything you need.

---

## 2. Where does it live?
```text
AI-Microservice/
├── app/
│ ├── main.py ← The app entry point
│ ├── config.py ← Reads settings from .env
│ ├── agents/ ← The three AI agents
│ │ ├── information_extractor.py
│ │ ├── hr_evaluator.py
│ │ ├── decision_maker.py
│ │ └── base.py ← Shared Gemini client code
│ ├── pipeline/
│ │ └── orchestrator.py ← Runs the three agents in sequence
│ └── api/
│ └── screening.py ← The HTTP endpoint Node calls
├── .env ← API keys (NOT in git — see Section 5)
├── requirements.txt ← Python packages this service needs
└── README.md ← You are here
```

**The file you'll interact with the most:** `.env` — but only to add your key. Everything else is code that runs automatically.

---

## 3. Prerequisites (install these first)

You need **two things** installed on your computer:

| Tool | Why | Check if installed |
|---|---|---|
| **Python 3.11 or newer** | Runs this service | `python --version` |
| **pip** (comes with Python) | Installs Python packages | `pip --version` |

**To install Python:**
1. Go to https://www.python.org/downloads/
2. Download the latest 3.12 installer
3. **IMPORTANT:** during install, check the box that says **"Add Python to PATH"**
4. Click Install

**Verify installation** — open PowerShell and run:
```powershell
python --version
```
You should see something like Python 3.12.0.

---

## 4. First-time setup (do this once)
Open PowerShell and navigate to this folder:

```powershell
cd "C:\Users\krawe\Downloads\Project 2 CV\AI-Powered-CV-Screening-and-Recommendation-System\AI-Microservice"
```

### Step 4.1 — Create a virtual environment (isolated Python)
```powershell
python -m venv venv
```
This creates a `venv` folder. It's a self-contained Python installation just for this project — so we don't mess up your system Python.

### Step 4.2 — Activate it
```powershell
.\venv\Scripts\Activate.ps1
```
Your prompt should now show `(venv)` at the start:

```text
(venv) PS C:\Users\krawe\...\AI-Microservice>
```
⚠️ If PowerShell blocks the activation with an error about "execution policy", run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Press `Y` when prompted, then try activating again.

### Step 4.3 — Install the Python packages
```powershell
pip install -r requirements.txt
```
This installs everything: FastAPI, Gemini SDK, pdfplumber, pymongo, etc. Takes ~1 minute.

### Step 4.4 — Create your .env file
Create a file called `.env` in this folder (right next to `requirements.txt`).

Paste this content:

```dotenv
# ─── Internal auth (shared with Node backend) ───────────────────
# This is a random secret. Node sends it as the `x-api-key` header,
# and this service checks it. Get the value from Rashaan or your
# Backend/.env file. It MUST match what the Node side uses.
AI_SERVICE_API_KEY=<paste-the-random-hex-here>

# ─── Fallback Gemini API key ─────────────────────────────────────
# Only used if MongoDB doesn't have a saved key yet.
# See Section 5 for how to get one.
GEMINI_API_KEY=<paste-a-gemini-key-here>

# ─── MongoDB connection string ──────────────────────────────────
# Same database the Node backend uses.
MONGO_URI=mongodb+srv://team_backend:Hh2XLBhziO8ToN8O@cluster0.gnawes8.mongodb.net/cv-screening?retryWrites=true&w=majority&appName=Cluster0
```
⚠️ No spaces around `=`. No quotes. Just like the example above.

---

## 5. About the API keys (important!)
There are two different keys, and they do different things. This confuses everyone at first.

### Key 1 — AI_SERVICE_API_KEY
*   **What it is:** A random string that our team generated. It's like a password between the Node backend and this AI service.
*   **Why it exists:** So that only our own Node backend can call this service. Random strangers on the internet can't.
*   **Where to get it:** Ask Rashaan, or open `Backend/.env` and copy the value of `AI_SERVICE_API_KEY`.
*   **Do you ever change it?** No. It stays the same forever.

### Key 2 — GEMINI_API_KEY
*   **What it is:** A key from Google. This service uses it to call Google's Gemini AI models.
*   **Why it exists:** Google needs to know who is making AI requests (for billing and rate limits).
*   **Where to get it:** Free at https://aistudio.google.com/apikey
    *   Sign in with a Google account
    *   Click "Create API key"
    *   Copy the key (starts with `AIza...`)
*   **Do you ever change it?** Yes — whenever the current one expires or hits its quota. An admin can update it through the admin web UI without touching any files.

### How the two keys work together
1. The Node backend sends `AI_SERVICE_API_KEY` to this service with every request.
2. This service checks that the key matches — if it doesn't, it returns 401.
3. If it matches, the service then uses the `GEMINI_API_KEY` to talk to Google.

**Testing this:** 
*   If you see a `401 error`, the `AI_SERVICE_API_KEY` values don't match between `Backend/.env` and `AI-Microservice/.env`.
*   If you see a `400 INVALID_ARGUMENT` or API key not valid, the Gemini key is wrong.

---

## 6. How to start the service
You need two PowerShell windows open at the same time:

### Window 1 — Node backend (the "front door")
```powershell
cd "C:\Users\krawe\Downloads\Project 2 CV\AI-Powered-CV-Screening-and-Recommendation-System\Backend"
npm run dev
```
Wait for:
```text
MongoDB connected: ac-qlgp4en-shard-00-...
Server running in development mode on port 5000
```

### Window 2 — Python AI service (the "AI engine")
```powershell
cd "C:\Users\krawe\Downloads\Project 2 CV\AI-Powered-CV-Screening-and-Recommendation-System\AI-Microservice"
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app
```
Wait for:
```text
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Confirm both are running
Open a third PowerShell window and run:
```powershell
netstat -ano | findstr "5000 8000"
```
You should see LISTENING for both 5000 and 8000. If one is missing, that service didn't start — check its window for errors.

---

## 7. How to test it (three ways)

### Test A — Simple health check (no AI, no key)
In any PowerShell:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/"
```
**Expected:** a simple JSON response confirming the service is up.

### Test B — Through the Node backend (the real-world test)
This is what the frontend actually does. Save a test PDF somewhere — any PDF will do.

```powershell
curl.exe -X POST "http://localhost:5000/api/ai/extract" `
  -H "x-dev-user: 1" `
  -F "jobId=6ab51b6693b5ff9ce7b6f313" `
  -F "cv=@C:\path\to\your\cv.pdf"
```
*Replace `C:\path\to\your\cv.pdf` with the real path to your PDF.*

**Expected success:** a JSON response with:
*   `"success": true`
*   `"candidate": { "full_name": "...", ...}`
*   `"evaluation": { "match_percentage": 0-100, ...}`
*   `"decision": { "recommendation": "...", "justification": "..." }`

*Response time: 15–60 seconds (the AI is genuinely thinking — be patient).*

### Test C — Through the frontend (UI test)
1. Open the frontend in a browser: `http://localhost:5173`
2. Log in
3. Go to **Candidates** in the sidebar
4. You should see a list of candidates with AI match percentages
5. If you don't see the list, or the percentages are all "0" or "Loading", come back to Test B and confirm the API works first.

---

## 8. How to know if it's working

| Signal | Meaning |
|---|---|
| 200 OK with JSON | ✅ It worked |
| 401 Unauthorized | ❌ API key mismatch between Node and Python |
| 400 API key not valid | ❌ The Gemini key is wrong or expired |
| 429 RESOURCE_EXHAUSTED | ❌ Free-tier Gemini quota hit — wait or ask for a paid key |
| 503 UNAVAILABLE | ❌ Google's servers are overloaded — retry in a few minutes |
| Takes more than 3 minutes | ❌ Something is stuck — check the Python window for a traceback |

**Where to see errors in detail:**
Always check the Python window first. It prints a full error traceback every time something goes wrong. The generic error you see in the browser or Postman ("AI service error") is just a wrapper — the real message is in the Python window.

---

## 9. Common problems & fixes

**"Activate.ps1 cannot be loaded because running scripts is disabled"**
Run this once:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Then activate again.

**"ModuleNotFoundError: No module named 'xyz'"**
You forgot to activate the venv, or you haven't installed the requirements:
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**"Port 8000 is already in use"**
An old Python service is still running. Kill it:
```powershell
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
```
Then start the service again.

**"API key not valid. Please pass a valid API key."**
The Gemini key is dead or wrong. This usually happens after:
*   Google revoked the key (leaked or abused)
*   Someone typed the key incorrectly

*Fix:* Get a fresh key from https://aistudio.google.com/apikey
Then either:
*   An admin saves it via `/admin/api-config` (preferred, no restart needed), OR
*   You paste it into `GEMINI_API_KEY` in `.env` and restart the Python service

**"All Gemini models failed"**
Google is having an outage, or your key is out of quota. Wait a few minutes and retry once. If it keeps failing, ask an admin to check the Gemini key.

---

## 10. What each file does (quick reference)

| File | What it does |
|---|---|
| `app/main.py` | Boots the FastAPI app — the "start" button of this service |
| `app/config.py` | Reads the `.env` file so the app knows your keys and settings |
| `app/agents/information_extractor.py` | Agent 1 — reads the PDF, extracts candidate data |
| `app/agents/hr_evaluator.py` | Agent 2 — compares CV to job, calculates match % |
| `app/agents/decision_maker.py` | Agent 3 — turns the score into a recommendation |
| `app/agents/base.py` | Shared code — Gemini calls, retries, key management |
| `app/pipeline/orchestrator.py` | Runs all three agents in order |
| `app/api/screening.py` | The HTTP endpoint (`/screen`) that Node calls |

---

## 11. Known limitations
*   **Free-tier Gemini quota is limited.** Each day you get a small number of requests. If you hit the limit, results may be delayed until the next day.
*   **First response is slower than the rest.** This is normal — Gemini needs to "warm up".
*   **The AI is not 100% deterministic across different CVs.** Same CV twice = same result (thanks to our `temperature=0` setting), but two similar CVs may score slightly differently.
*   **PDF extraction works best on text-based PDFs.** Scanned image PDFs will need OCR, which we haven't added yet.