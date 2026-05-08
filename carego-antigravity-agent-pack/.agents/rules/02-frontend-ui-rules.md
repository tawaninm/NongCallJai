# 02 — Frontend UI Rules

## Design direction

CareGo should feel like a clinical AI care command center, not a generic admin dashboard.

Use:

- Clinical white surfaces
- Soft blue background
- Teal primary color
- Clear risk colors: Green / Yellow / Red
- High readability for Thai text
- Card-based layout
- Clear status chips
- Medical icons and subtle healthcare illustrations
- Calm, premium, hospital SaaS feeling

## Recommended colors

```ts
export const colors = {
  background: '#F3FAFF',
  card: '#FFFFFF',
  softBlue: '#E6F6FF',
  teal: '#00897B',
  tealDark: '#00685D',
  slateText: '#071E27',
  mutedText: '#3D4946',
  green: '#4CAF50',
  yellow: '#FFC107',
  red: '#F44336',
};
```

## Typography

- Prefer Manrope or Inter fallback.
- Thai line-height should be comfortable: 1.45–1.65.
- Use large numbers in stat cards.
- Avoid cramped rows; allow enough vertical space for Thai text.

## Dashboard rules

Dashboard must answer within 5 seconds:

- How many urgent patients today?
- Which cases need nurse callback?
- Which cases need doctor review?
- Which medication issues need pharmacist review?
- Which AI calls failed?
- Which care plan has the highest risk?

Required dashboard sections:

1. Role-aware stat cards
2. Priority Risk Queue
3. AI Follow-up Activity Timeline
4. Alert Center
5. Care Plan Summary
6. AI Agent Status

## Component rules

Create reusable components:

- `StatCard`
- `RiskBadge`
- `StatusBadge`
- `RoleBadge`
- `PatientAvatar`
- `PatientTable`
- `PatientCard`
- `CaseCard`
- `AISummaryPanel`
- `TranscriptPanel`
- `TimelineItem`
- `AlertCard`
- `CarePlanCard`
- `AgentCard`
- `ActionButtonGroup`
- `FilterBar`
- `ConfirmModal`
- `SidePanel`
- `Toast`

## Interaction rules

- Alerts must be clickable into the related case.
- Activity timeline items must be clickable into the related AI result or patient case.
- Patient rows must open Patient Detail.
- Case cards must open Patient Detail.
- Action buttons must open confirm modals.
- Confirmed actions must show toast and update visible status.
- Add loading, empty, and error states.

## Risk UI rules

- Green: stable/low priority, calm
- Yellow: caution/follow-up required, noticeable
- Red: urgent, clear but not visually overwhelming

Use both color and text, never color alone.

Example badges:

- `เขียว · ปกติ`
- `เหลือง · ต้องติดตาม`
- `แดง · เร่งด่วน`

## Avoid

- Do not overload dashboard with too many equal-weight cards.
- Do not hide the most urgent cases below the fold.
- Do not rely only on icons without Thai labels.
- Do not use AI wording that sounds like diagnosis.
