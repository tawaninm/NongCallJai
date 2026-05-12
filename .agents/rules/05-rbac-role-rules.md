# RBAC and Role-Based UX Rules

Roles: Admin, Nurse/Case Manager, Doctor, Pharmacist, Call Center.

## Login Behavior

- Login page must allow selecting a demo role.
- Store selected role in prototype session/local state.
- Show role badge in top bar.
- Show user name and role in sidebar footer.
- Route to the role-specific dashboard or landing page.
- Hide menus not allowed for that role.
- Backend must check role permission for every protected action.
- Never rely only on UI role hiding.

## Admin

Purpose: system operation overview. Allowed menus: Dashboard, Patient Queue, Case Management, AI Follow-up, Care Plan, Medication, Appointment, Family Notification, Reports, AI Agent Center, Settings, User Management, Role Permission, Integration, Audit Log, Patch Log / อัปเดต.

## Nurse / Case Manager

Purpose: daily patient follow-up operations. Visible modules: priority risk queue, Red/Yellow alert center, AI follow-up timeline, callback queue, no answer cases, care plan summary, medication issue summary, appointment issue summary. Allowed actions: call patient, send to nurse queue, refer doctor, refer pharmacist, notify family, schedule follow-up, close case with reason.

## Doctor

Purpose: review referred or urgent clinical cases. Visible modules: Red cases requiring review, nurse referrals, AI SBAR summaries, doctor note queue, latest vital signs, red flag reasons. Doctor should not see care plan editing, AI agent configuration, or system settings by default.

## Pharmacist

Purpose: review medication issues. Visible modules: medication issue queue, missed medication, stopped medication, side effects, high-risk medication alerts, pharmacist review status.

## Call Center

Purpose: follow up contact attempts and non-clinical routing. Visible modules: AI follow-up result, call queue, no answer cases, callback queue, appointment reminder, basic family notification. Call Center must not close clinical cases, refer directly to doctor as a clinical action, edit care plans, or view system settings.
