# CareGo Hospital Platform — AI Agent Rules

These rules are for AI coding agents working on **CareGo Hospital Platform**.

CareGo is a hospital-side AI care follow-up platform for elderly patients, chronic disease follow-up, post-discharge follow-up, medication follow-up, nurse triage, doctor review, pharmacist review, family notification, and AI agent orchestration.

## First step before coding

Before making changes, inspect the current repository structure and read these files when relevant:

- `.agents/rules/00-project-brief.md` — product vision and scope
- `.agents/rules/01-target-architecture.md` — recommended Next.js + Express.js + database architecture
- `.agents/rules/02-frontend-ui-rules.md` — frontend UI rules and design system
- `.agents/rules/03-backend-api-rules.md` — Express API rules and API contract style
- `.agents/rules/04-database-model.md` — database entities and relationships
- `.agents/rules/05-rbac-role-rules.md` — role-based access and dashboard behavior
- `.agents/rules/06-healthcare-ai-safety.md` — clinical safety and AI boundaries
- `.agents/rules/07-feature-map-v2.md` — Ver 2.0 feature requirements
- `.agents/rules/08-implementation-checklist.md` — acceptance checklist before finishing work

## Current repo context

The existing repository was generated from a Lovable prototype. It may currently use a Vite/TanStack/React stack. Do **not** delete working UI unless replacing it with an equivalent or better implementation.

Preferred target architecture for new implementation:

- Frontend: Next.js App Router + React + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript REST API
- Database: PostgreSQL with Prisma ORM
- Shared types: Zod schemas or shared TypeScript interfaces
- UI: Tailwind CSS, Radix/shadcn-style components, Lucide icons, Recharts, Sonner toasts

If the repo is not yet migrated to Next.js, implement incrementally and preserve the prototype.

## Product focus

The MVP must focus on hospital-side workflows:

1. Login with role selector
2. Role-based dashboard
3. Patient queue
4. Patient detail
5. AI follow-up results
6. Case management
7. Care plan templates
8. Medication follow-up
9. Appointment follow-up
10. Family notification
11. Reports
12. AI Agent Center
13. Admin settings and permissions

The first supported care plans should be:

- Hypertension / ความดันโลหิตสูง
- Type 2 Diabetes Mellitus / เบาหวานชนิดที่ 2
- Heart Failure / ภาวะหัวใจล้มเหลว

Medication follow-up is a cross-cutting feature across all care plans.

## Healthcare safety guardrails

The AI must never diagnose, prescribe, or directly instruct medical treatment.

The AI may only:

- Collect patient responses
- Transcribe and summarize conversations
- Extract symptoms, medication adherence, vital signs, and appointment status
- Classify protocol-based risk as Green / Yellow / Red
- Explain why a case was classified
- Escalate to human staff

Red or uncertain cases must require human review.

## Engineering rules

- Use TypeScript for all new code.
- Prefer small, composable components.
- Keep UI state separate from API/data logic.
- Do not hard-code business rules inside UI components; place care plan/risk rules in config, database, or service layer.
- Validate all API inputs with Zod or equivalent.
- Use role-based authorization checks on the server, not only in the UI.
- Never expose secrets, API keys, database URLs, or patient-sensitive data in frontend code.
- Use mock data only in clearly named files such as `mockPatients.ts` or `seed.ts`.
- When adding pages, keep navigation and breadcrumbs consistent.
- Add loading, empty, error, and success states.

## UX rules

The system is for busy hospital staff. Every screen should answer quickly:

- Who needs attention now?
- Why is this case risky?
- What should the human staff do next?
- Has the family been notified?
- Is the case closed or still pending?

Use Thai UI text for hospital users. Component names and code identifiers can be English.

## Done criteria for any feature

Before finishing, verify:

- The page works for the correct roles.
- The action updates visible state or API data.
- Toast/modals show clear feedback.
- Red/Yellow/Green risk colors are consistent.
- Patient/case links navigate correctly.
- Empty/loading/error states exist.
- No AI wording implies diagnosis or prescription.
