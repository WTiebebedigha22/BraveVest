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

**Phase 3 (future)** adds mobile apps, advanced wallet features, credit marketplace, AI recommendations, and automated payouts.

---

## Features

### Investor
- Account registration and secure authentication (JWT)
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

### Admin
- Platform overview dashboard with charts
- Investor directory with search and filters
- KYC review queue (approve / reject with reasons)
- Project CRUD (create, edit, status changes)
- Investment and transaction monitoring
- Reports with CSV export
- Full audit logging

### Public
- Editorial landing page (hero, stats, why, how-it-works)
- Marketplace catalog with category filters and search
- Project detail pages with calculator, risk disclosure, and pitch
- Knowledge Base with 12 articles
- Investor stories
- Starter Pool landing page (₦5,000 entry concept)

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 (HashRouter) |
| Styling | Plain CSS with design tokens |
| Charts | Recharts |
| HTTP | Axios |
| State | React Context |
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

### Infrastructure
| Service | Purpose |
|---|---|
| Supabase | Hosted Postgres |
| GitHub Pages | Frontend hosting |
| AWS EC2 | Backend hosting (planned) |
| Cloudflare | DNS + CDN (planned) |
