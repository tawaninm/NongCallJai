# 03 — Backend API Rules

## Backend goal

Create an Express.js backend that can later replace mock data in the prototype.

Use TypeScript, Express, Prisma, PostgreSQL, and Zod validation.

## API design principles

- REST endpoints under `/api`.
- Use consistent response shape.
- Validate all inputs.
- Authorize by role on server.
- Keep business logic in service layer.
- Write audit logs for important actions.
- Return safe data only; avoid exposing sensitive data unnecessarily.

## Standard response shape

```ts
type ApiResponse<T> = {
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

## Core routes

### Auth / prototype session

```txt
POST /api/auth/demo-login
GET  /api/auth/me
POST /api/auth/logout
```

### Patients

```txt
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
PATCH  /api/patients/:id
GET    /api/patients/:id/timeline
```

Supported query filters:

```txt
riskLevel, carePlanType, disease, status, assignedStaffId, search, dateFrom, dateTo
```

### Care plans

```txt
GET    /api/care-plans
POST   /api/care-plans
GET    /api/care-plans/:id
PATCH  /api/care-plans/:id
POST   /api/care-plans/:id/duplicate
POST   /api/care-plans/:id/test-script
```

### AI follow-up

```txt
GET    /api/ai-followups
POST   /api/ai-followups/webhook
GET    /api/ai-followups/:id
POST   /api/ai-followups/:id/send-to-nurse-queue
POST   /api/ai-followups/:id/escalate
```

### Cases

```txt
GET    /api/cases
GET    /api/cases/:id
PATCH  /api/cases/:id/status
POST   /api/cases/:id/actions/callback
POST   /api/cases/:id/actions/refer-doctor
POST   /api/cases/:id/actions/refer-pharmacist
POST   /api/cases/:id/actions/notify-family
POST   /api/cases/:id/actions/close
```

### Medication

```txt
GET    /api/medication/issues
GET    /api/medication/issues/:id
POST   /api/medication/issues/:id/refer-pharmacist
POST   /api/medication/issues/:id/resolve
```

### Appointments

```txt
GET    /api/appointments
POST   /api/appointments/:id/send-reminder
POST   /api/appointments/:id/confirm
POST   /api/appointments/:id/request-transport-help
```

### Family notifications

```txt
GET    /api/family-notifications
POST   /api/family-notifications/send
GET    /api/patients/:id/family-notifications
```

### Reports

```txt
GET    /api/reports/summary
GET    /api/reports/risk-trend
GET    /api/reports/care-plan-distribution
GET    /api/reports/medication-issues
GET    /api/reports/workload
```

### AI Agent Center

```txt
GET    /api/agents
GET    /api/agents/:id
PATCH  /api/agents/:id/config
POST   /api/agents/:id/test
GET    /api/agents/:id/logs
```

## Authorization rules

- Admin can access all resources.
- Nurse can manage patients, cases, follow-ups, family notifications, appointments, and medication referrals.
- Doctor can access referred/Red/Yellow clinical cases and add doctor notes.
- Pharmacist can access medication issues and medication review.
- Call Center can access call queues, AI follow-ups, no-answer cases, and basic patient info.

## Important service functions

```ts
class RiskAssessmentService {
  classify(input: RiskAssessmentInput): RiskAssessmentResult
}

class CaseActionService {
  referToDoctor(caseId, actorId, payload)
  referToPharmacist(caseId, actorId, payload)
  notifyFamily(caseId, actorId, payload)
  closeCase(caseId, actorId, reason)
}

class AuditLogService {
  log(actorId, action, entityType, entityId, metadata)
}
```

## Healthcare API safety

- Never return AI output as final medical advice.
- Include `humanReviewRequired` for Red and uncertain cases.
- Store `riskReason` and `evidence` for traceability.
- Log every AI-generated risk classification.
