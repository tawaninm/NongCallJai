# Recommended Project Structure

## Full target structure

```txt
caregohospital/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── patients/
│   │   │   ├── cases/
│   │   │   ├── ai-followup/
│   │   │   ├── care-plans/
│   │   │   ├── medication/
│   │   │   ├── appointments/
│   │   │   ├── family/
│   │   │   ├── reports/
│   │   │   └── agents/
│   │   └── lib/
│   └── api/
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── patients/
│           │   ├── cases/
│           │   ├── ai-followups/
│           │   ├── care-plans/
│           │   ├── medication/
│           │   ├── appointments/
│           │   ├── family/
│           │   ├── reports/
│           │   └── agents/
│           ├── middleware/
│           ├── services/
│           └── index.ts
├── packages/
│   ├── shared/
│   └── ui/
├── prisma/
├── docs/
└── .agents/
```

## If staying with current single-app prototype

Use this structure first:

```txt
src/
  features/
  components/
  lib/
  mock/
server/
  src/
prisma/
```

Do not block product progress on a full migration. Make it easy to migrate later.
