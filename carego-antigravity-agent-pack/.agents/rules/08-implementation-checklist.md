# 08 — Implementation Checklist

Use this checklist before completing any task.

## General

- [ ] Did you inspect the current repository before editing?
- [ ] Did you avoid deleting working UI without replacing functionality?
- [ ] Is the implementation TypeScript-safe?
- [ ] Are data types shared or consistent?
- [ ] Are loading, empty, error, and success states handled?
- [ ] Are toasts/modals used for actions?
- [ ] Are role permissions respected?

## Frontend

- [ ] UI text is Thai for hospital users.
- [ ] Layout is readable for nurses/doctors.
- [ ] Red/Yellow/Green colors are consistent.
- [ ] Alerts are clickable.
- [ ] Activity timeline items are clickable.
- [ ] Patient rows/cards open Patient Detail.
- [ ] Action buttons update status visibly.
- [ ] Dashboard shows urgent cases above the fold.

## Backend

- [ ] Input validation exists.
- [ ] Server-side role checks exist.
- [ ] API response shape is consistent.
- [ ] Service layer handles business logic.
- [ ] Audit log is created for important actions.
- [ ] No secrets are exposed.

## Healthcare AI safety

- [ ] AI does not diagnose.
- [ ] AI does not prescribe.
- [ ] Red cases require human review.
- [ ] Risk reason and evidence are visible.
- [ ] Family notification respects consent.
- [ ] Clinical actions are done by human roles.

## Testing / verification

- [ ] Login works for Admin, Nurse, Doctor, Pharmacist, Call Center.
- [ ] Menus change by role.
- [ ] Dashboard cards filter cases.
- [ ] Refer Doctor changes case status and appears on Doctor dashboard.
- [ ] Refer Pharmacist changes medication queue.
- [ ] Notify Family adds notification history.
- [ ] Close Case asks for reason and updates status.
