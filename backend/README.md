# DilYum Backend (NestJS)

Phase 1–2: Super Admin auth + real Restaurant creation.

## Quick start

```bash
# Point DATABASE_URL at your Postgres DB (e.g. Restaurant_DB on :5432)
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

API: `http://localhost:3001/api/v1`

## Auth

- `POST /api/v1/auth/admin/login`
- `POST /api/v1/auth/restaurant/login`
- `GET  /api/v1/auth/me`
- `POST /api/v1/auth/logout`

## Admin restaurants (SUPER_ADMIN JWT)

- `GET    /api/v1/admin/restaurants`
- `GET    /api/v1/admin/restaurants/plans`
- `POST   /api/v1/admin/restaurants`
- `GET    /api/v1/admin/restaurants/:id`
- `PATCH  /api/v1/admin/restaurants/:id/suspend`
- `PATCH  /api/v1/admin/restaurants/:id/activate`

## Public

- `GET /api/v1/public/restaurants`
- `GET /api/v1/public/restaurants/:slug`

## Seed only

- Super Admin (from `.env`)
- Subscription plans: FREE / STARTER / PROFESSIONAL / ENTERPRISE

No demo restaurants are seeded.
