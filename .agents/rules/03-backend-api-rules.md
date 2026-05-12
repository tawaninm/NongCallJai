# Backend API Rules

REST endpoints live under /api and use TypeScript, Express.js, Zod validation, service functions, audit logs, and role authorization.

## Standard Response

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

## Important Endpoints

POST /auth/demo-login, GET /auth/me, GET/POST /patients, GET /patients/:id, GET /patients/:id/timeline, GET /cases, GET /cases/:id, PATCH /cases/:id/status, POST /cases/:id/actions/callback, POST /cases/:id/actions/refer-doctor, POST /cases/:id/actions/refer-pharmacist, POST /cases/:id/actions/notify-family, POST /cases/:id/actions/close, GET /ai-followups, GET /ai-followups/:id, POST /ai-followups/:id/send-to-nurse-queue, GET/POST/PATCH /care-plans, GET /reports/summary, GET /agents, POST /agents/:id/test.

## Rules

- Validate all inputs.
- Authorize by role on the server.
- Keep business logic in service layer.
- Write audit logs for important actions.
- Return safe data only.
- Never return AI output as final medical advice.
- Include humanReviewRequired for Red and uncertain cases.
- Store riskReason and evidence for traceability.
- Log every AI-generated risk classification.

## Core Services

```ts
class RiskAssessmentService {
  classify(input: RiskAssessmentInput): RiskAssessmentResult;
}

class CaseActionService {
  referToDoctor(caseId, actorId, payload);
  referToPharmacist(caseId, actorId, payload);
  notifyFamily(caseId, actorId, payload);
  closeCase(caseId, actorId, reason);
}

class AuditLogService {
  log(actorId, action, entityType, entityId, metadata);
}
```
