# Feature Map v2

Objective: upgrade the prototype into a testable hospital web platform that works from login onward and changes by role.

## Must-have Features

1. Role-based Login: demo role selector, role-specific dashboard/menus/actions, topbar role badge, sidebar user footer.
2. Dashboard v2: stat cards, priority risk queue, AI follow-up timeline, alert center, care plan summary, AI agent status.
3. Clickable alerts and activities: Red opens Patient Detail, Yellow opens AI result or Patient Detail, items show status.
4. Patient Queue v2: search/filter by HN/name/phone/symptom, risk, disease/care plan, department, status, staff, date range. Rows show risk border, avatar, disease icon, AI summary, medication badge, appointment badge, family badge, actions.
5. Patient Detail v2: overview, AI summary, conversation, vitals, medication, appointments, caregiver, action log.
6. AI Follow-up Result v2: split list/detail layout with transcript, summary, extracted data, risk classification, confidence, human review flag, and actions.
7. Care Plan v2: template cards for Hypertension, Type 2 Diabetes, Heart Failure, Post-op Wound, Medication Adherence.
8. Case Management: kanban columns for pending, contacted, callback, nurse review, doctor, pharmacist, family notified, escalated, closed.
9. Medication Follow-up: cards for issues, missed meds, stopped meds, side effects, pharmacist review, high-risk medication.
10. Reports: real chart components, not empty placeholders.
11. Patch Log / Update Log: Admin opens update history and current version.

## Required Stat Cards

ผู้ป่วยที่ติดตามทั้งหมด, Green / Stable, Yellow / Need Follow-up, Red / Urgent, รอโทรกลับ, ติดต่อไม่ได้, รอแพทย์ตรวจ, รอเภสัชกรตรวจ, AI โทรสำเร็จวันนี้, เวลาตอบสนองเฉลี่ย.

All stat cards should be clickable filters where feasible.
