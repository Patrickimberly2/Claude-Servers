# 07 — Codex Prompt (copy/paste)

You are generating a production-ready MVP repository for **LeadPulse** using the provided spec files.

## Inputs you must follow
- `00_PROJECT_BRIEF.md`
- `01_PRODUCT_REQUIREMENTS.md`
- `02_TECH_ARCHITECTURE.md`
- `03_DB_SCHEMA.sql`
- `04_API_CONTRACTS.md`
- `05_UI_WIREFRAMES.md`
- `06_IMPLEMENTATION_PLAN.md`

## Required output
Create a full Next.js (App Router, TypeScript) project implementing the MVP with:
1. Supabase auth + tenant isolation.
2. SQL migrations matching `03_DB_SCHEMA.sql`.
3. API routes matching `04_API_CONTRACTS.md`.
4. UI pages matching `05_UI_WIREFRAMES.md`.
5. Messaging pipeline abstraction with Twilio/Resend providers.
6. Tests for ingestion, RLS-safe data access patterns, and message queue processing logic.

## Implementation constraints
- Use strict TypeScript.
- Use Zod for request validation.
- Use server actions or route handlers (no legacy pages router API routes unless justified).
- Keep secrets server-side only.
- Add clear README with setup instructions and `.env.example`.

## Deliverables checklist
- [ ] App builds successfully.
- [ ] Lint passes.
- [ ] Tests pass.
- [ ] Migrations are reproducible.
- [ ] Basic seed script for demo company and templates.

## Commands to run before finishing
1. Install dependencies.
2. Run lint.
3. Run tests.
4. Run build.
5. Print a concise summary of implemented features and any known gaps.
