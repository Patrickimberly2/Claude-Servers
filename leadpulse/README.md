# LeadPulse MVP (Next.js + Supabase)

Production-oriented MVP implementing:
- Supabase auth + RLS-friendly data model
- Leads CRUD APIs + dashboard UI
- Settings token view/rotation
- Inbound lead webhook guarded by inbound token
- Follow-up queue auto-created when leads are created
- Cron endpoint to send follow-ups (Twilio + Resend)
- Stripe checkout + signature-verified webhook billing sync

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file and fill values:
   ```bash
   cp .env.example .env.local
   ```
3. Apply SQL schema in Supabase SQL editor:
   - `supabase/schema.sql`
4. Run dev server:
   ```bash
   npm run dev
   ```

## Local commands

- `npm run dev` - start dev app
- `npm run lint` - lint project
- `npm run test` - run Vitest tests
- `npm run build` - production build

## API endpoints

- `GET/POST /api/leads`
- `GET/PATCH/DELETE /api/leads/:id`
- `GET/POST /api/settings/inbound-token`
- `POST /api/inbound`
- `POST /api/cron/followups` (requires `Authorization: Bearer <CRON_SECRET>`)
- `POST /api/billing/checkout`
- `POST /api/billing/webhook` (Stripe signature verified)
