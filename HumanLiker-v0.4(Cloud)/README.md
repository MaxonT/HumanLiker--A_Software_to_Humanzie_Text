# HumanLiker v0.3

Local-first text humanizer with account + subscription + i18n + theme + legal.

## Structure
- `backend/` Express + SQLite + JWT + Stripe routes
- `frontend/` Vite + React + i18next + Theme + Cookie banner

## Quickstart
- Backend: `cd backend && cp .env.example .env && npm install && npm run dev`
- Frontend: `cd frontend && cp .env.example .env && npm install && npm run dev`

Set `VITE_API_URL` in frontend to point to backend (default http://localhost:5174).

### Stripe
Price: $5/month for Plus plan.
Set env: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY_5USD`, `STRIPE_WEBHOOK_SECRET`. Without them, backend returns a mock success flow.
