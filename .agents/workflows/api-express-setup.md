# Workflow: Vercel Express API

Purpose: maintain the Express API that gradually replaces frontend mock data and runs on Vercel Serverless.

Steps:

1. Add Express TypeScript API only when requested.
2. Keep frontend mock fallback.
3. Add `/api/health`.
4. Add family account, elder profile, bot config, call log, alert, report endpoints.
5. Validate with Zod.
6. Authorize by family role.
7. Keep the serverless entrypoint under `api/backend.ts`.
8. Cache Mongoose connections and use `MONGODB_URI` for MongoDB Atlas.

Acceptance:

- No UI break if API unavailable.
- No secrets exposed.
