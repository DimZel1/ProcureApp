# Purchasing Starter — Postgres-first + Yearly Sequential Refs

Minimal app to **create** and **list** requisitions with a collapsible left menu. References are generated as **RPT-YY-####-RQ** (e.g., `RPT-25-0001-RQ`), with the 4-digit counter resetting each year. Stack: **Next.js (App Router) + Prisma + PostgreSQL**.

---

## Local Development (Production Parity)

### 0) Prereqs
- Node.js 20+
- Docker Desktop (or Docker Engine + Compose)

### 1) Start Postgres
```bash
docker compose up -d
```
This launches Postgres 16 at `localhost:5432`, DB `purchasing`, user `app`, password `app`.

### 2) Configure & install
```bash
cp .env.example .env
npm i
```

### 3) Apply schema (creates tables `Requisition` and `Sequence`)
```bash
npx prisma migrate dev --name init
```

### 4) Run
```bash
npm run dev
```
Open http://localhost:3000

---

## DigitalOcean Deployment — App Platform (Recommended)

### A. Create a Managed Postgres
1. In DigitalOcean, go to **Databases → Create → PostgreSQL**.
2. Choose a small plan (e.g., `Basic` tier). For ~10 internal users this is sufficient.
3. Note the connection string and **enable Trusted Sources** later for the App.

### B. Push Code to Git
- Push this project to GitHub/GitLab/Bitbucket.

### C. Create an App from Repo
1. DigitalOcean → **Apps → Create App**.
2. Connect your repository and select this project.
3. Select **Dockerfile** as the build method (it’s included).

### D. Configure Environment
1. In **App → Settings → Environment Variables**, add:
```
DATABASE_URL=postgresql://<user>:<password>@<host>:25060/<db>?sslmode=require
```
2. In the Database page, add your **App** as a **Trusted Source** (or use the DB firewall to allow the App).

### E. Build & Run Commands
- The Dockerfile will run `npx prisma migrate deploy` automatically on start.  
- Alternatively, add a **Predeploy Command** (in App → Components → your service → Advanced):
```
npx prisma migrate deploy
```
This ensures schema is up-to-date before each rollout.

### F. Expose Port / Health
- App Platform auto-detects port **3000**.
- Optional: set a Health Check path to `/api/requisitions` (GET) which returns 200.

### G. Deploy
- Click **Deploy**. After it’s live, visit the generated URL.
- First creation on a fresh year will yield `RPT-YY-0001-RQ`.

### H. Common Pitfalls (and fixes)
- **Prisma errors about missing tables**: ensure the migrate step ran (`npx prisma migrate deploy`) and your `DATABASE_URL` is correct.
- **Connection refused**: add the App as a **Trusted Source** in your Managed DB or allow its outbound IP in the DB firewall.
- **Schema drift**: never edit DB tables manually; change the Prisma schema and run migrations.

---

## DigitalOcean on a Droplet (Alternative)

1) Provision a Ubuntu Droplet.  
2) Install Docker & Compose.  
3) Use DigitalOcean Managed Postgres (recommended) or self-host Postgres on the Droplet.  
4) Create `.env` with your prod `DATABASE_URL`.  
5) Build & run:
```bash
docker build -t purchasing-starter .
docker run -d --name purchasing -p 3000:3000 --env-file .env purchasing-starter
```
6) Put **Caddy/Nginx** in front for TLS and a systemd unit for restart on boot.

---

## Reference Generation Details

- Format: `RPT-YY-####-RQ`  
- `YY` = `new Date().getFullYear() % 100`  
- 4-digit counter is stored in the `Sequence` table and **increments atomically in a DB transaction** to avoid duplicates under concurrency.  
- Counter **resets every year** (one row per year).

---

## Roadmap (non-breaking additions)
- Authentication (NextAuth with Postgres adapter)
- Requisition line items & file uploads
- PDF export for RFQs
- Roles & permissions
- Audit trail
