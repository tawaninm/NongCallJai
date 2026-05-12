# Gemini Guidance for CareGo Hospital Platform

Gemini and other AI coding agents must read AGENTS.md before editing this repository.

## Operating Rules

- Follow AGENTS.md first, then .agents/rules/_, then relevant .agents/workflows/_.
- Inspect the repo before editing. The current app is Vite/TanStack/React; do not force a migration.
- Preserve the prototype, routes, forms, state management, mock data behavior, validation, and role-based logic.
- Use DESIGN.md as the only source of truth for colors, typography, spacing, radius, and component styling.
- Improve incrementally and keep build/lint passing.

## Healthcare Safety

Avoid unsafe healthcare claims. Do not write AI output that diagnoses disease, prescribes medication, changes medication dosage, tells a patient to stop/start medicine, replaces doctor/nurse judgment, or claims certainty with incomplete information.

Safe pattern: the system may say it found information that should be reviewed by hospital staff, then escalate according to hospital protocol.

## Documentation Priority

1. AGENTS.md
2. DESIGN.md
3. .agents/rules/\*
4. .agents/workflows/\*
5. docs/\*
6. README.md
