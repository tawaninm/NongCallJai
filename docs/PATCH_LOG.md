# Patch Log

Current version: v0.3.3

## v0.3.3 - 2026-05-18

Type:
Backend / Automation / Integration / Docs

Summary:

- Added API config loading from `.env.local` with placeholder detection so local and deployed secrets stay outside tracked files.
- Added LINE Messaging API webhook verification using `x-line-signature` and the Messaging API channel secret.
- Added backend LINE push delivery for queued notification payloads through the LINE Messaging API channel access token.
- Added LIFF client completion for scanned QR links so LINE profile data can complete one-time line linking automatically.
- Added `/api/line/push-test` to queue a safe test notification for a linked customer.
- Extended API Manager endpoint docs with copyable sample headers for webhook-style integrations.
- Documented required environment values for LIFF, LINE Login, LINE Messaging API, public webhook URL, OA add-friend URL, and Botnoi webhook credentials.

Updated Markdown files:

- .env.example
- docs/API_CONTRACTS.md
- docs/CHANGELOG.md
- docs/PATCH_LOG.md

Updated app files:

- apps/api/src/config.ts
- apps/api/src/contracts.ts
- apps/api/src/server.ts
- apps/api/src/store.ts
- package.json
- package-lock.json
- src/lib/mvp-api.ts
- src/lib/patch-log.ts
- src/routes/admin.api-manager.tsx
- src/routes/line-connect.tsx

Verification:

- Lint: passed with `npm run lint` and 9 existing fast-refresh warnings.
- API TypeScript: passed with `npx tsc -p apps/api/tsconfig.json --noEmit`.
- Build: passed with `npm run build`; Vite reported the existing large chunk warning.
- API smoke: passed `GET /api/health`, `GET /api/admin/api-endpoints`, LINE webhook missing-signature `401`, valid signed LINE webhook event, `/api/line/push-test`, and `/api/admin/automation/run-now`.
- Browser QA: passed `/admin/api-manager` showing copyable Headers, `/api/line/webhook`, `/api/line/push-test`, and the automation queue on `http://127.0.0.1:5173`.
- Dependency install: `npm install @line/liff` completed; npm reported 9 moderate audit warnings.
- Formatting: targeted Prettier applied to changed code/docs; `.env.example` was skipped because Prettier has no inferred env parser in this setup.

## v0.3.2 - 2026-05-18

Type:
Feature / Backend / Automation / UI / Data

Summary:

- Added seamless LINE QR connection on `/line-connect` with generated QR, countdown, status polling, QR refresh, and automatic continuation after link success.
- Added automation job contracts, in-memory job queue support, and admin endpoints for queue listing, retry, cancel, run-now, and health checks.
- Added internal `/admin/api-manager` route to copy endpoint paths, sample POST bodies, and cURL examples for Web, LINE QR, Voicebot/Botnoi, and Automation teams.
- Extended Prisma schema for future production persistence of automation jobs, API clients, API request logs, LINE profile metadata, and LINE notification delivery status.

Updated Markdown files:

- docs/API_CONTRACTS.md
- docs/CHANGELOG.md
- docs/PATCH_LOG.md

Updated app files:

- apps/api/src/contracts.ts
- apps/api/src/server.ts
- apps/api/src/store.ts
- prisma/schema.prisma
- src/components/AppSidebar.tsx
- src/lib/mvp-api.ts
- src/lib/patch-log.ts
- src/routes/admin.api-manager.tsx
- src/routes/line-connect.tsx
- vite.config.ts
- package.json
- package-lock.json

Verification:

- Lint: passed with `npm run lint` and 9 existing fast-refresh warnings.
- API TypeScript: passed with `npx tsc -p apps/api/tsconfig.json --noEmit`.
- Build: passed with `npm run build`; Vite reported the existing large chunk warning.
- API smoke: passed `GET /api/health`, `GET /api/admin/api-endpoints`, and `GET /api/admin/automation/health` on `http://localhost:8787`.
- Browser QA: passed checkout -> onboarding -> LINE connect QR render, and `/admin/api-manager` endpoint/queue display at `http://127.0.0.1:5173`.
- Dependency install: `npm install qrcode @types/qrcode express` completed; npm reported 9 moderate audit warnings.

## v0.3.1 - 2026-05-18

Type:
UI / Design System / Safety

Summary:

- Reworked the public landing page into the Warm Care Companion visual direction with a split hero, product preview, care-thread flow, trust strip, safety panel, pricing preview, FAQ, and structured footer CTA.
- Replaced the Figma-export package carousel and footer image dependency with responsive HTML sections and reusable pricing cards.
- Reworked `/pricing` to use the same canonical `MarketingPricingCards` component as the landing page.
- Updated shared VoiceMed visual tokens toward a premium care palette with mint, forest, sky, peach, amber, and LINE green accents.
- Recolored the Botnoi chat widget from purple to the VoiceMed green system.

Updated Markdown files:

- DESIGN.md
- docs/CHANGELOG.md
- docs/PATCH_LOG.md

Updated app files:

- src/components/marketing/MarketingPricingCards.tsx
- src/components/BotnoiChat.tsx
- src/routes/index.tsx
- src/routes/pricing.tsx
- src/styles.css
- src/lib/patch-log.ts

Verification:

- Lint: passed with `npm run lint` and 9 existing fast-refresh warnings.
- Build: passed with `npm run build`.
- Browser QA: checked landing and pricing at `http://127.0.0.1:8080`; desktop screenshots rendered, mobile DOM/overflow checks passed with no horizontal overflow at 390px width.

## v0.3.0 — 2026-05-17

Type:
Feature / UI / Backend / Docs / Safety

Summary:

- Updated VoiceMed public flow to a Figma-first NongCallJai MVP focused on selling packages, collecting service requests, connecting LINE, and preparing Botnoi/LINE handoff data.
- Added Express API skeleton, Prisma PostgreSQL schema, API contracts, frontend API fallback client, LINE connect page, waiting setup page, and internal admin customer queue.
- Updated design system and agent rules to reflect BOTNOI green tokens, mascot usage, and the rule that call feedback is sent through LINE OA rather than shown on the family-facing website.
- Clarified that Codex should only pull bitmap/image assets from Figma when the user explicitly requests it or provides final web-ready exports.
- Reworked the landing page against the Figma `Landing / Desktop` direction so the hero phone preview, flow cards, family reason cards, package banner, mascot quote section, and dark footer banner use the intended mascot/component imagery.
- Added Figma-exported package banners, footer banner, Mascot, and icon/sticker assets into `public/assets/nongcalljai/figma/` and wired them into the landing page.
- Refined the landing from a fixed 1440px design canvas into a real website layout with max-width sections, desktop positioning based on Figma, and responsive fallbacks.

Updated Markdown files:

- DESIGN.md
- .agents/rules/00-project-brief.md
- .agents/rules/02-frontend-ui-rules.md
- .agents/rules/03-backend-api-rules.md
- docs/API_CONTRACTS.md
- docs/PROJECT_STRUCTURE.md
- docs/CHANGELOG.md
- docs/PATCH_LOG.md

Updated app files:

- apps/api/src/\*
- apps/api/tsconfig.json
- prisma/schema.prisma
- src/lib/mvp-api.ts
- src/components/AppSidebar.tsx
- src/components/NongCallJaiMascot.tsx
- src/routes/index.tsx
- src/routes/pricing.tsx
- src/routes/checkout.tsx
- src/routes/onboarding.tsx
- src/routes/line-connect.tsx
- src/routes/waiting-setup.tsx
- src/routes/admin.customers.tsx
- src/routes/dashboard.tsx
- src/routes/\_\_root.tsx
- src/styles.css
- package.json
- package-lock.json

Verification:

- Lint: passed with `npm run lint` and 9 existing fast-refresh warnings.
- Build: passed with `npm run build`.
- API TypeScript: passed with `npx tsc -p apps/api/tsconfig.json --noEmit`.
- API smoke: passed `GET http://localhost:8787/api/health`.
- Formatting: targeted Prettier run passed for changed files except `prisma/schema.prisma`, which has no parser in the current Prettier setup.

## v0.2.0 — 2026-05-12

Type:
Feature / UI / Docs / Safety / Data

Summary:

- Rebranded CareGo Hospital Platform into VoiceMed B2C AI Voice Companion.
- Added subscription landing, pricing, mock checkout, onboarding, family dashboard, elder profiles, bot settings, care templates, call history, alerts, reports, billing, and settings.
- Updated docs and design system for B2C-first direction.

Verification:

- Format: passed with `npm run format`.
- Lint: passed with `npm run lint` and 9 existing fast-refresh warnings.
- Build: passed with `npm run build`.
- Browser smoke check: passed for landing, pricing, checkout, and dashboard at `http://127.0.0.1:5173`.
- Known issues: payment and Botnoi backend integrations are mock/prototype only.

## v0.1.0 — 2026-05-12

Type:
Docs / UI / Feature

Summary:

- Added AI agent documentation and hospital command-center prototype.
- Superseded by v0.2.0.
