# 04 — Database Model

Recommended database: PostgreSQL with Prisma.

## Enums

```prisma
enum UserRole {
  ADMIN
  NURSE
  DOCTOR
  PHARMACIST
  CALL_CENTER
}

enum RiskLevel {
  GREEN
  YELLOW
  RED
}

enum CaseStatus {
  PENDING_FOLLOW_UP
  CONTACTED
  NO_ANSWER
  NEED_NURSE_CALLBACK
  NURSE_REVIEW
  REFERRED_TO_DOCTOR
  REFERRED_TO_PHARMACIST
  FAMILY_NOTIFIED
  ESCALATED
  CLOSED
}

enum CarePlanType {
  HYPERTENSION
  TYPE_2_DIABETES
  HEART_FAILURE
  POST_OP_WOUND
  MEDICATION_ADHERENCE
}

enum FollowUpChannel {
  VOICEBOT
  LINE
  WEB_APP
  PHONE_MANUAL
}

enum AIConversationStatus {
  SCHEDULED
  CONTACTED
  NO_ANSWER
  FAILED
  COMPLETED
  SENT_TO_NURSE_QUEUE
}
```

## Core entities

### User

- id
- name
- email
- role
- departmentId
- isActive
- createdAt
- updatedAt

### Department

- id
- name
- code
- description

### Patient

- id
- hn
- firstName
- lastName
- age
- gender
- phone
- lineId
- primaryDisease
- activeCarePlanId
- consentAiCall
- consentRecording
- consentTranscript
- consentFamilyNotification
- createdAt
- updatedAt

### FamilyContact

- id
- patientId
- name
- relationship
- phone
- lineId
- consentLevel
- canReceiveRiskAlerts
- canReceiveAppointmentReminder

### CarePlan

- id
- name
- type
- patientGroup
- followUpFrequency
- questionsJson
- greenCriteriaJson
- yellowCriteriaJson
- redFlagCriteriaJson
- familyNotificationTemplate
- humanHandoffRule
- isActive

### FollowUpSchedule

- id
- patientId
- carePlanId
- scheduledAt
- channel
- status
- attemptCount
- lastAttemptAt

### AIConversation

- id
- patientId
- carePlanId
- scheduleId
- channel
- status
- startedAt
- endedAt
- durationSeconds
- transcript
- summary
- extractedEntitiesJson
- confidence
- humanReviewRequired

### RiskAssessment

- id
- patientId
- aiConversationId
- riskLevel
- riskReason
- evidenceJson
- createdByAiAgentId
- humanReviewedById
- humanReviewedAt
- createdAt

### Case

- id
- patientId
- currentRiskLevel
- status
- assignedNurseId
- assignedDoctorId
- assignedPharmacistId
- latestSummary
- latestRiskReason
- openedAt
- closedAt
- closeReason

### CaseAction

- id
- caseId
- actorId
- actionType
- note
- metadataJson
- createdAt

### MedicationStatus

- id
- patientId
- caseId
- medicationName
- medicationCategory
- adherenceStatus
- issueType
- sideEffect
- pharmacistStatus
- note
- updatedAt

### Appointment

- id
- patientId
- departmentId
- doctorId
- appointmentAt
- location
- reminderSent
- familyNotified
- transportHelpNeeded
- status

### FamilyNotification

- id
- patientId
- familyContactId
- caseId
- channel
- templateType
- message
- sentAt
- status

### AgentConfig

- id
- name
- type
- status
- inputDescription
- outputDescription
- humanApprovalRequired
- apiConnectionStatus
- configJson

### AgentLog

- id
- agentConfigId
- patientId
- caseId
- status
- inputJson
- outputJson
- errorMessage
- createdAt

### AuditLog

- id
- actorId
- actorType
- action
- entityType
- entityId
- metadataJson
- createdAt

## Disease-specific fields strategy

Do not create too many disease-specific columns on Patient.

Use flexible JSON fields for disease-specific follow-up values:

```ts
type ExtractedEntities = {
  symptoms?: string[];
  vitalSigns?: {
    bloodPressure?: string;
    bloodSugar?: number;
    weightChangeKg?: number;
    temperatureC?: number;
    heartRate?: number;
    spo2?: number;
  };
  medication?: {
    adherence: 'TAKEN' | 'MISSED' | 'STOPPED' | 'UNKNOWN';
    issue?: string;
  };
  appointment?: {
    understandsNextAppointment?: boolean;
    transportIssue?: boolean;
  };
  caregiver?: {
    available?: boolean;
    needsFamilyNotification?: boolean;
  };
};
```

## Seed data requirement

Create realistic Thai demo data for:

- 8 patients
- 5 care plan templates
- 10 AI conversations
- 8 active cases
- 5 medication issues
- 4 appointments
- 4 family contacts
- 8 agent configs
- audit logs for key actions
