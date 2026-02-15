# 04 — API Contracts

Base URL: `/api`
Auth:
- App endpoints: Supabase session/JWT.
- Inbound endpoint: `Authorization: Bearer <inbound_token>`.

## 1) Inbound lead ingestion
### `POST /api/inbound/leads`
Create lead from external source and enqueue follow-up.

**Request body**
```json
{
  "source": "facebook_ads",
  "source_event_id": "evt_123",
  "first_name": "Sam",
  "last_name": "Rivera",
  "email": "sam@example.com",
  "phone": "+15551234567",
  "notes": "Requested quote for furnace replacement"
}
```

**Responses**
- `202 Accepted`
```json
{ "lead_id": "uuid", "message_id": "uuid", "status": "queued" }
```
- `409 Conflict` when duplicate `source_event_id` for same source/company.
- `401 Unauthorized` invalid/rotated token.
- `422 Unprocessable Entity` invalid payload.

---

## 2) Leads
### `GET /api/leads?status=&page=&page_size=`
Returns paginated tenant leads.

### `POST /api/leads`
Manual lead creation from UI.

### `PATCH /api/leads/:id`
Update status, notes, or won value.

**PATCH request**
```json
{
  "status": "qualified",
  "won_value": 0,
  "notes": "Left voicemail"
}
```

---

## 3) Templates
### `GET /api/templates`
List tenant templates.

### `POST /api/templates`
Create template.

### `PATCH /api/templates/:id`
Update template.

### `DELETE /api/templates/:id`
Delete template (unless in use by policy choice).

---

## 4) Settings
### `GET /api/settings`
Returns inbound token metadata and messaging config status.

### `POST /api/settings/inbound-token/rotate`
Rotates token; previous token is invalidated immediately.

**Response**
```json
{
  "token": "lp_live_xxx",
  "created_at": "2026-01-10T12:00:00Z"
}
```

### `PATCH /api/settings/messaging-config`
Update flags (`sms_enabled`, `email_enabled`) and validation status.

---

## 5) Dashboard
### `GET /api/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`
Returns aggregated metrics.

**Response**
```json
{
  "leads_received": 124,
  "messages_sent": 111,
  "won_revenue": 48300.5,
  "avg_first_response_seconds": 43
}
```

---

## 6) Provider webhooks
### `POST /api/webhooks/twilio`
- Validates Twilio signature.
- Updates `messages.status` and provider payload.

### `POST /api/webhooks/resend`
- Validates webhook secret.
- Updates delivery/bounce state in `messages.provider_payload`.
