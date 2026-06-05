# VoiceMed API Contracts

Current v0.3.4 implementation deploys the MVP Express API under `/api` as a Vercel Node.js Function in the same project as the TanStack/Vite frontend. The API uses Mongoose with MongoDB Atlas and persists setup data, LINE links, Botnoi mappings, call feedback, notification payloads, automation jobs, and audit logs across serverless cold starts.

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

## Current Endpoints

- `GET /api/health`
- `GET /api/plans`
- `POST /api/checkout/mock-complete`
- `POST /api/onboarding/service-request`
- `POST /api/line/link/start`
- `GET /api/line/link/status?linkId=...`
- `POST /api/line/link/complete`
- `POST /api/line/webhook`
- `POST /api/line/push-test`
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

## Environment Requirements

Put real values in `.env.local` locally and deployment secrets in production. Do not commit real tokens.

```env
MONGODB_URI="mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/voicemed?retryWrites=true&w=majority"
LIFF_ID="2010122231-05nw3NWg"
VITE_LIFF_ID="2010122231-05nw3NWg"
LIFF_BASE_URL="https://liff.line.me/2010122231-05nw3NWg"
LINE_LOGIN_CHANNEL_ID="YOUR_LINE_LOGIN_CHANNEL_ID"
LINE_LOGIN_CHANNEL_SECRET="YOUR_LINE_LOGIN_CHANNEL_SECRET"
LINE_MESSAGING_CHANNEL_ID="YOUR_LINE_MESSAGING_CHANNEL_ID"
LINE_CHANNEL_ACCESS_TOKEN="YOUR_LINE_CHANNEL_ACCESS_TOKEN"
LINE_CHANNEL_SECRET="YOUR_MESSAGING_API_CHANNEL_SECRET"
LINE_OA_ADD_FRIEND_URL="https://lin.ee/..."
PUBLIC_API_BASE_URL="https://your-domain.com"
BOTNOI_WEBHOOK_SECRET="YOUR_BOTNOI_WEBHOOK_SECRET"
```

`DATABASE_URL` is a legacy alias only. The backend reads it only when it starts with `mongodb://` or `mongodb+srv://`.

`LINE_CHANNEL_SECRET` must come from the Messaging API / Official Account channel used by webhook delivery, not the LIFF Login channel.

`VITE_LIFF_ID` is intentionally public client configuration for the LIFF SDK. It lets the scanned QR page call LINE Login/profile and complete `/api/line/link/complete`.

## LINE Webhook Payload

`POST /api/line/webhook`

Required header:

```http
x-line-signature: <LINE computed signature>
```

Example body:

```ts
{
  destination: "Uxxxxxxxx";
  events: [
    {
      type: "follow";
      timestamp: 1779094800000;
      source: {
        type: "user";
        userId: "Uxxxxxxxx";
      };
    }
  ];
}
```

The backend verifies the raw JSON body with HMAC-SHA256 and returns `401` for missing or invalid signatures.

## LINE Push Test Payload

`POST /api/line/push-test`

```ts
{
  customerId: "cus_xxxxxxxx";
  elderName: "Khun Mae";
  title: "NongCallJai call summary";
  summary: "Family-safe summary text";
  alertLevel: "info" | "watch" | "urgent";
  audioUrl?: string;
}
```

This creates a notification payload and queues a `line_push_send` automation job. Run `POST /api/admin/automation/run-now` in development to execute due jobs.

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
  deliveryStatus: "pending" | "retrying" | "sent" | "failed" | "acknowledged";
  lineMessageId?: string;
  sentAt?: string;
}
```

## Safety Rules

- Validate all inputs.
- Authorize by account/user role.
- Do not return secrets or Botnoi API keys.
- Do not return AI output as medical advice.
- Log AI summaries and alert generation for traceability.
- Family-facing web should not expose call feedback, transcript, or audio; those are packaged for LINE OA delivery.
