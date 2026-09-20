# BraveVest API

Express + Prisma backend for BraveVest Marketplace (Phase 1 & 2).

## Setup
```
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev   # http://localhost:3001
```

## Health
GET /health → { status: "ok" }
GET /api    → API metadata
