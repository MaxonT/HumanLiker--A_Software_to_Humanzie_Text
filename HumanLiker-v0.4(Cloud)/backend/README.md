# HumanLiker v0.3 – Backend (Express)

## Setup
1) `cp .env.example .env` and fill values.
2) `npm install`
3) `npm run dev`

### Auth
- `POST /api/auth/signup { email, password }`
- `POST /api/auth/login { email, password }`
- `POST /api/auth/logout`
- `GET /api/auth/me` (cookie-based)

### Subscription
- `POST /api/subscribe/create-checkout-session`
- `POST /api/stripe/webhook`

Stripe optional; with env vars, live Checkout works. Without them, the endpoint returns a mock success URL.

### Legal
- `GET /api/legal/privacy`
- `GET /api/legal/terms`
- `GET /api/legal/cookies`
