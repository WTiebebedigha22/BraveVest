# BraveVest Mobile — Handoff

Bootstrap: **v4** (2026-10-02)
- Auth bypass for dev
- Marketplace list + detail wired to API
- Real font loading
- Root redirect + error boundary

## Backend
- Dev: `http://localhost:3001`
- Prod: `https://api.bravevest.com`
- Auth: JWT access + refresh in `expo-secure-store`

## DEV AUTH BYPASS
`app/index.tsx` reads `EXPO_PUBLIC_DEV_AUTH_BYPASS`. When unset or `1`, it redirects
straight to `/(app)` — no login screen. Set `.env`:
```
EXPO_PUBLIC_DEV_AUTH_BYPASS=0
```
before shipping to restore normal auth.

Note: bypassing the login screen means no JWT in SecureStore. Any API call that
requires auth will 401. To get tokens in dev, navigate manually to `/login`, sign in
once with the demo account, then navigate back. Tokens persist in SecureStore across
reloads.

## Demo accounts (password: `DemoPass123!`)
- `admin@demo.bravevest.test` — admin
- `investor@demo.bravevest.test` — investor, KYC approved
- `investor.pending@demo.bravevest.test` — investor, KYC review
- `investor.new@demo.bravevest.test` — investor, KYC none

## Tabs
- `index` — Home (ALAT-style hero, quick actions, spotlight, activity)
- `marketplace` — Discover (`GET /api/projects`)
- `portfolio` — stub (wire to `/api/investments/portfolio`)
- `profile` — stub (wire to `/api/users/me`)

## Detail routes
- `app/(app)/project/[slug].tsx` — project detail (`GET /api/projects/:slug`)

## API hooks
- `src/api/hooks.ts` — `useApi<T>`, `useProjects()`, `useProject(slug)`

## UI primitives
- `Card` — default / elevated / outline
- `QuickAction` — layered ring icon button
- `ProjectCard` — marketplace tile with return/min/funded stats
- `EmptyState` — centered empty/error message

## Next
1. `cd mobile && npm install && npx expo start --clear`
2. Tabs are live. Tap **Discover** → pick a project → detail.
3. Wire portfolio screen to `GET /api/investments/portfolio` + `/portfolio/series`
4. Build investment flow: `POST /api/investments` → `POST /api/payments/initialize`
   → Paystack WebView → `GET /api/payments/verify/:ref`
5. KYC wizard (`/api/kyc/*`)
6. Profile + currency switcher + logout
7. Restore auth: set `EXPO_PUBLIC_DEV_AUTH_BYPASS=0`
8. `npx eas-cli init` when ready to build
