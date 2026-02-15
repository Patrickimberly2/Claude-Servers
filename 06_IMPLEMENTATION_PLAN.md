# 06 — Implementation Plan

## Phase 0 — Project bootstrap
1. Create Next.js app with TypeScript + Tailwind.
2. Install Supabase client libraries.
3. Configure linting/formatting and CI checks.

**Check**: `pnpm lint && pnpm test && pnpm build` passes.

## Phase 1 — Auth + tenancy
1. Implement signup/login/logout with Supabase Auth.
2. On signup, create `companies` + `profiles` rows.
3. Add protected layout middleware.

**Check**: user can sign up and only see own tenant data.

## Phase 2 — Database + RLS
1. Apply `03_DB_SCHEMA.sql` migration.
2. Verify RLS with two test users from different companies.
3. Seed one default template per company on signup.

**Check**: cross-tenant reads/writes are denied.

## Phase 3 — Leads + inbound endpoint
1. Build `/api/inbound/leads` token auth and payload validation.
2. Add UI/manual lead creation and lead listing.
3. Implement duplicate protection via `(company_id, source, source_event_id)`.

**Check**: duplicate inbound event returns `409` and no extra row.

## Phase 4 — Messaging pipeline
1. Create queue worker for `messages` in `queued` state.
2. Integrate Twilio/Resend clients.
3. Persist provider IDs/status/errors.
4. Add webhook handlers for async delivery updates.

**Check**: end-to-end queued -> sent/failed state transition works.

## Phase 5 — Dashboard + settings
1. Build dashboard query endpoint and cards UI.
2. Implement template CRUD.
3. Implement inbound token rotate endpoint.
4. Display messaging config validation state.

**Check**: dashboard updates after ingest + status changes.

## Phase 6 — Hardening + release
1. Add request rate limits and audit events.
2. Add structured logging and error reporting.
3. Write smoke tests for critical flows.
4. Prepare production env docs and runbook.

**Check**: production checklist complete; staging sign-off complete.
