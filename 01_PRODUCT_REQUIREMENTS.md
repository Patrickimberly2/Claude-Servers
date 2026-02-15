# 01 — Product Requirements (MVP)

## 1) Functional requirements

### 1.1 Authentication & tenancy
- Users can sign up/sign in with email + password.
- Each user belongs to exactly one company for MVP.
- Company data must be isolated from other companies.

### 1.2 Lead ingestion
- System provides a company-scoped inbound token.
- External systems can POST lead data to `/api/inbound/leads` with bearer token.
- Required lead fields: `name` (or `first_name`/`last_name`), at least one contact method (`email` or `phone`).
- Deduplicate obvious retries using `source_event_id` when provided.

### 1.3 Lead management
- Users can view leads in reverse chronological order.
- Users can manually add leads from UI.
- Users can update lead status (`new`, `attempted`, `contacted`, `qualified`, `won`, `lost`).
- Lead detail shows contact info, source, created timestamp, and outbound message log.

### 1.4 Follow-up automation
- On valid lead creation, enqueue a first-touch outbound message.
- Channel preference: SMS if valid phone exists and SMS is enabled; otherwise email if email is enabled.
- Use template variables (e.g., `{{lead_name}}`, `{{company_name}}`).
- Persist message attempt status (`queued`, `sent`, `failed`) and provider response metadata.

### 1.5 Dashboard
- Show metrics for selected range (default current month):
  - Leads received
  - Messages sent
  - Won revenue (sum of `won_value`)
  - Basic response-time proxy (lead created to first sent message)

### 1.6 Settings
- View/copy/rotate inbound token.
- CRUD follow-up templates.
- Show messaging provider connection state (configured/not configured, last validation timestamp).

---

## 2) Non-functional requirements
- Security: enforce row-level isolation for all tenant data.
- Reliability: inbound endpoint is idempotent with retry safety.
- Performance: p95 API latency under 500ms excluding provider network delays.
- Observability: structured logs + event table for key actions.

---

## 3) MVP acceptance tests
1. New company signup creates isolated workspace and token.
2. Posting a valid lead triggers a message attempt within 60 seconds.
3. Lead appears in list and can transition through all statuses.
4. Dashboard metrics reflect ingested leads/messages.
5. Rotating inbound token invalidates old token immediately.
