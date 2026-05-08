# 05 — RBAC and Role-Based UX Rules

## Roles

1. Admin / ผู้ดูแลระบบ
2. Nurse / Case Manager / พยาบาล / ผู้จัดการเคส
3. Doctor / แพทย์
4. Pharmacist / เภสัชกร
5. Call Center

## Login behavior

The Login page must allow selecting a demo role.

After login:

- Store selected role in prototype session state.
- Show role badge in top bar.
- Show user name and role in sidebar footer.
- Route to the role-specific dashboard.
- Hide menus not allowed for that role.

## Role dashboards

### Admin Dashboard

Purpose: system operation overview.

Visible modules:

- Total users
- Active patients
- AI call success rate
- Connected AI agents
- LINE integration status
- Voicebot integration status
- Audit logs
- Role permission shortcut
- Care plan template count
- Reports shortcut

Allowed menus:

- Dashboard
- Patient Queue
- Case Management
- AI Follow-up
- Care Plan
- Medication
- Appointment
- Family Notification
- Reports
- AI Agent Center
- Settings
- User Management
- Role Permission
- Integration
- Audit Log

### Nurse / Case Manager Dashboard

Purpose: daily patient follow-up operations.

Visible modules:

- Priority Risk Queue
- Red/Yellow Alert Center
- AI Follow-up Activity Timeline
- Callback Queue
- No Answer Cases
- Care Plan Summary
- Medication issue summary
- Appointment issue summary

Allowed menus:

- Dashboard
- Patient Queue
- Case Management
- AI Follow-up
- Care Plan
- Medication
- Appointment
- Family Notification
- Reports
- Limited AI Agent Center

Allowed actions:

- Call patient
- Send to nurse queue
- Refer doctor
- Refer pharmacist
- Notify family
- Schedule follow-up
- Close case with reason

### Doctor Dashboard

Purpose: review referred or urgent clinical cases.

Visible modules:

- Red cases requiring review
- Cases referred by nurses
- AI SBAR summaries
- Doctor note queue
- Latest vital signs
- Red flag reasons

Allowed menus:

- Doctor Dashboard
- Patient Queue filtered to Red/Yellow/Referred
- Patient Detail
- AI Summary
- Clinical Review
- Case Management
- Reports

Allowed actions:

- Open clinical review
- Add doctor note
- Send recommendation back to nurse
- Mark reviewed

Doctor should not see:

- Care plan editing by default
- AI agent configuration
- System settings

### Pharmacist Dashboard

Purpose: review medication issues.

Visible modules:

- Medication issue queue
- Missed medication
- Stopped medication
- Side effects
- High-risk medication alerts
- Pharmacist review status

Allowed menus:

- Medication Dashboard
- Medication Follow-up
- Patient Detail medication tab
- Pharmacist Review
- Medication Reports

Allowed actions:

- Open medication review
- Add pharmacist note
- Send recommendation to nurse/doctor
- Resolve medication issue

### Call Center Dashboard

Purpose: follow up contact attempts and non-clinical routing.

Visible modules:

- AI follow-up result
- Call queue
- No answer cases
- Callback queue
- Appointment reminder
- Basic family notification

Allowed actions:

- Open basic patient detail
- Call patient
- Log no answer
- Request nurse callback
- Send appointment reminder

Call Center must not:

- Close clinical cases
- Refer directly to doctor as clinical action
- Edit care plans
- View system settings

## Server-side authorization

Never rely only on UI role hiding.

Backend must check role permission for every protected action.
