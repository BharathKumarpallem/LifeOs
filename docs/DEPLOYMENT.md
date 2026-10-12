# LifeOS Production Deployment & Live URL Guide

This guide explains how to push LifeOS to your GitHub account (**BharathKumarpallem**) and obtain a live public URL.

---

## 🚀 Step 1: Push LifeOS to Your GitHub Account

1. Open your browser and go to: **[github.com/new](https://github.com/new)**
2. Set **Repository name**: `lifeos` (or any name you prefer).
3. Set visibility to **Public** (or **Private**).
4. **Leave all checkboxes unchecked** (no README, no .gitignore, no license — we already created them).
5. Click **Create repository**.
6. Run the following commands in PowerShell from the project root (`c:\Users\bhara\Desktop\POWER PLATFORM`):

```powershell
# 1. Add your GitHub remote repository
git remote add origin https://github.com/BharathKumarpallem/lifeos.git

# 2. Push code to GitHub
git push -u origin main
```

---

## 🌐 Option A: Instant Live URL via GitHub Pages (Built-in & Automated)

We have already configured a GitHub Actions deployment workflow in [`.github/workflows/deploy.yml`](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/.github/workflows/deploy.yml).

1. In your GitHub repository (`github.com/BharathKumarpallem/lifeos`), go to **Settings -> Pages** (in the left sidebar).
2. Under **Build and deployment -> Source**, select **GitHub Actions**.
3. Push any commit or trigger the workflow under the **Actions** tab.
4. Once completed (approx. 45 seconds), your live URL will be active at:
   👉 **`https://bharathkumarpallem.github.io/lifeos/`**

---

## ⚡ Option B: Live URL via Vercel (Fastest & Recommended)

We have included a pre-configured [`vercel.json`](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/vercel.json) in the repository.

1. Go to **[vercel.com](https://vercel.com)** and sign in with your GitHub account (`BharathKumarpallem`).
2. Click **Add New -> Project**.
3. Select your `lifeos` repository and click **Import**.
4. Vercel automatically detects `vercel.json` and the Vite frontend build.
5. Click **Deploy**.
6. Within 30 seconds, Vercel gives you a free HTTPS live URL (e.g. `https://lifeos-bharath.vercel.app`).

---

## 🐍 Option C: Live Python FastAPI Backend (Render / Railway / Koyeb)

To host the Python FastAPI backend online with a free public API endpoint:

1. Go to **[render.com](https://render.com)** and sign in with GitHub.
2. Click **New -> Web Service**.
3. Select your `lifeos` repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. Your live backend API will be available at: `https://lifeos-backend.onrender.com`.

---

## 🐳 Option D: Self-Hosted Docker Deployment

To run frontend, backend, and PostgreSQL database on any VPS (AWS EC2, DigitalOcean, Hetzner):

```bash
docker-compose up -d --build
```
- Frontend: `http://your-server-ip:3000`
- Backend API: `http://your-server-ip:8000`
- API Docs: `http://your-server-ip:8000/docs`
