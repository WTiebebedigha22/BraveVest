# BraveVest Mobile — Handoff (Phase 3)

Updated 2026-10-16.

## What's new in this phase

### Funding
- `app/(app)/funding/index.tsx` — list of published funding requests, category filter
- `app/(app)/funding/[id].tsx` — detail page + commit modal
- `src/components/ui/FundingCard.tsx` — card with progress bar and return %

### Credit (borrower side)
- `app/(app)/credit.tsx` — tab replaced Goals. Shows own requests + create modal.
- Explains "you're requesting funding from individual investors... peer-to-peer loan"

### Commitments (investor side)
- Folded into Portfolio as a tab: Holdings | Commitments
- Data from `GET /api/funding/commitments/mine`

### Real endpoints (replacing placeholders)
- Home: portfolio value, funding featured, uses `useMe()` for name
- Portfolio: real `/api/investments/portfolio` + `/series` + commitments tab
- Profile: real `/api/users/me`, roles display, theme + currency persist

### Tabs now
Home · Discover · Portfolio · Credit · Profile

(Goals removed — replaced by Credit.)

## API endpoints consumed

```
GET  /api/users/me
GET  /api/investments/portfolio
GET  /api/investments/portfolio/series
GET  /api/funding/requests
GET  /api/funding/requests/:id
POST /api/funding/requests
POST /api/funding/requests/:id/submit
GET  /api/funding/mine
POST /api/funding/commitments
GET  /api/funding/commitments/mine
GET  /api/currency/rates
```

## Role handling

`getRoles(me)` returns `string[]` — checks `me.roles[]` first, then `me.role`.
`hasRole(me, ...roles)` — helper. Used to gate the Credit create button and Commit button.

## Still stubbed
- KYC wizard (routes to placeholder)
- Investment flow (Paystack WebView)
- Push notifications
- Biometric login

## Environment

Set `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env`:
- Simulator: `http://localhost:3001`
- Physical device: `http://<LAN-IP>:3001`

## Next phase
- KYC wizard screens wired to `/api/kyc/*`
- Investment flow: `POST /api/investments` → `POST /api/payments/initialize` → Paystack WebView → verify
- Push notifications via expo-notifications
- Biometric login via expo-local-authentication
