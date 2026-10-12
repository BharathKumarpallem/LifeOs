# LifeOS Production Deployment Guide

## 1. Deploying to Vercel (Recommended for Frontend)

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete LifeOS platform"
   git remote add origin https://github.com/your-username/lifeos.git
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com), click **Add New -> Project**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Framework preset will automatically detect **Vite**.
6. Set build command: `npm run build` and output directory: `dist`.
7. Add optional environment variables (from `.env.example`).
8. Click **Deploy**.

---

## 2. Deploying via Docker

To containerize and run LifeOS on any VPS (AWS EC2, DigitalOcean, Hetzner, etc.):

```bash
# Build and run container in detached mode
docker-compose up -d --build

# Verify running container
docker ps
```

The application will be live on port `3000`.

---

## 3. Production Security Checklist

- [x] **No hardcoded secret keys**: All frontend code relies on public environment variables or client-controlled settings.
- [x] **Row Level Security (RLS)**: Enforced in PostgreSQL schema for multi-tenant isolation.
- [x] **Financial privacy**: No credit card PANs, CVVs, or bank logins are requested or stored.
- [x] **Zero-knowledge document vault**: Access is strictly scoped to the document owner.
- [x] **Human Approval Gates**: Automated external writes and third-party actions require explicit user confirmation.
