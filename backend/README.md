# DilYum Backend (NestJS)

Phase 1–3: Super Admin auth, restaurants (create / soft-delete), restaurant dishes.

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
- `DELETE /api/v1/admin/restaurants/:id` (soft delete → `deletedAt` + `ARCHIVED`)

## Restaurant portal menu (JWT + membership; restaurant from token)

- `GET    /api/v1/restaurants/me/categories`
- `GET    /api/v1/restaurants/me/dishes`
- `POST   /api/v1/restaurants/me/dishes`
- `GET    /api/v1/restaurants/me/dishes/:id`
- `PATCH  /api/v1/restaurants/me/dishes/:id`
- `DELETE /api/v1/restaurants/me/dishes/:id`

## Public

- `GET /api/v1/public/restaurants`
- `GET /api/v1/public/restaurants/:slug` (includes published dishes)

## Seed only

- Super Admin (from `.env`)
- Subscription plans: FREE / STARTER / PROFESSIONAL / ENTERPRISE

No demo restaurants or dishes are seeded.
