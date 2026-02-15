# 02 — Technical Architecture

## Recommended stack
- **Frontend/App**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Auth + DB**: Supabase (Postgres + Auth + RLS).
- **Background jobs**: Trigger.dev or Supabase queue pattern (edge functions + retry) for outbound messaging.
- **Messaging providers**:
  - SMS: Twilio (primary)
  - Email: Resend (fallback/default email channel)
- **Hosting**: Vercel for Next.js app.

## High-level components
1. **Web App (Next.js)**
   - Public landing page
   - Auth pages
   - Protected dashboard/leads/settings
2. **API layer (Next.js route handlers)**
   - Inbound lead endpoint
   - Leads CRUD/status
   - Template/settings endpoints
3. **Database (Supabase Postgres)**
   - Multi-tenant schema
   - RLS policies
   - Audit/event tables
4. **Worker / Job runner**
   - Consumes queued outbound messages
   - Calls Twilio/Resend
   - Updates message status

## Data flow
1. Lead source submits payload to `/api/inbound/leads` with company token.
2. API validates token + payload, inserts `leads`, creates `messages` row with `queued`.
3. Worker sends message, updates `messages.status`, persists provider IDs.
4. UI reads leads/messages via server-side queries scoped by tenant.
5. Dashboard aggregates metrics with SQL views/functions.

## Security model
- Supabase Auth for user identity.
- `profiles` links users to `company_id`.
- Every tenant table includes `company_id` + RLS policy.
- Inbound token stored hashed; only a one-time plaintext reveal on create/rotate.

## Deployment environments
- `local`: `.env.local` + Supabase local/dev project.
- `staging`: separate Supabase + Twilio/Resend test credentials.
- `production`: isolated keys, strict webhook signature validation, alerting.

## Key environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `RESEND_API_KEY`
- `APP_BASE_URL`
- `INBOUND_TOKEN_PEPPER`
