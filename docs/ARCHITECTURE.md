# LifeOS Architecture & System Design

## 1. High-Level System Overview

LifeOS is an intelligent, privacy-first personal life management platform designed around the principle of **action-oriented personal orchestration**. Rather than merely answering questions or presenting static checklists, LifeOS synthesizes schedules, automates routine obligations, manages approval gates, and maintains private knowledge records.

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|   +---------------------------------------------------------------------------+   |
|   | 15 Core Modules: Overview | My Day | Tasks | Calendar | Reminders | Bills |   |
|   | Documents | Goals & Habits | Learning | Career | Family | AI Assistant    |   |
|   | Automations | Notifications | Settings                                    |   |
|   +---------------------------------------------------------------------------+   |
|   | Global Universal Search (Ctrl+K)  | Quick Add Modal | In-App Bell Center  |   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        REACT CONTEXT & STATE ENGINE (APP)                         |
|   +---------------------+  +----------------------+  +------------------------+   |
|   | LifeOS State Cache  |  | Human Approval Gate  |  | AI Synthesis Engine    |   |
|   | Real CRUD Handlers  |  | Risk Classifier      |  | Local / LLM Provider   |   |
|   +---------------------+  +----------------------+  +------------------------+   |
+-----------------------------------------+-----------------------------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
                      v                                       v
+-------------------------------------+   +-------------------------------------+
|        LOCAL-FIRST PERSISTENCE      |   |        BACKEND & SUPABASE RLS       |
|  - Encrypted LocalStorage           |   |  - PostgreSQL 15+ Relational Schema |
|  - Offline Availability Guarantee   |   |  - Row Level Security (RLS) Policies|
|  - Instant JSON / CSV Exporter      |   |  - Private Vault File Access Control|
|  - 1-Click Demo Reset Engine        |   |  - Background Automation Cron Jobs  |
+-------------------------------------+   +-------------------------------------+
```

## 2. Core Pillars

### 2.1 Action Safety & Human-in-the-Loop Approval
LifeOS classifies every automation and AI action into four distinct risk tiers:
1. **READ_ONLY**: Non-destructive queries (e.g. summarizing due dates, daily briefings). Automatic.
2. **INTERNAL_REVERSIBLE**: Modifications to internal state that can be easily undone (e.g. marking a task complete, setting a reminder). Automatic with audit log.
3. **EXTERNAL**: Outbound actions interacting with external networks (e.g. syncing to Google Calendar, sending an interview confirmation). Requires explicit user authorization.
4. **SENSITIVE_FINANCIAL**: Financial actions or legal document modifications (e.g. confirming bill payment). Strictly requires explicit modal approval.

### 2.2 Local-First & Zero-Knowledge Vault
- No financial secrets, payment card numbers, or banking passwords are ever requested or stored.
- Documents are partitioned by privacy flags. Family members only access shared resources (e.g. shared grocery lists, shared family calendar events).
- Private documents, resumes, and medical records remain strictly inaccessible to other family members.

### 2.3 Model-Independent AI Layer
- The AI Assistant architecture is decoupled from any single vendor.
- Out of the box, LifeOS runs on a deterministic, high-speed intelligent analyzer that scans active state (tasks due today, overdue items, expiring documents, pending bills).
- When a user connects an OpenAI or Anthropic API key in Settings, requests route through the backend proxy without leaking keys to the client.
