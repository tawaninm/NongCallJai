# CareGo Antigravity AI Agent Pack

Copy these files into the root of `tawaninm/caregohospital`.

Recommended placement:

```txt
caregohospital/
├── AGENTS.md
├── GEMINI.md
├── AI_AGENT_README.md
└── .agents/
    ├── rules/
    └── workflows/
```

## How to use in Antigravity

1. Open the repository folder in Antigravity.
2. Start a new chat after copying these files.
3. Ask the agent to read `AGENTS.md` first.
4. For a focused task, reference the exact rule file. Example:

```txt
Read AGENTS.md, .agents/rules/05-rbac-role-rules.md, and .agents/rules/07-feature-map-v2.md.
Upgrade login so selecting Admin, Nurse, Doctor, Pharmacist, or Call Center changes dashboard and visible menus.
Do not rebuild from scratch. Preserve existing UI.
```

## Recommended first tasks

1. `Role-based Login`
2. `Dashboard Ver 2.0`
3. `Clickable Alerts + Activities`
4. `Patient Detail Ver 2.0`
5. `Express API contract + mock backend`
6. `Prisma database schema + seed data`
7. `Connect frontend to API`

## Notes

This pack is designed to work with the current Lovable-generated prototype and guide future migration toward:

- Next.js frontend
- Express.js backend
- PostgreSQL + Prisma database
- Role-based hospital workflows
- AI agent-ready architecture
