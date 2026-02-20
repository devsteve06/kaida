# kaida
This is a full stack  project simulating a real world ecommerce website.
# Kaida

Monorepo for the Kaida e‑commerce application. This repository contains a Node/Express backend API and a Vite + React frontend.

## Features
- RESTful backend with controllers, services, models, routes and middlewares
- Payment integrations: Stripe and M-Pesa (payment factory + providers)
- Cart, checkout and order flows with payment processing and webhooks
- Vite + React frontend with pages, components and a small `api` service
- API docs and architecture notes in the backend

## Repository layout
- `backend/` — Express API source, controllers, services, models, routes, validators, middlewares and docs
- `frontend/` — Vite + React SPA source and static assets

Key backend folders:

- `backend/src/controllers` — request handlers
- `backend/src/services` — business logic and payment providers
- `backend/src/models` — data models
- `backend/src/routes` — route definitions
- `backend/src/middlewares` — auth, validation and error handling
- `backend/src/docs` — `ARCHITECTURE.md` and Swagger setup

## Getting started

Prerequisites:

- Node 18+ and npm/yarn
- A running database (Postgres, MySQL, etc.) as required by your configuration

Quick start (development):

1. Install dependencies for backend and frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

2. Create environment files:

- `backend/.env` (example variables)

```
PORT=5000
DATABASE_URL=postgres://user:pass@localhost:5432/kaida
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
```

- `frontend/.env` (example)

```
VITE_API_BASE_URL=http://localhost:4000/api
```

3. Run services in development:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Scripts

- Backend: `npm run dev`, `npm test`, `npm run start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Tests

Backend tests are located in `backend/tests/`. Run:

```bash
cd backend
npm test
```

## Documentation

See `backend/src/docs/ARCHITECTURE.md` for architecture notes and the Swagger setup for API docs in `backend/src/docs`.

## Contributing

Contributions are welcome. Please open issues or PRs describing the problem or feature. Follow existing code style and add tests for new behavior.

## License

See the repository `LICENSE` file for license information.
