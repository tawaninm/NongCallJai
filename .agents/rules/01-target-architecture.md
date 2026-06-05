# 01 Target Architecture

Current app: Vite + TanStack Router + React + TypeScript + Tailwind CSS.

Do not migrate to Next.js unless explicitly requested.

Prototype boundaries:

- Frontend mock data in `src/lib/voicemed-data.ts`.
- Frontend mock state in `src/lib/voicemed-store.ts`.
- Public funnel routes and protected family platform routes.

Future backend:

- Express.js + TypeScript.
- MongoDB Atlas + Mongoose for the Vercel Serverless MVP backend.
- Zod validation.
- Typed API response shape under `/api`.
