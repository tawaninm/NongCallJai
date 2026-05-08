# 07 — CareGo Ver 2.0 Feature Map

## Main objective

Upgrade the prototype into a testable hospital web platform that works from login onward and changes by role.

## Ver 2.0 must-have features

### 1. Role-based Login

- Demo role selector works.
- Selecting role changes dashboard, visible menus, and actions.
- Top bar shows current role.
- Sidebar footer shows logged-in user.

### 2. Dashboard Ver 2.0

Dashboard must be easier and more detailed.

Required panels:

1. Stat cards
2. Priority Risk Queue
3. AI Follow-up Activity Timeline
4. Alert Center
5. Care Plan Summary
6. AI Agent Status

Stat cards:

- ผู้ป่วยที่ติดตามทั้งหมด
- Green / Stable
- Yellow / Need Follow-up
- Red / Urgent
- รอโทรกลับ
- ติดต่อไม่ได้
- รอแพทย์ตรวจ
- รอเภสัชกรตรวจ
- AI โทรสำเร็จวันนี้
- เวลาตอบสนองเฉลี่ย

All stat cards should be clickable filters.

### 3. Clickable alerts and activities

- Clicking Red alert opens Patient Detail.
- Clicking Yellow alert opens related AI Follow-up Result or Patient Detail.
- Clicking activity opens related case/result.
- Each alert/activity item shows status.

Status examples:

- ใหม่
- รอตรวจสอบ
- ส่งต่อแล้ว
- รอโทรกลับ
- ปิดเคสแล้ว
- ต้องดำเนินการ

### 4. Patient Queue Ver 2.0

Filters:

- HN/name/phone/symptom search
- Risk
- Disease / Care Plan
- Department
- Status
- Assigned staff
- Date range

Row design:

- Risk left border
- Avatar initials
- Disease icon
- AI summary
- Medication badge
- Appointment badge
- Family notification badge
- Action buttons

### 5. Patient Detail Ver 2.0

Top patient header:

- Name, HN, age, gender
- Disease/care plan
- Risk
- Case status
- Assigned nurse/doctor/pharmacist
- Consent badge
- Family contact badge

Tabs:

1. ภาพรวม
2. สรุปจาก AI
3. บทสนทนา
4. ข้อมูลชีวัด
5. การใช้ยา
6. นัดหมาย
7. ญาติ / Caregiver
8. บันทึกการดำเนินการ

Disease snapshots:

Hypertension:

- Latest BP
- Medication adherence
- Headache/dizziness
- Chest pain
- Shortness of breath

Type 2 Diabetes:

- Latest blood sugar
- Medication/insulin status
- Hypoglycemia symptoms
- Foot wound
- Diet issue

Heart Failure:

- Weight change
- Shortness of breath
- Cannot lie flat
- Leg swelling
- Diuretic adherence

### 6. AI Follow-up Result Ver 2.0

Split layout:

- Left: AI follow-up results list
- Right: selected result detail

Detail includes:

- Transcript as chat bubbles
- AI summary
- Extracted symptoms
- Vital signs
- Medication adherence
- Appointment understanding
- Caregiver availability
- Risk classification
- Risk reason
- Confidence
- Human review required

Actions:

- Open patient case
- Send to nurse queue
- Refer doctor
- Refer pharmacist
- Notify family
- Close follow-up round

### 7. Care Plan Ver 2.0

Template cards:

- Hypertension
- Type 2 Diabetes
- Heart Failure
- Post-op Wound
- Medication Adherence

Each card shows:

- Active patient count
- Follow-up frequency
- Question count
- Red flag count
- Edit
- Preview script
- Duplicate

### 8. Case Management

Kanban columns:

- รอติดตาม
- ติดต่อแล้ว
- รอโทรกลับ
- รอพยาบาลตรวจ
- ส่งแพทย์
- ส่งเภสัชกร
- แจ้งญาติแล้ว
- ยกระดับ
- ปิดเคส

Cards must be clickable.

### 9. Medication Follow-up

Cards:

- มีปัญหาการใช้ยา
- ลืมยา
- หยุดยาเอง
- ผลข้างเคียง
- รอเภสัชกรตรวจ
- High-risk medication

### 10. Reports

Use real chart components, not empty placeholders:

- Risk donut chart
- AI call success trend
- Case status bar chart
- Disease distribution chart
- Medication issue breakdown
- Response time trend
- Nurse workload

## Mock data focus

Use these main patients:

1. สมชาย วงศ์สุวรรณ — Hypertension — Green — BP 128/82 — กินยาครบ
2. วิภา แซ่ลิ้ม — Type 2 Diabetes — Yellow — ลืมยา 2 วัน
3. ประยุทธ์ ศรีสุข — Hypertension — Red — เจ็บแน่นหน้าอก BP 180/120
4. สุขีย์ จันทร์เพ็ญ — Post-op wound — Red — แผลบวมแดง มีไข้
5. บุญมี ทองดี — Heart Failure — Yellow — ติดต่อไม่ได้ 3 ครั้ง
6. มาลี สมบูรณ์ — Hypertension — Yellow — ขาดนัดตรวจ
7. อนันต์ พิทักษ์ — Type 2 Diabetes — Green — ควบคุมน้ำตาลดี
8. จินดา เรืองศรี — Heart Failure — Yellow — เดินลำบาก กลัวล้ม
