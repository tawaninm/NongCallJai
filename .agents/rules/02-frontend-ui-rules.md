# Frontend UI Rules

Use DESIGN.md as the only source of truth for UI styling.

## Direction

CareGo must feel clinical, calm, authoritative, data-first, trustworthy, fast to scan, professional, and hospital SaaS / command-center-like.

The True Healing Framer page may inform spacing rhythm, section composition, calm card grouping, and visual polish only. Do not copy colors, content, branding, or wellness-coach tone.

## Preservation Rules

- Preserve existing routes, forms, API behavior, mock data behavior, validation, state management, and role-based logic.
- Do not replace dynamic data with hardcoded static content.
- Keep loading, empty, error, and success states.
- If a backend is incomplete, keep safe mock fallbacks in clearly named mock files.

## Interaction Rules

- Alerts open the related patient/case.
- Activity timeline items open the related AI result or patient case.
- Patient rows open Patient Detail.
- Case cards open Patient Detail.
- Action buttons use confirm modals when appropriate.
- Confirmed actions show toast and update visible status.
- Patch / อัปเดต must be visible to Admin.

## Accessibility

Use semantic HTML, buttons as buttons, links as links, labels/accessible names for inputs, sufficient contrast, keyboard usability, and status text in addition to color.
