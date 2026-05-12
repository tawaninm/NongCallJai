# Database Model Rules

CareGo must separate these concepts clearly: Patient, CarePlan, FollowUpSchedule, AIConversation, RiskAssessment, Case, CaseAction, MedicationStatus, Appointment, FamilyNotification, AgentConfig, and AuditLog.

Do not treat every AI call as the case itself. A case may contain many AI calls, human actions, and family notifications.

## Relationships

- Patient 1-many AIConversation
- Patient 1-many Case
- Patient many-1 CarePlan
- Case 1-many CaseAction
- Case 1-many RiskAssessment
- Patient 1-many Appointment
- Patient 1-many FamilyContact
- FamilyContact 1-many FamilyNotification
- AgentConfig 1-many AgentLog

## Core Enums

UserRole, RiskLevel, CaseStatus, CarePlanType, FollowUpChannel, AIConversationStatus.

## Core Entities

User, Department, Patient, FamilyContact, CarePlan, FollowUpSchedule, AIConversation, RiskAssessment, Case, CaseAction, MedicationStatus, Appointment, FamilyNotification, AgentConfig, AgentLog, AuditLog.

## Disease-specific Fields

Do not create too many disease-specific columns on Patient. Use flexible JSON fields for disease-specific follow-up values.

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
    adherence: "TAKEN" | "MISSED" | "STOPPED" | "UNKNOWN";
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

## Seed Data Requirement

Create realistic Thai demo data for 8 patients, 5 care plan templates, 10 AI conversations, 8 active cases, 5 medication issues, 4 appointments, 4 family contacts, 8 agent configs, and audit logs.

Main patients: สมชาย วงศ์สุวรรณ, วิภา แซ่ลิ้ม, ประยุทธ์ ศรีสุข, สุขีย์ จันทร์เพ็ญ, บุญมี ทองดี, มาลี สมบูรณ์, อนันต์ พิทักษ์, จินดา เรืองศรี.
