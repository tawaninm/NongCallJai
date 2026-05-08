# 00 — Project Brief: CareGo Hospital Platform

## Product name

CareGo Hospital Platform

## Product type

Hospital-side AI care follow-up platform for elderly and chronic disease patients.

## Main users

- Admin / ผู้ดูแลระบบ
- Nurse / Case Manager / พยาบาลผู้จัดการเคส
- Doctor / แพทย์
- Pharmacist / เภสัชกร
- Call Center

## Core value proposition

CareGo helps hospitals follow up patients after visits or discharge by using AI voicebot/chatbot to collect symptoms, medication adherence, vital signs, appointment understanding, and caregiver status. The system summarizes the information, classifies risk by protocol, and routes cases to the correct human staff.

## Primary user flow

```txt
Patient visit/discharge
→ hospital registers patient
→ assign care plan
→ AI schedules call/LINE/Web App follow-up
→ patient answers
→ AI transcribes and summarizes
→ AI extracts symptoms/vitals/medication/appointment data
→ AI classifies Green / Yellow / Red by protocol
→ dashboard displays real-time queue
→ nurse/doctor/pharmacist acts
→ family is notified when consent allows
→ action log and report are updated
```

## MVP care plans

1. Hypertension / ความดันโลหิตสูง
2. Type 2 Diabetes Mellitus / เบาหวานชนิดที่ 2
3. Heart Failure / ภาวะหัวใจล้มเหลว

Medication follow-up is not only a disease. It is a cross-cutting feature used across every care plan.

## Non-goals for early MVP

- No patient mobile app as a primary product yet
- No direct diagnosis by AI
- No treatment prescription by AI
- No emergency dispatch automation by AI
- No replacement of hospital EMR/HIS

## Ver 2.0 priorities

- Role-based login and dashboards
- Dashboard that nurses/doctors understand within 5 seconds
- Clickable alerts and AI activities
- Practical patient queue and patient detail
- Disease-specific clinical snapshots
- Express.js backend API readiness
- Next.js frontend readiness
- PostgreSQL/Prisma database readiness
- AI Agent Center for future voicebot/chatbot/risk scoring integration
