# 03 Backend API Rules

Backend is now part of the MVP. It starts as an Express API with Prisma/PostgreSQL schema and an in-memory development store until a database is configured.

- REST endpoints under `/api`.
- Use `ApiResponse<T>`.
- Validate inputs with Zod.
- Authorize by family account and role.
- Never expose secrets, Botnoi API keys, payment keys, or sensitive voice data.
- Keep AI summaries traceable and auditable.
- Store setup/customer data, LINE connection tokens, Botnoi mapping, call feedback logs, notification payload logs, and audit logs.
- Do not expose call feedback on family web pages; prepare LINE notification payloads for the LINE OA team.
