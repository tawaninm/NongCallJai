# Data Model Overview

CareGo should separate these concepts clearly:

- Patient = person being followed
- CarePlan = protocol/template assigned to patient
- FollowUpSchedule = planned AI call/message round
- AIConversation = actual voice/chat result
- RiskAssessment = AI protocol-based triage output
- Case = operational work item for hospital staff
- CaseAction = human/AI action history
- MedicationStatus = medication issue/adherence tracking
- Appointment = hospital appointment reminder and follow-up
- FamilyNotification = caregiver/family communication log
- AgentConfig = AI agent configuration
- AuditLog = traceability log

## Why this matters

Do not treat every AI call as the case itself. A case may contain many AI calls, many human actions, and many family notifications.

## Key relationships

```txt
Patient 1—many AIConversation
Patient 1—many Case
Patient many—1 CarePlan
Case 1—many CaseAction
Case 1—many RiskAssessment
Patient 1—many Appointment
Patient 1—many FamilyContact
FamilyContact 1—many FamilyNotification
AgentConfig 1—many AgentLog
```
