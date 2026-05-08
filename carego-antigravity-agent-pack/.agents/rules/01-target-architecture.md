# 01 — Target Architecture

## Preferred target stack

- Frontend: Next.js App Router + React + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- UI: Tailwind CSS, Radix/shadcn-style components, Lucide React, Recharts, Sonner
- Auth: mock role session for prototype, JWT/session auth for backend-ready version

## Current repo reality

The current GitHub repository may still be Lovable-generated and use Vite/TanStack/React. The agent must inspect the repo before deciding whether to migrate.

Do not destroy the existing prototype. Prefer incremental changes.

## Recommended monorepo structure

```txt
apps/
  web/
    app/
    components/
    features/
    lib/
  api/
    src/
      modules/
      middleware/
      routes/
      services/
      db/
packages/
  shared/
    src/
      schemas/
      types/
      constants/
  ui/
prisma/
  schema.prisma
  seed.ts
```

## Transitional structure if repo is single-app

If migration is too large, keep the current app and create:

```txt
src/
  features/
    auth/
    dashboard/
    patients/
    ai-followup/
    cases/
    care-plans/
    medication/
    appointments/
    family/
    reports/
    agents/
  lib/
    api-client.ts
    rbac.ts
    mock-data.ts
server/
  src/
    index.ts
    routes/
    services/
    db/
prisma/
  schema.prisma
```

## Data flow

```txt
Next.js UI
→ API client
→ Express route
→ service layer
→ Prisma repository
→ PostgreSQL
```

AI integration flow:

```txt
Voicebot/Chatbot provider
→ webhook endpoint
→ AI conversation record
→ entity extraction
→ risk assessment service
→ case queue
→ notification service
→ audit log
```

## Boundary rules

- UI components must not contain clinical risk rules directly.
- Express routes should delegate to service functions.
- Services should be testable without HTTP.
- Shared types should live in `packages/shared` or `src/lib/types` during prototype.
- API responses should be predictable and typed.

## Suggested API base URL

Frontend uses:

```txt
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Backend uses:

```txt
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=...
```
