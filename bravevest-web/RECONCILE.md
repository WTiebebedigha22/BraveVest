# BraveVest — Reconciliation Report

Generated: 2026-11-04

## What was fixed

### AppRoutes.jsx
- **Removed duplicate `About` import** (was declared twice, causing Vite build failure)
- **Consolidated RiskDisclosure** — removed dead `RiskDisclosurePage` import, kept `RiskDisclosure` routed to `/risk-disclosure`
- **Moved admin routes into correct auth guards:**
  - `/admin/contact` and `/admin/settings` — now inside `ProtectedRoute + RoleRoute role="ADMIN"`
  - Before: they were top-level routes with no auth check (security bug)
- **Moved `/commitments` into `ProtectedRoute` block** — was previously accessible without auth
- **Added missing routes:**
  - `/opportunities/:slug` → `OpportunityDetail`
  - `/security` → `Security`
  - `/contact` → `Contact`
  - `/kyc/status` → `KycReview`
- **Removed unused `AdminDashboard` import** (pages/admin/Dashboard.jsx is the routed one)

## What still needs work

### Pages not yet Bybit-styled

The following pages still use the old BraveVest design (Playfair serif, teal/lime):
- **All 16 admin pages** — need consistent styling
- **All 16 investor secondary pages** — Investments, InvestmentDetail, Documents, Goals, GoalDetail, Groups, Gifting, YearInReview, Referral, Commitments
- **All 5 funding pages** — FundingList, FundingDetail, FundingNew, FundingMine, AdminReview
- **All 5 KYC wizard pages** — Steps 1-5 + KycReview
- **16 public secondary pages** — Resources, Contact, HowItWorks, HelpCenter, HelpArticle, Stories, StarterPool, Insights, InsightDetail, OpportunityDetail, Security, etc.

### Backend endpoints that need verification

- `GET /api/investments` — list of investor's investments
- `GET /api/investments/:id` — investment detail
- `GET /api/users/documents` — documents page
- `GET /api/goals` — goals list
- `POST /api/goals` — create goal
- `GET /api/groups` — groups list
- `POST /api/groups` — create group
- `GET /api/referrals/me` — referral dashboard
- `GET /api/kyc` — KYC status
- `PATCH /api/kyc/step/:n` — KYC step save
- `POST /api/kyc/documents` — KYC document upload
- `POST /api/kyc/submit` — KYC submission
- `GET /api/admin/dashboard` — admin stats
- `GET /api/admin/investors` — investor list
- `GET /api/admin/kyc` — KYC review queue
- `GET /api/admin/transactions` — transaction list
- `GET /api/admin/reports` — reports + CSV export

## Verification checklist

After restarting the dev server:

- [ ] No Vite build errors on startup
- [ ] `/about` loads (no duplicate declaration)
- [ ] `/risk-disclosure` loads
- [ ] `/contact` loads (was previously unrouted)
- [ ] `/security` loads (was previously unrouted)
- [ ] `/opportunities/:slug` loads
- [ ] `/kyc/status` loads
- [ ] Admin routes `/admin/contact` and `/admin/settings` redirect to login when not signed in as admin
- [ ] `/commitments` redirects to login when not signed in
- [ ] All 74 page files still exist on disk (no deletions)
