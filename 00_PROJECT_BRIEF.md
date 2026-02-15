# 00 — Project Brief

## Product
**LeadPulse**: instant lead follow-up for contractors.

## Problem
Small and mid-sized contractor teams lose deals because inbound leads are contacted too slowly, inconsistently, or not at all outside normal office hours.

## Target users
- Home services contractors (HVAC, plumbing, electrical, roofing, remodeling)
- Owner-operators or small office teams
- Companies handling leads from web forms, ads, and referral channels

## MVP value proposition
When a new lead arrives, LeadPulse captures it, sends an immediate first-touch message, and gives the team a lightweight dashboard to track follow-up status and conversion.

## MVP scope (must have)
1. Authenticated multi-tenant workspace by company.
2. Inbound lead ingestion endpoint (token-authenticated).
3. Lead list with status updates.
4. Automated first follow-up message (SMS or email, based on available contact).
5. Dashboard with core KPIs (lead volume, response time proxy, messages sent).
6. Basic settings (inbound token, message templates, messaging provider config status).

## Non-goals (for MVP)
- Full CRM replacement.
- Complex workflow builders.
- AI conversation agent.
- Native mobile app.
- Deep attribution analytics.

## Success criteria
- Median time-to-first-outreach under 60 seconds for valid inbound leads.
- 90%+ successful delivery attempts when provider credentials are valid.
- Team can create account, ingest a lead, and see delivery + status updates in under 15 minutes.

## Constraints
- Prefer managed services to reduce ops burden.
- Secure tenant isolation and auditable events.
- Fast implementation timeline (1–2 weeks build for MVP baseline).
