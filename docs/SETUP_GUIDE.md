# LifeOS Local Setup & Configuration Guide

## 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **Modern Browser**: Chrome, Firefox, Edge, or Safari with JavaScript enabled

---

## 2. Quick Local Run (Frontend + Python FastAPI Backend)

LifeOS comes with a full-stack architecture: a **Vite + React 18 frontend** and an asynchronous **Python FastAPI backend**.

### Step 1: Start the Python FastAPI Backend (Port 8000)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (FastAPI, Uvicorn, Pydantic, APScheduler)
python -m pip install -r requirements.txt

# 3. Launch the API server
python run.py
```
👉 Interactive Swagger API Documentation: **`http://localhost:8000/docs`**  
👉 Health Check: **`http://localhost:8000/health`**

### Step 2: Start the React Frontend (Port 3000)
```bash
# 1. In a new terminal, navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
👉 Open your browser at: **`http://localhost:3000`**

The frontend connects to `http://localhost:8000/api/v1` automatically, with offline fallback caching.

---

## 3. Connecting to Supabase (PostgreSQL)

To link LifeOS to a live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/migrations/20261011_initial_schema.sql` in this repo and execute the script.
4. Copy your project URL and Anon key from **Project Settings -> API**.
5. Create a `.env.local` file in `frontend/`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

All Row Level Security policies will automatically enforce tenant isolation.

---

## 4. Connecting an AI Provider (OpenAI / Anthropic)

1. Open LifeOS in your browser.
2. Navigate to **Settings -> Model-Independent AI Provider**.
3. Select your provider (**OpenAI** or **Anthropic**).
4. Enter your API Key.
5. Alternatively, leave it on **Built-in Intelligent Engine** for local, offline, free operation.

---

## 5. Resetting Demo Data vs Real Data

- **Reset Demo Data**: Click on your profile avatar in the top right corner and click **Reset Demo Data**. LifeOS resets to the curated fictional scenario.
- **Export Data**: Go to **Settings -> Data Portability** to export your entire database as a JSON backup or download your tasks as CSV.
