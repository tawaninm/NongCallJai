# Workflow — Dashboard Ver 2.0

## Context files to read

- `AGENTS.md`
- `.agents/rules/02-frontend-ui-rules.md`
- `.agents/rules/05-rbac-role-rules.md`
- `.agents/rules/07-feature-map-v2.md`

## Task

Redesign dashboard into a real AI Care Command Center.

## Steps

1. Inspect existing dashboard component.
2. Extract current mock data structure.
3. Create reusable dashboard components:
   - StatCard
   - PriorityRiskQueue
   - AlertCenter
   - AIFollowupTimeline
   - CarePlanSummary
   - AgentStatusPanel
4. Add role-based dashboard content.
5. Make stat cards clickable filters.
6. Make alert cards clickable to Patient Detail.
7. Make timeline items clickable to AI Result or Patient Detail.
8. Add status badges and risk colors.
9. Add disease/care plan context.
10. Add responsive tablet-friendly layout.

## Acceptance criteria

- Dashboard shows urgent Red cases first.
- Nurses understand required action quickly.
- Doctors see referred/clinical review cases.
- Pharmacists see medication issues.
- Admin sees system overview.
- Alerts and activities navigate to related records.
