# BraveVest MVP — Phase 2 API

Generated 2026-10-10.

## Endpoints

| Method | Path | Auth | Role |
|---|---|---|---|
| GET    | `/api/funding/requests` | optional | public |
| GET    | `/api/funding/requests/:id` | optional | owner/admin/published |
| POST   | `/api/funding/requests` | required | BORROWER/ADMIN |
| GET    | `/api/funding/mine` | required | BORROWER/ADMIN |
| PATCH  | `/api/funding/requests/:id` | required | owner, DRAFT/SUBMITTED only |
| POST   | `/api/funding/requests/:id/submit` | required | owner |
| GET    | `/api/funding/review` | required | ADMIN |
| POST   | `/api/funding/requests/:id/approve` | required | ADMIN |
| POST   | `/api/funding/requests/:id/reject` | required | ADMIN |

## Status flow

```
DRAFT ──submit──▶ SUBMITTED ──approve──▶ PUBLISHED
                      │
                      └──reject──▶ REJECTED
```

Only PUBLISHED requests appear in the public list.

## Notes on middleware

- `authenticate` — the script tries to import from `src/middleware/authenticate.js`,
  `src/middleware/auth.js` (exports `authenticate` or `protect`). If none is found,
  a minimal fallback trusts upstream middleware that sets `req.user`.
- `requireRole(...)` — created at `src/middleware/role.js` if not already present.
- `audit(req, action, ...)` — writes to `AuditLog`. Actions mapped to `AuditAction` enum.

## Example calls

```bash
# Public list
curl http://localhost:3001/api/funding/requests

# Create (borrower)
curl -X POST http://localhost:3001/api/funding/requests \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Test request","category":"SME","amountRequested":100000,"proposedReturnPct":15,"durationMonths":12,"repaymentFrequency":"monthly"}'

# Submit
curl -X POST http://localhost:3001/api/funding/requests/$ID/submit -H "Authorization: Bearer $TOKEN"

# Review queue (admin)
curl http://localhost:3001/api/funding/review -H "Authorization: Bearer $ADMIN_TOKEN"

# Approve
curl -X POST http://localhost:3001/api/funding/requests/$ID/approve -H "Authorization: Bearer $ADMIN_TOKEN"
```
