# QuitTogether

A Next.js app for micro-donations tied to recovery milestones using Interledger Open Payments.

## Getting Started

1. Copy env:
```bash
cp .env.example .env
```
2. Start infra (Postgres + Redis):
```bash
docker compose up -d
```
3. Install deps and generate Prisma client:
```bash
npm ci
npx prisma generate
```
4. Run migrations and seed:
```bash
npx prisma migrate dev --name init
npm run seed
```
5. Dev server:
```bash
npm run dev
```
Open `http://localhost:3000`.

## Open Payments Keys
- Set `OP_CLIENT_WALLET_ADDRESS`, `OP_CLIENT_KEY_ID`, `OP_CLIENT_PRIVATE_JWK` in `.env`.
- Public JWKS available at `/.well-known/jwks.json` and `/api/jwks`.

## Worker
```bash
npm run worker
```

## Demo users
- donor1@example.com, donor2@example.com
- rec1@example.com, rec2@example.com
- mentor@example.com, admin@example.com

Use Auth email link; the verification URL is logged to the terminal in dev.
