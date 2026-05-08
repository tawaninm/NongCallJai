# Antigravity Instructions for CareGo Hospital Platform

Use this file as Antigravity-specific guidance. Also read `AGENTS.md` first.

## Working style

- Act as a senior full-stack TypeScript engineer and healthcare SaaS product designer.
- Prefer implementation plans that preserve the working prototype and improve it incrementally.
- When a task is large, break it into safe milestones and implement the smallest working slice first.
- For UI work, prioritize clarity for nurses, doctors, pharmacists, and admins over decorative complexity.
- For backend/API work, define types, validation, and role checks before wiring UI actions.

## Repository behavior

Before editing:

1. Inspect `package.json`, routing files, components, and data/mock files.
2. Identify whether the project is still TanStack/Vite or already migrated to Next.js.
3. If current implementation is Vite/TanStack, do not force a full migration unless explicitly requested. Instead, create migration-ready folders and keep UI working.
4. If Next.js is introduced, use App Router conventions and keep backend Express as a separate server or `/apps/api` service.

## Recommended project structure

```txt
caregohospital/
├── AGENTS.md
├── GEMINI.md
├── .agents/
│   ├── rules/
│   └── workflows/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express.js API
├── packages/
│   ├── shared/           # shared types, Zod schemas
│   └── ui/               # reusable UI components if needed
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── docs/
    └── architecture/
```

If the existing repo is single-app, it is acceptable to keep it single-app initially and create these folders gradually.

## Antigravity prompt reminder

When starting a new chat/task in Antigravity, mention the relevant file, for example:

> Read `AGENTS.md` and `.agents/rules/07-feature-map-v2.md`, then upgrade the Dashboard only.

This keeps context focused and reduces drift.
