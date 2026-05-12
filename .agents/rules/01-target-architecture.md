# Target Architecture

## Current Reality

The current repository is a Vite + TanStack Router + React + TypeScript frontend prototype. Keep it working. Do not migrate to Next.js unless explicitly requested.

## Preferred Future Stack

- Frontend: Next.js App Router + React + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- UI: Tailwind CSS, Radix/shadcn-style components, Lucide React, Recharts, Sonner
- Auth: mock role session for prototype, JWT/session auth for backend-ready version

## Target Monorepo Structure

```text
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
docs/
.agents/
```

## Transitional Prototype Structure

```text
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

## Boundary Rules

- UI components must not contain clinical risk rules directly.
- Express routes should delegate to service functions.
- Services should be testable without HTTP.
- Shared types should live in packages/shared or src/lib/types during prototype.
- API responses should be predictable and typed.
- Server-side role checks are required for protected actions.
- Never expose secrets, API keys, database URLs, or patient-sensitive data in frontend code.
