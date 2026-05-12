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

export const APP_VERSION = "v0.1.0";

export const patchLogs: PatchLogEntry[] = [
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
      ".agents/rules/00-project-brief.md",
      ".agents/rules/01-target-architecture.md",
      ".agents/rules/02-frontend-ui-rules.md",
      ".agents/rules/03-backend-api-rules.md",
      ".agents/rules/04-database-model.md",
      ".agents/rules/05-rbac-role-rules.md",
      ".agents/rules/06-healthcare-ai-safety.md",
      ".agents/rules/07-feature-map-v2.md",
      ".agents/rules/08-implementation-checklist.md",
      ".agents/workflows/role-based-login.md",
      ".agents/workflows/dashboard-v2.md",
      ".agents/workflows/api-express-setup.md",
      ".agents/workflows/prisma-database.md",
      "docs/API_CONTRACTS.md",
      "docs/DATA_MODEL_OVERVIEW.md",
      "docs/PROJECT_STRUCTURE.md",
      "docs/CHANGELOG.md",
      "docs/PATCH_LOG.md",
    ],
    appFiles: [
      "src/lib/patch-log.ts",
      "src/routes/patch-log.tsx",
      "src/components/AppSidebar.tsx",
      "src/routes/__root.tsx",
      "src/routes/index.tsx",
      "src/routes/dashboard.tsx",
      "src/routeTree.gen.ts",
      "src/styles.css",
    ],
    status: "Completed",
    buildResult:
      "Passed: npm run format, npm run lint (9 warnings), npm run build, browser smoke check",
    notes: [
      "Prototype remains Vite/TanStack/React and mock-store based.",
      "No backend/database migration was performed in this pass.",
    ],
  },
];

export const latestPatchLog = patchLogs[0];
