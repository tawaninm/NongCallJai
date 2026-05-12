# Workflow: Role-Based Login

Purpose: make the Login role selector functional in prototype mode.

## Steps

1. Inspect current auth/login implementation.
2. Identify where routing/session state is handled.
3. Create or update role types: Admin, Nurse, Doctor, Pharmacist, Call Center.
4. Store selected role in session/local state for prototype.
5. Route each role to correct dashboard or role landing page.
6. Filter sidebar menus by role.
7. Show role badge in top bar.
8. Show logged-in user in sidebar footer.
9. Add safe fallback if role is missing.
10. Test each role manually.

## Acceptance Criteria

- Selecting each role changes dashboard or role landing page.
- Sidebar menus are different by role.
- Doctor does not see Settings or Care Plan editing.
- Pharmacist sees medication-focused pages.
- Call Center does not see clinical action pages.
- Admin sees all menus including Patch Log / อัปเดต.
