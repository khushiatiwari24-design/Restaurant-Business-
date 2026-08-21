# DilYum Backend (NestJS)

Phase 1: PostgreSQL + Prisma + Super Admin JWT authentication.

## Quick start

```bash
# 1) Start Postgres (Docker maps host port 5433 → container 5432)
npm run db:up

# 2) Install deps (if needed)
npm install

# 3) Migrate + seed Super Admin
npx prisma migrate dev --name init
npm run prisma:seed

# 4) Run API (http://localhost:3001/api/v1)
npm run start:dev
```

> Note: Postgres is exposed on **5433** by default so it does not conflict with a local Postgres install on 5432.
## Auth endpoints

- `POST /api/v1/auth/admin/login`
- `GET  /api/v1/auth/me` (Bearer JWT)
- `POST /api/v1/auth/logout` (Bearer JWT)

## Super Admin seed

Configured via `.env`:

- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`

Password is bcrypt-hashed before insert. Never stored as plaintext.
