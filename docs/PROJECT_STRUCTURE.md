# Project Structure

Current repository structure is a Vite/TanStack/React app with an MVP Express API added under `apps/api`.

```txt
src/
  components/
    AppSidebar.tsx
    BotnoiChat.tsx
    CompatibilityBridge.tsx
  lib/
    auth-context.tsx
    patch-log.ts
    voicemed-data.ts
    voicemed-store.ts
  routes/
    index.tsx
    pricing.tsx
    checkout.tsx
    onboarding.tsx
    dashboard.tsx
    elder-profiles.tsx
    elder-profiles.$elderId.tsx
    bot-settings.tsx
    care-plans.tsx
    call-history.tsx
    alerts.tsx
    reports.tsx
    billing.tsx
    settings.tsx
    patch-log.tsx
    line-connect.tsx
    waiting-setup.tsx
    admin.customers.tsx
apps/
  api/
    src/
      contracts.ts
      server.ts
      store.ts
    tsconfig.json
prisma/
  schema.prisma
```

Compatibility routes exist for old CareGo paths and should guide users to VoiceMed pages.

The MVP API uses Express routes under `/api`, Zod validation, and an in-memory development store. `prisma/schema.prisma` defines the intended PostgreSQL data model for production database work.
