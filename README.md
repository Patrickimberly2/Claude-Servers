# LeadPulse MVP Architecture Blueprint (for Codex)

This folder is a **spec pack** you can upload to Codex (Codex web / IDE extension / Codex CLI) so it can generate the MVP repo for you.

## What’s inside
- `00_PROJECT_BRIEF.md` – crisp problem, user, scope, success criteria
- `01_PRODUCT_REQUIREMENTS.md` – MVP requirements and non-goals
- `02_TECH_ARCHITECTURE.md` – recommended stack + components
- `03_DB_SCHEMA.sql` – Supabase/Postgres schema + RLS
- `04_API_CONTRACTS.md` – REST endpoints + webhook payloads
- `05_UI_WIREFRAMES.md` – lo-fi wireframes (ASCII + image)
- `06_IMPLEMENTATION_PLAN.md` – step-by-step build order + checks
- `07_CODEX_PROMPT.md` – copy/paste prompt to run in Codex
- `wireframe.txt` – lo-fi visual wireframe (text format for PR-friendly diffs)

## How to use with Codex
1. Upload this folder (zip) into Codex, or place it at repo root.
2. Start a Codex task using `07_CODEX_PROMPT.md` as the prompt.
3. Let Codex generate the full Next.js repo + run tests/build.

> Tip: Codex works best with a clear spec + explicit file outputs. See OpenAI Codex workflows and prompting guidance.
