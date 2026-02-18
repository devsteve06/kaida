# Kaida — E‑Commerce Backend (MVP)

## Overview
Lightweight Node.js + Express backend providing product catalog, cart, orders, and payments integration used for the Kaida storefront.

## Current Status
- Implemented: user authentication, product catalog and categories, cart, basic orders, payments (MPESA + Stripe), controllers/services/models, middleware for auth/authorization, input validators, and a Swagger-based docs endpoint.
- Docs: Swagger available via the `/docs` route when the server is running (`src/docs/swagger.js`).
- Tests: basic unit tests exist under `src/tests` (service-level tests).

## Tech Stack
- Node.js
- Express
- PostgreSQL (connection code in `src/db.js`)

## Project Layout (top-level `src/`)
- `app.js` — application entry
- `db.js` — database connection
- `controllers/` — route handlers
- `services/` — business logic and integrations (includes `payments/` with MPESA and Stripe implementations)
- `models/` — data models
- `routes/` — route definitions
- `middlewares/` — auth, error handling, validation
- `validators/` — input schemas
- `docs/` — Swagger setup
- `tests/` — unit tests

## Setup & Run (development)
1. Open a terminal and change to the `src` folder:

	cd src

2. Install dependencies:

	npm install

3. Create a `.env` file with the required environment variables (DB connection, `JWT` secret, MPESA/Stripe credentials). See `src/db.js` and `src/utils/jwt.js` for hints about expected values.

4. Start the dev server (uses `nodemon`):

	npm run dev

The dev server exposes the API and the Swagger docs at `/docs`.

## Tests
Unit tests live in `src/tests`. Run your test runner if configured (e.g., `npm test` if a script exists).

## Notes / Next steps
- Add an example `.env.example` with required variables.
- Expand unit/integration tests and enable a CI workflow.
- Add DB migrations and seed scripts for easier local setup.
- Harden input validation and add rate limiting for production readiness.

