# BraveVest Marketplace

> **Access Verified Investment Opportunities**
> Powered by Bravelion Capital · A Bravelion Holdings Company

A multi-opportunity investment marketplace for verified property, project, income, notes, land, and credit-backed opportunities across Nigeria.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Theme System](#theme-system)
- [Admin Gating](#admin-gating)
- [Notifications](#notifications)
- [Session Management](#session-management)
- [AI Assistant](#ai-assistant)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Testing](#testing)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

BraveVest is a structured investment access platform where investors discover, review, fund, and track verified opportunities — with transparent documentation, professional project selection, risk-based packaging, and reliable investor reporting.

**Phase 1 & 2 (this codebase)** delivers the MVP:

- Public marketing site + marketplace
- Investor onboarding with KYC
- Investment creation and payment flow (Paystack)
- Investor dashboard with portfolio tracking
- Admin back office (KYC review, project management, reports)
- Full light/dark theming across every page
- Session management (change password, log out other devices)
- In-app notifications with bell + notifications page
- Floating AI assistant (Gemini-backed)
- Role-gated admin panel with super-admin elevation

**Phase 3 (future)** adds mobile apps, advanced wallet features, credit marketplace, AI recommendations, and automated payouts.

---

## Features

### Investor
- Account registration and secure authentication (JWT with refresh rotation)
- 5-step KYC onboarding with document upload
- Browse verified opportunities across 6 categories
- Interactive return calculator on each project
- Risk disclosure on every listing
- Invest via Paystack (or Flutterwave)
- Portfolio dashboard with health scoring
- Wallet and transaction ledger
- Year in Review with shareable summary
- Referral program
- Editable profile with password change
- **KYC-locked profile** — fields grey out after KYC approval; user can still update profile picture and change password
- **Active session management** — see all logged-in devices, log out of others in one click
- **In-app notifications** — real-time bell with unread count + dedicated `/notifications` page
- **AI assistant** — floating chat widget powered by Gemini, answers questions about KYC, wallet, investments

### Admin
- Platform overview dashboard with charts
- Investor directory with search and filters
- KYC review queue (approve / reject with reasons)
- Project CRUD (create, edit, status changes)
- Investment and transaction monitoring
- Reports with CSV export
- Full audit logging
- **Role-gated access** — `/admin/*` routes require `ADMIN` or `SUPER_ADMIN` role at both the API and the frontend
- **Super-admin elevation** — destructive operations (role changes, platform settings) require `SUPER_ADMIN`; regular admins are redirected
- **Admin link hidden** from investors in sidebar/drawer

### Public
- Editorial landing page (hero, stats, why, how-it-works)
- Marketplace catalog with category filters and search
- Project detail pages with calculator, risk disclosure, and pitch
- Knowledge Base with 12 articles
- Investor stories
- Starter Pool landing page (₦5,000 entry concept)

### Theming
- Full **light / dark mode** across all pages, driven by CSS custom properties
- Persistent via `localStorage` (key: `bv-theme`)
- Prefers device color scheme on first visit
- Toggle in navbar (sun/moon icon)
- **Navbar and footer permanently dark** — brand identity stays constant regardless of theme
- **Hero overlays forced light** — image-backed heroes always render white text with shadow

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 (HashRouter) |
| Styling | Plain CSS with design tokens (`--bv-*` and `--text-*`) |
| Charts | Recharts |
| HTTP | Axios |
| State | React Context |
| Icons | lucide-react |
| Fonts | Playfair Display (serif) · Inter (sans) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL (Supabase) |
| Auth | JWT with refresh rotation |
| Validation | Zod |
| Uploads | Multer (local disk) |
| Email | Nodemailer |
| Payments | Paystack (default) · Flutterwave (fallback) |
| AI | Google Gemini (`@google/generative-ai`) |

### Infrastructure
| Service | Purpose |
|---|---|
| Supabase | Hosted Postgres |
| GitHub Pages | Frontend hosting |
| AWS EC2 | Backend hosting (planned) |
| Cloudflare | DNS + CDN (planned) |

---

## Project Structure
BraveVest/
├── bravevest-api/ Node + Express backend
│ ├── prisma/
│ │ ├── schema.prisma Database schema
│ │ ├── migrations/ Prisma migrations
│ │ └── seed-all.js Demo data seeder
│ ├── scripts/
│ │ ├── check-roles.js Print every user's roles
│ │ └── fix-wallets.js Recompute wallet balances from transactions
│ └── src/
│ ├── modules/
│ │ ├── admin/ Admin-only routes + services
│ │ ├── auth/ Login, register, password, sessions
│ │ ├── chat/ AI assistant proxy (Gemini)
│ │ ├── funding/ Funding requests
│ │ ├── goals/ Investment goals
│ │ ├── groups/ Savings groups
│ │ ├── investments/ Investments
│ │ ├── kyc/ KYC submission + review
│ │ ├── notifications/ In-app notifications
│ │ ├── payments/ Paystack integration
│ │ ├── projects/ Marketplace projects
│ │ ├── referrals/ Referral program
│ │ ├── users/ User profile
│ │ └── wallet/ Wallet + ledger
│ ├── middleware/
│ │ ├── auth.middleware.js JWT verification
│ │ └── requireAdmin.js Role gates (admin + super admin)
│ └── config/
│ └── database.js Prisma client singleton
│
├── bravevest-web/ React + Vite frontend
│ ├── scripts/
│ │ ├── scan-hardcoded.cjs Find hardcoded colors
│ │ ├── scan-light.cjs Find light-mode violations
│ │ ├── scan-deep.cjs Deep hex scan (ternaries, template literals)
│ │ ├── scan-text-colors.cjs Text + numeric color scan (JSX + CSS)
│ │ ├── fix-remaining-colors.cjs Status colors → tokens
│ │ ├── fix-final-colors.cjs Final color pass
│ │ ├── fix-hero-and-footer.cjs Hero white + footer dark
│ │ ├── fix-text-main.cjs --text-main token migration
│ │ └── lock-navbar-footer-dark.cjs
│ └── src/
│ ├── AppEnhancements.jsx Theme tokens, admin gating, KYC lock,
│ │ country picker, notifications, AI chat
│ ├── components/
│ │ ├── layout/ Navbar, Footer, layouts
│ │ ├── landing/ Hero, CTA, stats, why, etc.
│ │ ├── marketplace/ Risk disclosure
│ │ └── shared/ Input, Skeleton, SmartImage
│ ├── pages/
│ │ ├── admin/ Admin dashboard + tools
│ │ ├── auth/ Login, register, forgot, reset, verify
│ │ ├── investor/ Dashboard, wallet, profile, investments, etc.
│ │ ├── onboarding/ KYC flow
│ │ └── public/ Marketing site + marketplace
│ └── styles/
│ ├── theme-tokens.css Global theme token definitions
│ ├── light-lock.css (neutralized)
│ └── index.css Entry stylesheet
│
└── scripts/
├── install-enhancements.cjs One-shot installer
├── install-admin-gating.cjs Admin middleware + route wraps
└── ...

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+ (or a Supabase project)
- Paystack test keys
- Google Gemini API key (for AI assistant)

### Environment Variables

**`bravevest-api/.env`**

```env
# Database — use :5432 (session pooler) for dev, :6543 for serverless prod
DATABASE_URL="postgresql://postgres.<ref>:<pass>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.<ref>:<pass>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

# Auth
JWT_SECRET=<random 64-char string>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...

# Gemini
GEMINI_API_KEY=AIzaSy...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...

# Runtime
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173
bravevest-web/.env

env
VITE_API_URL=http://localhost:3001
Database Setup
bash
cd bravevest-api
npm install
npx prisma migrate dev
node prisma/seed-all.js
The seed creates:

9 demo projects (Lagos Solar, Abuja RE Note, Ogun Agri, etc.)

8 demo investors with KYC statuses (approved + pending)

14 investments with realistic dates and expected returns

28 transactions (deposits, investments, payouts, withdrawals)

Wallets + ledger entries for every user

1 admin account (admin@demo.bravevest.test)

Running Locally
bash
# Terminal 1 — backend
cd bravevest-api
npm run dev
# → http://localhost:3001

# Terminal 2 — frontend
cd bravevest-web
npm run dev
# → http://localhost:5173
Theme System
All colors flow through CSS custom properties defined in AppEnhancements.jsx (the THEME_CSS constant):

Token	Dark	Light
--bv-bg	#0B0E11	#FFFFFF
--bv-bg-elevated	#151A21	#F7F8FA
--bv-surface	#1E2329	#F2F4F6
--bv-border	#2B313A	#D4D8DD
--bv-text / --text-main	#F0F3F6	#0B0E11
--bv-text-muted	#848E9C	#5A6169
--bv-accent	#F0B90B	#B07C00
--bv-danger	#FF4D4F	#D9363E
--bv-success	#0ECB81	#0A8F5C
--bv-info	#3B82F6	#2563EB
--bv-warning	#F59E0B	#D97706
Toggle: stored in localStorage under bv-theme. <html> gets data-theme="dark" or data-theme="light". Pre-paint script in index.html prevents flash-of-wrong-theme.

Permanent dark surfaces (ignore theme): .bv-always-dark class on the navbar and footer, .elite-banner class on image-backed hero sections.

Permanent light text (over dark image overlays): .bv-on-image class.

Do not write hardcoded hex in component CSS. Use var(--bv-*) or var(--text-*). Run node scripts/scan-hardcoded.cjs to verify.

Admin Gating
Routes under /admin/* require ADMIN or SUPER_ADMIN:

Backend — every admin router applies router.use(authRequired, requireAdmin) at the top. The requireAdmin middleware re-reads roles from DB on every request (not from the JWT), so a demoted admin loses access immediately.

Frontend — <AdminRoute> wraps all /admin/* routes in App.jsx. <SuperAdminRoute> wraps destructive routes (role changes, platform settings). The "Admin" sidebar link is hidden from non-admins via useIsAdmin().

Super-admin promotion — via DB:

bash
node -e "require('dotenv').config(); const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); p.user.update({where:{email:'admin@demo.bravevest.test'},data:{roles:['ADMIN','SUPER_ADMIN']}}).then(u=>{console.log(u.email,u.roles);process.exit(0)})"
Notifications
Every write endpoint that changes user-visible state creates a notification via notificationsService.push({ userId, type, title, message, metadata }).

Triggered on:

Investment created

KYC approved / rejected

Account registered

Password reset

Frontend uses useNotifications() hook (polls every 30s) → <NotificationBell /> in navbar → also rendered as full list on /notifications.

Session Management
Three endpoints on /api/auth:

Endpoint	Purpose
POST /change-password	Verify old password, hash new, revoke all other refresh tokens
GET /sessions	List active refresh tokens (device UA + IP + timestamp)
POST /logout-others	Revoke every refresh token except the current one
Refresh tokens store userAgent + ipAddress on creation — the sessions panel uses these. Ensure auth.controller.js passes { userAgent: req.headers['user-agent'], ipAddress: req.ip } into service.login() and service.refresh().

Profile page (/profile) renders <ChangePasswordForm /> and <ActiveSessionsPanel /> from AppEnhancements.jsx.

AI Assistant
Floating chat widget (<FloatingAIChat /> in App.jsx) POSTs to /api/chat, which proxies to Gemini.

Backend: src/modules/chat/chat.routes.js

System prompt restricts the model to BraveVest topics (investments, KYC, wallet, referral, navigation)

Rejects off-topic questions politely

Caps response length

Never invents numbers — points user to the relevant page

Requires GEMINI_API_KEY in bravevest-api/.env. Get one at https://aistudio.google.com/apikey.

Demo Accounts
All accounts use password DemoPass123!.

Investors (KYC approved)
Email	Name
tunde@demo.bravevest.test	Tunde Adeyemi
ngozi@demo.bravevest.test	Ngozi Okonkwo
chidi@demo.bravevest.test	Chidi Nwosu
aisha@demo.bravevest.test	Aisha Bello
funke@demo.bravevest.test	Funke Adeleke
Pending KYC (visible in admin queue)
Email	Name
emeka@demo.bravevest.test	Emeka Obi
kola@demo.bravevest.test	Kola Adebowale
zainab@demo.bravevest.test	Zainab Musa
Admin
Email	Role
admin@demo.bravevest.test	ADMIN (promote to SUPER_ADMIN via script above)
API Reference
Auth
Method	Path	Purpose
POST	/api/auth/register	Create account
POST	/api/auth/login	Get access + refresh tokens
POST	/api/auth/refresh	Rotate refresh token
POST	/api/auth/logout	Revoke current refresh token
GET	/api/auth/me	Current user (incl. roles, kyc.status)
POST	/api/auth/forgot-password	Send reset email
POST	/api/auth/reset-password	Consume reset token
POST	/api/auth/change-password	Update password, revoke other sessions
GET	/api/auth/sessions	List active sessions
POST	/api/auth/logout-others	Revoke all other refresh tokens
Marketplace
Method	Path	Purpose
GET	/api/projects	List open projects (filters: category, q)
GET	/api/projects/:slug	Project detail
GET	/api/projects/mine	Projects owned by current user (authenticated)
Investments & Wallet
Method	Path	Purpose
GET	/api/investments	User's investments
POST	/api/investments	Create investment (initiates payment)
GET	/api/wallet	Wallet + balance
GET	/api/wallet/ledger	Recent ledger entries
GET	/api/wallet/banks	Bank list (Paystack proxy)
Notifications
Method	Path	Purpose
GET	/api/notifications	User's notifications (last 50)
PATCH	/api/notifications/:id/read	Mark single as read
POST	/api/notifications/read-all	Mark all as read
Chat
Method	Path	Purpose
POST	/api/chat	Send message to AI assistant
Admin
All require authRequired + requireAdmin:

Method	Path	Purpose
GET	/api/admin/stats	Dashboard overview
GET	/api/admin/users	Investor directory
GET	/api/admin/kyc	KYC queue
PATCH	/api/admin/kyc/:id	Approve / reject
GET	/api/admin/projects	All projects
POST	/api/admin/projects	Create project
PATCH	/api/admin/projects/:id	Edit project
GET	/api/admin/investments	All investments
GET	/api/admin/transactions	All transactions
GET	/api/admin/reports	Reports + CSV export
Super-admin-only (require SUPER_ADMIN):

Method	Path	Purpose
PATCH	/api/admin/users/:id/role	Change another user's roles
POST	/api/admin/settings	Platform settings
Deployment
Component	Current	Planned
Frontend	Vercel (via vercel.json)	GitHub Pages
Backend	Render	AWS EC2
Database	Supabase (eu-central-1)	Same
CDN	—	Cloudflare
Database note: Use :5432 (session pooler) for long-running Node processes and migrations. Use :6543 (transaction pooler, with ?pgbouncer=true&connection_limit=1) for serverless deployments.

Testing
No automated test suite yet. Manual verification checklist:

Auth flow — register → verify email → login → refresh → logout

KYC flow — submit 5-step form → admin approves → /profile fields lock

Investment flow — browse marketplace → click project → invest → confirm transaction in /wallet

Admin gating — investor redirected from /admin, admin can access, admin blocked from super-only routes

Theme — toggle in navbar, all pages flip, navbar/footer/heroes stay fixed

Notifications — trigger event (invest, approve KYC), bell badge increments, /notifications shows entry

Session management — log in on two devices, "log out others" revokes the other session

AI assistant — open chat, ask "How does KYC work?", get contextual answer

Verification scripts:

bash
cd bravevest-api
node scripts/check-roles.js

cd ../bravevest-web
node scripts/scan-hardcoded.cjs
node scripts/scan-text-colors.cjs
Scripts
Backend
Command	Purpose
node prisma/seed-all.js	Seed demo data (idempotent)
node prisma/fix-wallets.js	Recompute wallet balances from transactions
node scripts/check-roles.js	List every user + roles
Frontend
Command	Purpose
node scripts/scan-hardcoded.cjs	Find every hardcoded hex in src/
node scripts/scan-light.cjs	Find light-mode violations
node scripts/scan-deep.cjs	Deep scan (ternaries, template literals)
node scripts/scan-text-colors.cjs	Text + numeric color scan (JSX + CSS)
node scripts/fix-remaining-colors.cjs	Convert status colors to tokens
node scripts/fix-final-colors.cjs	Final color pass (status + marketplace + light locks)
node scripts/fix-hero-and-footer.cjs	Force hero white, footer dark
node scripts/lock-navbar-footer-dark.cjs	Lock navbar + footer to dark
node scripts/fix-text-main.cjs	Migrate to --text-main / --text-muted
All frontend scripts accept --dry for preview before applying.

Contributing
Fork + branch

Run node scripts/scan-hardcoded.cjs — commits introducing hardcoded colors are rejected in review

Run npm run dev in both bravevest-api/ and bravevest-web/ — verify both themes

PR must include: what changed, screenshots (light + dark), any new tokens added to AppEnhancements.jsx

License
Proprietary — © Bravelion Holdings. All rights reserved.
