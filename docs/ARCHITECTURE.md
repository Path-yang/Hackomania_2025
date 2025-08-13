# Architecture

- App: Next.js App Router, RSC where possible. Auth via NextAuth Email provider.
- DB: PostgreSQL with Prisma.
- Queue: Redis + BullMQ worker `worker/index.ts` for processing milestone payouts.
- Open Payments: `lib/openpayments/client.ts` initializes the client with HTTP signatures and GNAP grants.

## Open Payments Flow (fixed receive)
1. Recipient connects wallet → app requests interactive grant for `incoming-payment:create/read`.
2. Donor connects wallet → app requests grants for `quote:create/read` and `outgoing-payment:create/read`.
3. When milestone is verified:
   - Create incoming-payment on recipient with exact incoming amount.
   - Create quote on donor with `receiver = incomingPayment.url` and `receiveAmount`.
   - Create outgoing-payment on donor referencing the quote.
   - Persist all OP resource IDs in `Donation` rows.

JWKS served at `/.well-known/jwks.json` and `/api/jwks`. 