# 03 Backend API Rules

Backend is now part of the MVP. It is an Express API under `/api` deployed as a Vercel Node.js Function with MongoDB Atlas/Mongoose persistence.

- REST endpoints under `/api`.
- Use `ApiResponse<T>`.
- Validate inputs with Zod.
- Authorize by family account and role.
- Never expose secrets, Botnoi API keys, payment keys, or sensitive voice data.
- Keep AI summaries traceable and auditable.
- Store setup/customer data, LINE connection tokens, Botnoi mapping, call feedback logs, notification payload logs, automation jobs, and audit logs in MongoDB.
- Do not expose call feedback on family web pages; prepare LINE notification payloads for the LINE OA team.
