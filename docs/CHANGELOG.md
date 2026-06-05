# Changelog

## v0.3.4 - 2026-06-05

### Added

- Added a dedicated Vercel backend function entrypoint for the Express API while preserving the existing TanStack Start SSR bridge for web routes.
- Added serverless-safe MongoDB Atlas/Mongoose connection caching and persistent Mongoose models for customers, elders, LINE links, Botnoi mappings, call feedback, notification payloads, automation jobs, and audit logs.
- Added Mongo-backed automation queue handling so jobs survive Vercel cold starts.

### Changed

- Routed `/api/*` to the new backend function and kept all other paths routed to the existing frontend SSR handler.
- Changed the frontend API client to use same-origin `/api` calls by default instead of the previous Render fallback URL.
- Updated environment docs and agent rules to use `MONGODB_URI` for MongoDB Atlas.
- Allowed Prettier to respect checked-out line endings so Windows CRLF files do not break lint.

### Notes

- Real MongoDB, LINE, and Botnoi values must be configured in Vercel environment variables, not committed files.
- Local DB-backed smoke tests require a real `MONGODB_URI`; non-DB API smoke tests passed without secrets.

## v0.3.3 - 2026-05-18

### Added

- Added `.env.local`-aware API configuration loading without committing real LINE or Botnoi secrets.
- Added LINE Messaging API webhook endpoint with `x-line-signature` verification.
- Added backend LINE push queue execution for notification payloads using the Messaging API channel access token.
- Added admin test endpoint to create a notification payload and queue backend LINE push delivery.
- Added LIFF client completion so QR scans can read the LINE profile and complete `/api/line/link/complete`.
- Added API Manager support for copyable sample headers, including LINE webhook signature headers.
- Added environment requirements for LIFF, LINE Login, LINE Messaging API, OA add-friend URL, public API base URL, and Botnoi webhook secret.

### Notes

- Real credentials must stay in `.env.local` or deployment secrets, not tracked files.
- The exposed development token should be rotated before production use.
- LINE webhook URL must be a public HTTPS URL ending in `/api/line/webhook`.

## v0.3.2 - 2026-05-18

### Added

- Added seamless LINE QR connect flow with generated QR code, link status polling, countdown, refresh, and automatic continuation after linking.
- Added MVP automation job contracts and in-memory queue endpoints for LINE/Botnoi handoff tasks.
- Added internal API Manager route for copying endpoint paths, sample request bodies, cURL examples, and reviewing automation jobs.
- Added Prisma models/fields for automation jobs, API clients, API request logs, LINE profile metadata, and notification delivery tracking.
- Added direct `express` runtime dependency for the MVP API server and QR generation packages for the LINE connect page.
- Added Vite dev proxy for `/api` to the Express API on `localhost:8787`.

### Notes

- LINE and Botnoi external credentials are still required before real push/call automation can run.
- Automation jobs that require LINE/Botnoi credentials are marked blocked in the development store until those integrations are configured.
- Family-facing web still does not expose call feedback, transcript, or audio directly.

## v0.3.1 - 2026-05-18

### Changed

- Reworked the public landing page into a warm care companion startup website with a calmer split hero, product preview, care-thread flow, trust strip, safety panel, FAQ, and structured footer CTA.
- Replaced the Figma-export package image carousel with responsive HTML pricing cards.
- Reworked `/pricing` to use the same canonical pricing card component as the landing page.
- Updated the visual system toward a premium healthcare/care palette with forest, mint, sky, peach, amber, and LINE green accents.
- Recolored the Botnoi chat widget from purple to the VoiceMed green system.

### Notes

- Large Figma-export package and footer images are no longer required by the landing page.
- The public copy keeps the healthcare AI safety boundary: NongCallJai asks, summarizes, and alerts family, but does not diagnose, prescribe, or adjust medication.

## v0.3.0 — 2026-05-17

### Added

- Added NongCallJai/BOTNOI Figma-first green design direction.
- Added MVP Express API skeleton under `apps/api`.
- Added Prisma PostgreSQL schema for customer, subscription, elder profile, LINE connection, Botnoi mapping, call feedback, notifications, and audit logs.
- Added LINE connect, waiting setup, and internal admin customer setup routes.
- Added frontend API client with local fallback for mock checkout, service onboarding, LINE link, and admin customer queue.

### Changed

- Refocused family-facing web flow to landing, pricing, mock checkout, service onboarding, LINE connect, and waiting setup.
- Updated public pages to use NongCallJai mascot-led green theme.
- Reworked the landing page to match the provided Desktop.png structure with hero phone preview, step cards, reason cards, centered package banner, mascot quote area, and dark footer call-to-action.
- Added Figma-exported Landing/Desktop package banners, footer banner, Mascot, and icon/sticker assets to the landing page after explicit approval to pull final imagery from Figma.
- Reworked the landing page from a fixed 1440px design canvas into a real responsive website layout with a max-width landing container, section-based flow, Figma-inspired desktop positioning, and mobile fallbacks.
- Clarified that Figma bitmap images are only pulled into the website when explicitly requested or when final web-ready exports are provided.
- Removed demo language from the main purchase flow.
- Hid call feedback/transcript/report concepts from the family-facing MVP web flow.
- Updated agent rules and API docs for the new web/Botnoi/LINE responsibility split.

### Notes

- Mock checkout remains the default.
- Botnoi schedule/calling and LINE OA push delivery are owned by separate teams.
- The MVP API uses an in-memory development store until PostgreSQL is configured.
- VoiceMed/NongCallJai does not diagnose, prescribe, or adjust medication.

## v0.2.0 — 2026-05-12

### Added

- Added VoiceMed B2C landing page.
- Added pricing, mock checkout, and onboarding flows.
- Added family dashboard.
- Added elder profiles and elder profile detail.
- Added Bot Settings for Botnoi Voicebot/Chatbot prototype management.
- Added care conversation templates.
- Added call history with transcript/summary view.
- Added family alerts.
- Added reports and mock billing.
- Added VoiceMed B2C mock data/store.

### Changed

- Rebranded visible product direction from CareGo Hospital Platform to VoiceMed.
- Changed primary audience from hospital staff to family caregivers.
- Updated design system to Liquid Glass + AI startup healthcare.
- Converted old hospital routes into compatibility bridges.
- Updated patch log to `v0.2.0`.

### Fixed

- Removed hospital-first navigation from the primary UI.
- Replaced unsafe clinical/hospital-first language on primary surfaces with family-safe wording.

### Notes

- Payment remains mock/prototype only.
- Botnoi integration remains configuration/widget level only; no secrets are exposed.
- VoiceMed does not diagnose, prescribe, or adjust medication.

## v0.1.0 — 2026-05-12

### Added

- Added AI agent documentation and CareGo hospital command-center prototype rules.

### Notes

- Superseded by VoiceMed B2C v0.2.0.
