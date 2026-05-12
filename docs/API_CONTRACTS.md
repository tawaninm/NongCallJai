# API Contracts

Base URL: /api

## Standard Response Shape

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

## Core Patient Type

```ts
export type Patient = {
  id: string;
  hn: string;
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone?: string;
  disease:
    | "HYPERTENSION"
    | "TYPE_2_DIABETES"
    | "HEART_FAILURE"
    | "POST_OP_WOUND"
    | "MEDICATION_ADHERENCE";
  carePlanName: string;
  currentRiskLevel: "GREEN" | "YELLOW" | "RED";
  caseStatus: string;
  latestSummary: string;
  assignedNurse?: string;
  assignedDoctor?: string;
  assignedPharmacist?: string;
  lastContactAt?: string;
};

export type CaseActionRequest = {
  actorId: string;
  note?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
};
```

## Endpoints

- POST /auth/demo-login
- GET /auth/me
- GET /patients
- POST /patients
- GET /patients/:id
- GET /patients/:id/timeline
- GET /cases
- GET /cases/:id
- PATCH /cases/:id/status
- POST /cases/:id/actions/callback
- POST /cases/:id/actions/refer-doctor
- POST /cases/:id/actions/refer-pharmacist
- POST /cases/:id/actions/notify-family
- POST /cases/:id/actions/close
- GET /ai-followups
- GET /ai-followups/:id
- POST /ai-followups/:id/send-to-nurse-queue
- GET /care-plans
- POST /care-plans
- PATCH /care-plans/:id
- GET /reports/summary
- GET /agents
- POST /agents/:id/test

## Backend Rules

Use consistent response shape, validate inputs, authorize by role on server, keep business logic in services, write audit logs, return safe data only, and never return AI output as final medical advice.
