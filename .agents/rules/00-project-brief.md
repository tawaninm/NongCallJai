# Project Brief

CareGo Hospital Platform is a hospital-side AI care follow-up platform for elderly patients, chronic disease follow-up, post-discharge follow-up, medication follow-up, nurse triage, doctor review, pharmacist review, family notification, and AI agent orchestration.

## Main Users

- Admin / ผู้ดูแลระบบ
- Nurse / Case Manager / พยาบาลผู้จัดการเคส
- Doctor / แพทย์
- Pharmacist / เภสัชกร
- Call Center

## Core Flow

Patient visit/discharge -> hospital registers patient -> assign care plan -> AI schedules call/LINE/Web App follow-up -> patient answers -> AI transcribes and summarizes -> AI extracts symptoms/vitals/medication/appointment data -> AI classifies Green/Yellow/Red by protocol -> dashboard displays real-time queue -> nurse/doctor/pharmacist acts -> family is notified when consent allows -> action log and report are updated.

## MVP Care Plans

1. Hypertension / ความดันโลหิตสูง
2. Type 2 Diabetes Mellitus / เบาหวานชนิดที่ 2
3. Heart Failure / ภาวะหัวใจล้มเหลว

Medication follow-up is cross-cutting across all care plans. Post-op wound and Medication Adherence may appear as prototype templates.

## Non-goals

- No patient mobile app as a primary product yet.
- No direct diagnosis by AI.
- No treatment prescription by AI.
- No emergency dispatch automation by AI.
- No replacement of hospital EMR/HIS.
