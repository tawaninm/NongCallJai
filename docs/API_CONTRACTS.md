# VoiceMed API Contracts

Current v0.3.0 implementation adds an MVP Express API under `/api` with predictable typed responses. The API uses an in-memory development store until PostgreSQL is configured through Prisma.

```ts
export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
};
```

## Core Resources

- `Customer`
- `Subscription`
- `ElderProfile`
- `LineConnection`
- `BotnoiMapping`
- `CallFeedbackLog`
- `NotificationLog`
- `ConsentRecord`
- `AuditLog`

## Future Endpoints

- `GET /api/health`
- `GET /api/plans`
- `POST /api/checkout/mock-complete`
- `POST /api/onboarding/service-request`
- `POST /api/line/link/start`
- `GET /api/line/link/status?linkId=...`
- `POST /api/line/link/complete`
- `GET /api/customer/setup-status`
- `GET /api/admin/customers`
- `PATCH /api/admin/customers/:id/botnoi-mapping`
- `POST /api/botnoi/call-feedback`
- `GET /api/line/notification-payloads/:id`
- `GET /api/admin/api-endpoints`
- `GET /api/admin/automation/jobs`
- `POST /api/admin/automation/jobs/:id/retry`
- `POST /api/admin/automation/jobs/:id/cancel`
- `POST /api/admin/automation/run-now`
- `GET /api/admin/automation/health`

## LINE QR Link Payload

`POST /api/line/link/start`

```ts
{
  customerId: string;
}
```

Response:

```ts
{
  id: string;
  linkId: string;
  customerId: string;
  token: string; // dev only; production should store token hash and avoid returning raw token except in liffUrl
  expiresAt: string;
  status: "pending";
  liffUrl: string;
  pollIntervalMs: number;
}
```

`GET /api/line/link/status?linkId=...`

```ts
{
  linkId: string;
  customerId: string;
  status: "pending" | "linked" | "expired" | "used" | "failed";
  expiresAt: string;
  linkedAt?: string;
  displayName?: string;
  pictureUrl?: string;
}
```

`POST /api/line/link/complete`

```ts
{
  token: string;
  lineUserId: string;
  displayName?: string;
  pictureUrl?: string;
}
```

## Automation Job Payload

```ts
{
  id: string;
  type:
    | "line_link_expire_check"
    | "botnoi_contact_sync"
    | "call_schedule_create"
    | "call_feedback_process"
    | "summary_generate"
    | "line_push_send"
    | "weekly_report_send"
    | "retry_failed_notification"
    | "botnoi_setup_task";
  status: "queued" | "running" | "success" | "failed" | "retrying" | "cancelled" | "blocked";
  scheduledAt: string;
  attemptCount: number;
  maxAttempts: number;
  lastError?: string;
  payload: Record<string, unknown>;
}
```

## Botnoi Feedback Payload

```ts
{
  botnoiBotId: string;
  botnoiContactId: string;
  callStatus: "answered" | "missed" | "failed";
  startedAt: string;
  summary?: string;
  transcript?: string;
  audioUrl?: string;
  tags?: string[];
}
```

## LINE Notification Payload

```ts
{
  customerId: string;
  elderName: string;
  title: string;
  summary: string;
  alertLevel: "info" | "watch" | "urgent";
  audioUrl?: string;
  safeNote: string;
}
```

## Safety Rules

- Validate all inputs.
- Authorize by account/user role.
- Do not return secrets or Botnoi API keys.
- Do not return AI output as medical advice.
- Log AI summaries and alert generation for traceability.
- Family-facing web should not expose call feedback, transcript, or audio; those are packaged for LINE OA delivery.
