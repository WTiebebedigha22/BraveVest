# BraveVest Mobile — Handoff

Bootstrap: **v8** (2026-10-03)

## What's new
- **Onboarding carousel** (`app/onboarding.tsx`) — 3 slides, dots, Skip / Continue / Get started. First-run only.
- **OnboardingContext** — persists `bv.onboarded` in AsyncStorage. Replay from Profile.
- **Homepage layout** matches the UI kit: Total asset value headline, My Portfolio stacked cards (Solar / Real Estate / Profits + Invest), 4 icon pills, Watchlist with chip filters and a card.
- **Card** now has a border in both themes for clearer separation.

## Palette
BraveVest palette preserved:
- ink `#0F0F10` · lime `#B3D941` · teal `#3FB8C4` · lavender `#C9A6F2`
- Light theme derived — accents darkened for contrast on white.

## Themes
- Device default via `useColorScheme()`
- Override in Profile → Appearance (System / Light / Dark), persisted to AsyncStorage
- PATCH `/api/users/me { theme }` — needs backend field (see below)

## Backend requirement
```prisma
model User {
  theme String @default("system")
}
```
Migration: `npx prisma migrate dev --name add_user_theme`. PATCH `/api/users/me` should accept `theme`.

## Demo accounts (password: `DemoPass123!`)
- `admin@demo.bravevest.test` — admin
- `investor@demo.bravevest.test` — investor, KYC approved
- `investor.pending@demo.bravevest.test` — investor, KYC review
- `investor.new@demo.bravevest.test` — investor, KYC none

## Screens
- Onboarding — 3-slide carousel
- Home — kit layout (Total asset value, My Portfolio stacked cards, category pills, Watchlist)
- Discover — chip filters + ProjectCard list
- Project detail — stats grid + progress + Invest CTA
- Portfolio — hero + sparkline + holdings
- Goals — list + floating ＋ → modal
- Profile — account, appearance, currency, replay onboarding, sign out

## Run
```powershell
node init.js --force
cd mobile && npm install && npx expo start --clear
```

## Next
1. `theme` field in Prisma User + PATCH endpoint
2. Investment flow (Paystack)
3. KYC wizard
4. Push notifications + biometrics
5. Restore auth: `EXPO_PUBLIC_DEV_AUTH_BYPASS=0`
6. `npx eas-cli init`
