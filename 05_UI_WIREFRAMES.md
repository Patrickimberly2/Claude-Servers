# 05 — UI Wireframes (Lo-fi)

## Primary pages

### Landing (`/`)
- Product headline and value prop.
- Buttons: Log in / Sign up.

### Login / Signup (`/auth`)
- Email + password.
- Signup includes company name.

### Dashboard (`/dashboard`)
- KPI cards: Leads this month, Revenue won.
- Secondary KPIs: Avg response time, Sent messages.
- Recent activity feed (post-MVP enhancement target).

### Leads (`/leads`)
- Add Lead form.
- Leads table with quick status update.

### Settings (`/settings`)
- Inbound token copy/rotate.
- Follow-up template list/editor.
- Messaging provider config status.

## ASCII wireframe
```text
+-----------------------------+   +-----------------------------+
| Landing (/)                 |   | Login / Signup              |
| LeadPulse                   |   | Email                       |
| Instant lead follow-up      |   | Password                    |
| [Login] [Sign up]           |   | [Submit]                    |
+-----------------------------+   | Company (signup only)       |
                                  +-----------------------------+

+-----------------------------+   +-----------------------------+
| Dashboard (/dashboard)      |   | Leads (/leads)              |
| Cards: leads | revenue      |   | Add Lead form               |
| Later: response | sent msgs |   | Leads table                 |
| Recent activity (later)     |   | Status quick update         |
+-----------------------------+   +-----------------------------+

+---------------------------------------------------------------+
| Settings (/settings)                                           |
| Inbound token (copy/rotate)                                    |
| Follow-up templates list                                       |
| Messaging config (Twilio/Resend status)                        |
+---------------------------------------------------------------+
```

## Visual reference
See `wireframe.txt` in this folder (text-only to keep PR diffs fully renderable).
