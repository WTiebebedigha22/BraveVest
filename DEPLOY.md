# BraveVest — Deployment Guide

Stack:

| Layer | Service | URL |
| --- | --- | --- |
| Frontend | GitHub Pages | https://wtiebebedigha22.github.io/BraveVest/ |
| Backend | AWS EC2 | https://api.bravevest.com |
| Database | Supabase Postgres | (private) |
| Cache | Upstash Redis (optional) | (private) |

---

## Frontend — GitHub Pages

### One-time setup

1. Push the repo to GitHub (see below).
2. Repo → **Settings** → **Pages** → **Source** = **"GitHub Actions"**.
3. Repo → **Settings** → **Actions** → **General** → Workflow permissions = **"Read and write"**.
4. Push any commit to `main` → wait ~2 min → your site is live.

### Local preview

```cmd
cd bravevest-web
set GITHUB_PAGES=true
npm run build
npx serve dist -l 4173
```

Open http://localhost:4173/BraveVest/

### Routing

Uses **HashRouter** — URLs look like:

    https://wtiebebedigha22.github.io/BraveVest/#/marketplace/skyline-apartments

No server-side rewrite rules needed. Deep links work via `public/404.html`.

### Assets

Vite emits `/BraveVest/assets/*` when `GITHUB_PAGES=true`.
If you rename the GitHub repo, update `REPO_NAME` at the top of `init.js`,
re-run it, and push.

---

## Backend — AWS EC2

### 1. Supabase

- Create project at https://supabase.com
- Settings → Database → Connection Info
- Copy **Pooled** (port 6543) → `DATABASE_URL`
- Copy **Direct** (port 5432) → `DIRECT_URL`

### 2. EC2

- Ubuntu 22.04 LTS, t3.small, Elastic IP
- Security group: 22, 80, 443
- Point `api.bravevest.com` → Elastic IP

```bash
ssh ubuntu@<ELASTIC_IP>
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx git
sudo npm i -g pm2
sudo adduser bravevest
sudo su - bravevest
git clone https://github.com/wtiebebedigha22/BraveVest.git
cd BraveVest/bravevest-api
cp .env.production.example .env.production
nano .env.production        # fill in Supabase + JWT + Paystack + SendGrid
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy
pm2 start src/server.js --name bravevest-api
pm2 save && pm2 startup
```

### 3. Nginx

```nginx
server {
  listen 80;
  server_name api.bravevest.com;
  client_max_body_size 20m;
  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo cp above > /etc/nginx/sites-available/bravevest
sudo ln -s /etc/nginx/sites-available/bravevest /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.bravevest.com
```

### 4. CORS

In `bravevest-api/.env.production`:

    FRONTEND_URL=https://wtiebebedigha22.github.io/BraveVest

The API's CORS middleware only allows requests from that origin.

---

## CI/CD — GitHub Actions secrets

Set under Repo → Settings → Secrets and variables → Actions:

| Secret | Value |
| --- | --- |
| `EC2_HOST` | Elastic IP |
| `EC2_USER` | `bravevest` |
| `EC2_PATH` | `/home/bravevest/BraveVest` |
| `EC2_SSH_KEY` | Private SSH key content |

Frontend deploys automatically via Pages artifact.
Backend deploys via SSH when `bravevest-api/**` changes.

---

## Webhooks

Paystack → Settings → Webhooks → set:

    https://api.bravevest.com/api/payments/webhook/paystack

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Site 404 | Settings → Pages → Source = **GitHub Actions** |
| Site loads but assets 404 | `REPO_NAME` in `init.js` doesn't match repo name (case-sensitive) |
| Deep link 404 | Ensure `public/404.html` is committed |
| CORS error | `FRONTEND_URL` must exactly match the Pages origin (no trailing slash) |
| API 502 | `pm2 logs bravevest-api` |
| Migration fails | Use `DIRECT_URL` (5432) — not pooled (6543) |
