# Workflow: Prisma Database

Purpose: add PostgreSQL + Prisma readiness.

## Steps

1. Add Prisma dependency if missing.
2. Create prisma/schema.prisma.
3. Add core models from database model rule.
4. Add seed data based on CareGo mock patients.
5. Add scripts: db:generate, db:migrate, db:seed.
6. Create repository functions.
7. Keep frontend mock data until API integration is stable.

## Acceptance Criteria

- Prisma schema validates.
- Seed data creates users, patients, care plans, cases, AI conversations.
- Express services can query seeded data.
