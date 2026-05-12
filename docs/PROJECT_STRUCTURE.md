# Project Structure

## Current Prototype

```text
src/
  components/
  components/ui/
  components/prototype/
  lib/
    auth-context.tsx
    mock-data.ts
    mock-store.ts
    patch-log.ts
  routes/
    index.tsx
    dashboard.tsx
    patch-log.tsx
    patients.tsx
    patients.index.tsx
    patients.$patientId.tsx
    cases.tsx
    ai-followup.tsx
    care-plans.tsx
    medication.tsx
    appointments.tsx
    family.tsx
    reports.tsx
    ai-agents.tsx
    settings.tsx
  styles.css
```

The current app is Vite + TanStack Router + React + TypeScript. Keep this structure working until an explicit migration is requested.

## Future Target

```text
apps/web/app
apps/web/components
apps/web/features
apps/web/lib
apps/api/src/modules
apps/api/src/middleware
apps/api/src/routes
apps/api/src/services
apps/api/src/db
packages/shared/src
packages/ui
prisma
docs
.agents
```

## Migration Guidance

Prefer incremental feature folders inside src first. Move shared contracts into src/lib/types or packages/shared only when the project is ready. Keep mock data clearly named and replace it gradually with API clients plus safe fallbacks.
