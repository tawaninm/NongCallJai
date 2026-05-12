# AI Agent README

This repository includes an AI-agent source pack merged from:

D:\Intern\caregohospital\carego-antigravity-agent-pack

Use these files to help Codex, Gemini, Antigravity, and other AI coding agents understand CareGo before modifying code.

## Folder Structure

- AGENTS.md: primary entry point for AI coding agents.
- GEMINI.md: Gemini-specific guardrails.
- DESIGN.md: CareGo design-system source of truth.
- .agents/rules/: canonical implementation rules.
- .agents/workflows/: task-specific execution guides.
- docs/: developer-facing architecture, API, data model, changelog, and patch log docs.

## Current and Future Stack

Current app reality: Vite + TanStack Router + React + TypeScript + Tailwind CSS frontend prototype with mock data.

Preferred future stack: Next.js App Router frontend, Express.js TypeScript API, PostgreSQL, Prisma, Zod validation, shared packages, Radix/shadcn-style components, Lucide React, Recharts, and Sonner.

Do not destroy the current prototype while moving toward the target architecture. Prefer small, migration-ready improvements.

## Recommended First Tasks

1. Verify role-based login and menus.
2. Improve dashboard v2 role views.
3. Keep patient queue, detail, case, AI follow-up, medication, appointment, family, reports, and AI agent flows connected to mockStore.
4. Add backend/API readiness behind safe fallbacks.
5. Keep DESIGN.md and patch logs up to date.
