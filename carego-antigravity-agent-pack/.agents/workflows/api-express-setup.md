# Workflow — Express API Setup

## Context files to read

- `AGENTS.md`
- `.agents/rules/01-target-architecture.md`
- `.agents/rules/03-backend-api-rules.md`
- `.agents/rules/04-database-model.md`
- `.agents/rules/06-healthcare-ai-safety.md`

## Task

Create an Express.js backend API that can replace frontend mock data gradually.

## Steps

1. Inspect current project package manager and structure.
2. Create `apps/api` or `server` depending on current repo layout.
3. Add Express TypeScript setup.
4. Add health route: `GET /api/health`.
5. Add mock routes for patients, cases, AI followups, care plans.
6. Add Zod validation.
7. Add role middleware stub.
8. Add service layer.
9. Add audit log service stub.
10. Connect frontend via API client but keep mock fallback.

## Acceptance criteria

- API runs locally.
- Frontend can call health and patients endpoint.
- API response shape is consistent.
- Role middleware exists even if demo-only.
- No UI breaks if API is unavailable.
