export type PatchLogEntry = {
  version: string;
  date: string;
  category: "Docs" | "UI" | "Feature" | "Fix" | "Architecture" | "Safety" | "Data";
  title: string;
  summary: string;
  markdownFiles?: string[];
  appFiles?: string[];
  status?: "Completed" | "Partial" | "Needs Review";
  buildResult?: string;
  notes?: string[];
};

export const APP_VERSION = "v0.3.3";

export const patchLogs: PatchLogEntry[] = [
  {
    version: "v0.3.3",
    date: "2026-05-18",
    category: "Feature",
    title: "LINE webhook and backend push automation",
    summary:
      "Added .env.local-aware API configuration loading, LINE webhook signature verification, backend LINE push delivery for queued notifications, LIFF client completion, a push-test endpoint, and API Manager support for copyable webhook headers.",
    markdownFiles: [
      ".env.example",
      "docs/API_CONTRACTS.md",
      "docs/CHANGELOG.md",
      "docs/PATCH_LOG.md",
    ],
    appFiles: [
      "apps/api/src/config.ts",
      "apps/api/src/contracts.ts",
      "apps/api/src/server.ts",
      "apps/api/src/store.ts",
      "package.json",
      "package-lock.json",
      "src/lib/mvp-api.ts",
      "src/lib/patch-log.ts",
      "src/routes/admin.api-manager.tsx",
      "src/routes/line-connect.tsx",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run lint (9 existing fast-refresh warnings), npx tsc -p apps/api/tsconfig.json --noEmit, npm run build, API smoke checks for /api/health, /api/admin/api-endpoints, LINE webhook 401 on missing signature, valid signed LINE webhook event, /api/line/push-test, /api/admin/automation/run-now, and browser QA for /admin/api-manager showing Headers, /api/line/webhook, /api/line/push-test, and the automation queue. npm install @line/liff completed with 9 moderate audit warnings. Targeted Prettier applied to changed code/docs; .env.example was skipped because Prettier has no inferred env parser.",
    notes: [
      "Real LINE and Botnoi values belong in .env.local or deployment secrets, never tracked files.",
      "The Messaging API channel secret is required for webhook verification; the channel access token is required for backend push delivery.",
      "The scanned QR LIFF page now uses the public VITE_LIFF_ID to read the LINE profile and complete one-time account linking.",
      "The token shared during setup should be rotated before production because it was exposed in chat.",
    ],
  },
  {
    version: "v0.3.2",
    date: "2026-05-18",
    category: "Feature",
    title: "Seamless LINE QR and automation foundation",
    summary:
      "Added a real QR-based LINE linking flow with status polling and refresh, introduced MVP automation job contracts/endpoints for LINE and Botnoi handoff work, added an internal API Manager surface, and extended the Prisma schema for production automation persistence.",
    markdownFiles: ["docs/API_CONTRACTS.md", "docs/CHANGELOG.md", "docs/PATCH_LOG.md"],
    appFiles: [
      "apps/api/src/contracts.ts",
      "apps/api/src/server.ts",
      "apps/api/src/store.ts",
      "prisma/schema.prisma",
      "src/components/AppSidebar.tsx",
      "src/lib/mvp-api.ts",
      "src/lib/patch-log.ts",
      "src/routes/admin.api-manager.tsx",
      "src/routes/line-connect.tsx",
      "vite.config.ts",
      "package.json",
      "package-lock.json",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run lint (9 existing fast-refresh warnings), npx tsc -p apps/api/tsconfig.json --noEmit, npm run build, API smoke checks for /api/health, /api/admin/api-endpoints, and /api/admin/automation/health, plus browser QA for checkout -> onboarding -> LINE QR and /admin/api-manager. npm install qrcode @types/qrcode express completed with 9 moderate audit warnings.",
    notes: [
      "LINE QR now generates from the LIFF URL, polls link status, refreshes expired QR links, and auto-continues after successful linking.",
      "Automation jobs that require external LINE/Botnoi credentials are intentionally blocked until credentials and the real Botnoi outbound/callback API are configured.",
      "API Manager exposes copyable endpoint paths, sample POST bodies, cURL examples, and the development automation queue.",
      "Family-facing web still does not expose call feedback, transcript, audio, diagnosis, prescriptions, or medication changes.",
    ],
  },
  {
    version: "v0.3.1",
    date: "2026-05-18",
    category: "UI",
    title: "Warm care companion marketing redesign",
    summary:
      "Reworked the public landing and pricing experience into a warmer, more premium care companion website. The update replaces the Figma-export package carousel and footer banner with responsive HTML sections, adds clearer trust and safety storytelling, introduces reusable marketing pricing cards, and aligns the Botnoi chat widget color with the VoiceMed green system.",
    markdownFiles: ["DESIGN.md", "docs/CHANGELOG.md", "docs/PATCH_LOG.md"],
    appFiles: [
      "src/components/marketing/MarketingPricingCards.tsx",
      "src/components/BotnoiChat.tsx",
      "src/routes/index.tsx",
      "src/routes/pricing.tsx",
      "src/styles.css",
      "src/lib/patch-log.ts",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run lint (9 existing fast-refresh warnings), npm run build, and browser QA for landing/pricing at http://127.0.0.1:8080. Desktop screenshots rendered; mobile DOM/overflow checks passed at 390px width.",
    notes: [
      "Landing now uses a split hero, product preview, care-thread flow, safety panel, FAQ, and structured footer CTA.",
      "Pricing cards are canonical reusable UI and no longer depend on large package banner images.",
      "The public visual system now adds forest, sky, peach, amber, and LINE green accents around the primary mint palette.",
      "NongCallJai still does not diagnose, prescribe, or adjust medication.",
    ],
  },
  {
    version: "v0.3.0",
    date: "2026-05-17",
    category: "Feature",
    title: "NongCallJai Figma-first MVP web and API foundation",
    summary:
      "Updated the VoiceMed MVP into a Figma-first NongCallJai flow focused on package sales, service onboarding, LINE connection, waiting setup, and internal Botnoi/LINE handoff. Added Express API skeleton, Prisma PostgreSQL schema, frontend API fallback client, and updated docs/design rules for the new scope.",
    markdownFiles: [
      "DESIGN.md",
      ".agents/rules/00-project-brief.md",
      ".agents/rules/02-frontend-ui-rules.md",
      ".agents/rules/03-backend-api-rules.md",
      "docs/API_CONTRACTS.md",
      "docs/PROJECT_STRUCTURE.md",
      "docs/CHANGELOG.md",
      "docs/PATCH_LOG.md",
    ],
    appFiles: [
      "apps/api/src/contracts.ts",
      "apps/api/src/server.ts",
      "apps/api/src/store.ts",
      "apps/api/tsconfig.json",
      "prisma/schema.prisma",
      "src/lib/mvp-api.ts",
      "src/components/AppSidebar.tsx",
      "src/components/NongCallJaiMascot.tsx",
      "src/routes/index.tsx",
      "src/routes/pricing.tsx",
      "src/routes/checkout.tsx",
      "src/routes/onboarding.tsx",
      "src/routes/line-connect.tsx",
      "src/routes/waiting-setup.tsx",
      "src/routes/admin.customers.tsx",
      "src/routes/dashboard.tsx",
      "src/routes/__root.tsx",
      "src/styles.css",
      "package.json",
      "package-lock.json",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run lint (9 existing fast-refresh warnings), npm run build, npx tsc -p apps/api/tsconfig.json --noEmit, and GET http://localhost:8787/api/health. Targeted Prettier run formatted changed files; prisma/schema.prisma has no configured Prettier parser.",
    notes: [
      "Mock checkout remains the default.",
      "The API uses an in-memory development store until PostgreSQL is configured.",
      "Botnoi schedule/calling and LINE OA push delivery are owned by separate teams.",
      "Family-facing web does not show call feedback, transcript, audio, call history, or reports in this MVP.",
      "Landing page layout now follows the Figma Landing / Desktop direction with component/icon placement for hero phone preview, flow cards, package banner, mascot quote area, and footer CTA.",
      "Figma-exported NongCallJai package banners, footer banner, Mascot, and icon/sticker assets are stored in public/assets/nongcalljai/figma and used on the landing page as real visual components.",
      "Figma bitmap images are pulled into the website only when explicitly requested or when final exported assets are provided.",
      "Landing page was refined from a fixed 1440px design canvas into a real responsive website layout with max-width sections and mobile fallbacks.",
      "NongCallJai does not diagnose, prescribe, or adjust medication.",
    ],
  },
  {
    version: "v0.2.0",
    date: "2026-05-12",
    category: "Feature",
    title: "VoiceMed B2C subscription platform pivot",
    summary:
      "Rebranded the prototype from CareGo Hospital Platform into VoiceMed, a B2C AI Voice Companion subscription platform for family caregivers. Added landing, pricing, mock checkout, onboarding, family dashboard, elder profiles, bot settings, call history, alerts, reports, billing, and updated documentation.",
    markdownFiles: [
      "README.md",
      "AGENTS.md",
      "GEMINI.md",
      "AI_AGENT_README.md",
      "DESIGN.md",
      ".agents/rules/*",
      ".agents/workflows/*",
      "docs/API_CONTRACTS.md",
      "docs/DATA_MODEL_OVERVIEW.md",
      "docs/PROJECT_STRUCTURE.md",
      "docs/CHANGELOG.md",
      "docs/PATCH_LOG.md",
    ],
    appFiles: [
      "src/lib/voicemed-data.ts",
      "src/lib/voicemed-store.ts",
      "src/lib/auth-context.tsx",
      "src/lib/patch-log.ts",
      "src/routes/__root.tsx",
      "src/routes/index.tsx",
      "src/routes/pricing.tsx",
      "src/routes/checkout.tsx",
      "src/routes/onboarding.tsx",
      "src/routes/dashboard.tsx",
      "src/routes/elder-profiles.tsx",
      "src/routes/elder-profiles.$elderId.tsx",
      "src/routes/bot-settings.tsx",
      "src/routes/call-history.tsx",
      "src/routes/alerts.tsx",
      "src/routes/care-plans.tsx",
      "src/routes/reports.tsx",
      "src/routes/billing.tsx",
      "src/routes/settings.tsx",
      "src/components/AppSidebar.tsx",
      "src/components/BotnoiChat.tsx",
      "src/styles.css",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run format, npm run lint (9 existing warnings), npm run build, local browser smoke check",
    notes: [
      "Payment remains mock/prototype only.",
      "Botnoi integration is represented by safe configuration UI and existing widget; no API keys are exposed.",
      "VoiceMed does not diagnose, prescribe, or adjust medication.",
      "Browser smoke checked landing, pricing, checkout, and dashboard at http://127.0.0.1:5173.",
    ],
  },
  {
    version: "v0.1.0",
    date: "2026-05-12",
    category: "Feature",
    title: "AI Agent documentation and hospital command-center update",
    summary:
      "Merged the AI agent source pack, refreshed platform documentation, added versioning, and added an Admin Patch Log UI for update review.",
    markdownFiles: [
      "AGENTS.md",
      "GEMINI.md",
      "AI_AGENT_README.md",
      "DESIGN.md",
      "README.md",
      ".agents/rules/*",
      ".agents/workflows/*",
      "docs/*",
    ],
    appFiles: [
      "src/lib/patch-log.ts",
      "src/routes/patch-log.tsx",
      "src/components/AppSidebar.tsx",
      "src/routes/__root.tsx",
      "src/routes/index.tsx",
      "src/routes/dashboard.tsx",
      "src/styles.css",
    ],
    status: "Completed",
    buildResult: "Previously passed: npm run format, npm run lint, npm run build",
    notes: ["This version was hospital/B2B oriented and is superseded by v0.2.0."],
  },
];

export const latestPatchLog = patchLogs[0];
