# LifeOS — Your Personal Life Operating System

> **A modern, responsive, AI-powered personal life-management platform designed to organize everyday responsibilities in one cohesive application.**

![LifeOS Status](https://img.shields.io/badge/Status-Production%20Ready-teal)
![Build](https://img.shields.io/badge/Build-Vite%20%2B%20React%2018%20%2B%20TypeScript-indigo)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-sky)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20Supabase-emerald)

---

## 🌟 Product Vision

LifeOS is built on a central principle:
> **LifeOS must do more than answer questions. It must help users plan tasks, prepare actions, complete supported tasks through connected services with explicit permission, and track outcomes.**

LifeOS orchestrates:
1. **Overview Dashboard** — Executive daily command center with priorities, overdue alerts, appointments, bills, and AI daily briefing.
2. **My Day & Smart Daily Planner** — Time-blocking interface, Pomodoro focus session timer, agenda, and carry-over tools.
3. **Task Management** — Full CRUD, list and kanban board views, subtask checklists, priority matrices, and tags.
4. **Calendar & Appointments** — Interactive monthly grid, event categorization, online meeting link launcher, and overlap conflict warnings.
5. **Reminders & Time Triggers** — One-time and recurring alerts with 15m/1h snooze controls.
6. **Bills & Deadlines** — Financial obligation tracking with zero bank credentials stored, overdue warnings, and manual payment verification.
7. **Document Vault** — Private encrypted file records, category filters, expiry warnings, and simulated AI metadata extraction.
8. **Goals & Daily Habits** — Long-term milestone breakdown, 7-day habit streak tracking with celebratory confetti.
9. **Learning & Education** — Courses, study schedules, session logs, and AI study plan generation.
10. **Work & Career** — 5-stage job application pipeline (Saved, Applied, Interviewing, Offer, Archived) and interview preparation.
11. **Family & Shared Workspace** — Partitioned household group with member roles, shared shopping list, and strict personal privacy boundaries.
12. **AI Personal Assistant** — Multi-turn conversational intelligence, quick prompt presets, and authorized personal data retrieval.
13. **Automations & Approvals** — Background recipe engine, execution history, and mandatory human safety gates for external/financial actions.
14. **In-App Notification Center** — Categorized notifications with unread badges and direct action routing.
15. **Settings & Data Control** — User profile, light/dark themes, API key management, full JSON/CSV data export, and 1-click demo reset.

---

## 🚀 Quick Start (Local Run)

### 1. Launch the Python FastAPI Backend (Port 8000)
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
- API Endpoint: **`http://localhost:8000/api/v1`**
- Interactive Swagger Docs: **`http://localhost:8000/docs`**

### 2. Launch the React + Vite Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at **`http://localhost:3000`**. The frontend automatically connects to the FastAPI backend!

### 3. Universal Keyboard Shortcuts
- **`Ctrl + K`** (or **`Cmd + K`** on macOS): Open Global Universal Search across all 15 modules.

### 4. Build Production Bundle
```bash
cd frontend
npm run build
```

---

## 🗄️ Database & PostgreSQL Migrations

The full relational schema with **30 tables** and **Row Level Security (RLS)** policies is located in:
📂 `supabase/migrations/20261011_initial_schema.sql`

To apply to your Supabase project:
1. Go to Supabase SQL Editor.
2. Paste and run `supabase/migrations/20261011_initial_schema.sql`.
3. Add your Supabase credentials to `.env.local` in `frontend/`.

---

## 🛡️ Security, Privacy & Safety Gates

- **Zero-Knowledge Financial Guard**: No credit card PANs, CVVs, or bank logins are stored.
- **Approval Gate Levels**:
  - `READ_ONLY`: Automated safe queries.
  - `INTERNAL_REVERSIBLE`: State changes with undo audit logs.
  - `EXTERNAL`: Third-party communications (requires explicit user confirmation).
  - `SENSITIVE_FINANCIAL`: Bill payments & sensitive records (strictly requires user consent).
- **Tenant Isolation**: Row Level Security (RLS) ensures one user cannot access another's private documents or tasks.

---

## 📁 Repository Structure

```
POWER PLATFORM/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Sidebar, Header, MobileNav
│   │   │   └── modals/       # GlobalSearchModal, QuickAddModal
│   │   ├── context/          # AppContext (global state, CRUD, actions)
│   │   ├── services/         # demoData.ts, storage.ts (local-first engine)
│   │   ├── types/            # TypeScript interfaces for all 15 modules
│   │   ├── views/            # Dedicated views for all 15 navigation sections
│   │   ├── App.tsx           # Main application shell
│   │   ├── main.tsx          # React DOM entry point
│   │   └── index.css         # Tailwind & glassmorphism utilities
│   ├── package.json          # Dependencies & scripts
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Custom brand & dark mode palette
│   └── Dockerfile            # Container configuration
├── supabase/
│   └── migrations/           # 20261011_initial_schema.sql (30 tables + RLS)
├── docs/
│   ├── ARCHITECTURE.md       # Architecture & system design
│   ├── SETUP_GUIDE.md        # Local setup & external provider connection
│   ├── DEPLOYMENT.md         # Vercel, Netlify & Docker instructions
│   └── TEST_REPORT.md        # 18-point acceptance criteria matrix
├── docker-compose.yml        # Docker composition setup
└── .env.example              # Environment configuration template
```

---

## 📄 Documentation Links
- [Architecture & Design](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/docs/ARCHITECTURE.md)
- [Setup & Configuration](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/docs/SETUP_GUIDE.md)
- [Deployment Guide](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/docs/DEPLOYMENT.md)
- [Acceptance Test Report](file:///c:/Users/bhara/Desktop/POWER%20PLATFORM/docs/TEST_REPORT.md)
