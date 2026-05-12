# Patch Log

Current version: v0.1.0

## v0.1.0 - 2026-05-12

Type:
Docs / UI / Feature / Safety

Summary:

- Merged the AI agent Markdown source pack into the main repository.
- Updated old Markdown files to the current CareGo Hospital Platform direction.
- Added visible Patch Log / อัปเดต UI for Admin users.
- Refreshed command-center styling and version labels to v0.1.0.

Updated Markdown files:

- AGENTS.md
- GEMINI.md
- AI_AGENT_README.md
- DESIGN.md
- README.md
- .agents/rules/00-project-brief.md
- .agents/rules/01-target-architecture.md
- .agents/rules/02-frontend-ui-rules.md
- .agents/rules/03-backend-api-rules.md
- .agents/rules/04-database-model.md
- .agents/rules/05-rbac-role-rules.md
- .agents/rules/06-healthcare-ai-safety.md
- .agents/rules/07-feature-map-v2.md
- .agents/rules/08-implementation-checklist.md
- .agents/workflows/role-based-login.md
- .agents/workflows/dashboard-v2.md
- .agents/workflows/api-express-setup.md
- .agents/workflows/prisma-database.md
- docs/API_CONTRACTS.md
- docs/DATA_MODEL_OVERVIEW.md
- docs/PROJECT_STRUCTURE.md
- docs/CHANGELOG.md
- docs/PATCH_LOG.md

Updated app files:

- src/lib/patch-log.ts
- src/components/AppSidebar.tsx
- src/routes/patch-log.tsx
- src/routes/\_\_root.tsx
- src/routes/index.tsx
- src/routes/dashboard.tsx
- src/routeTree.gen.ts
- src/styles.css

Verification:

- Build/lint result: Passed: `npm run format`, `npm run lint` (9 Fast Refresh warnings), `npm run build`, browser smoke check.
- Known issues: no backend database/API migration in this pass; prototype remains frontend/mock-store based.
