# CareGo Hospital Platform - AI Agent Guide

CareGo Hospital Platform is a hospital-side AI care follow-up platform for elderly patients, chronic disease follow-up, post-discharge follow-up, medication follow-up, nurse triage, doctor review, pharmacist review, family notification, and AI agent orchestration.

## Required Reading Order

Future AI coding agents must read this file first. Then read the relevant canonical rules before coding, and read task-specific workflows for implementation details.

1. Inspect the repository before editing.
2. Read .agents/rules/\* files relevant to the task.
3. Read .agents/workflows/\* files relevant to the task.
4. Follow DESIGN.md as the only UI design-system source of truth.
5. Preserve the working prototype and improve it incrementally.
6. Follow healthcare AI safety rules for every AI-facing feature.

## Current Repository Reality

This repository currently uses Vite, TanStack Router, React, TypeScript, Tailwind CSS, Radix/shadcn-style UI components, Lucide React, Recharts, and Sonner. It is a frontend prototype with mock data and local/session state. Do not force a Next.js migration unless explicitly requested.

## Product Flow

Patient visit/discharge -> hospital registers patient -> assign care plan -> AI schedules call/LINE/Web App follow-up -> patient answers -> AI transcribes and summarizes -> AI extracts symptoms/vitals/medication/appointment data -> AI classifies Green/Yellow/Red by protocol -> dashboard displays real-time queue -> nurse/doctor/pharmacist acts -> family is notified when consent allows -> action log and report are updated.

## MVP Scope

Core users: Admin, Nurse/Case Manager, Doctor, Pharmacist, and Call Center.

Core care plans: Hypertension, Type 2 Diabetes Mellitus, Heart Failure. Post-op wound and Medication Adherence may appear as prototype extensions. Medication follow-up is cross-cutting.

Non-goals for early MVP: no patient mobile app as the primary product, no AI diagnosis, no AI prescribing, no AI medication changes, no emergency dispatch automation, and no replacement of hospital EMR/HIS.

## Engineering Rules

- Use TypeScript for all new code.
- Keep current Vite/TanStack/React routes working.
- Do not delete working source code or remove working UI unless replacing it with equivalent or better functionality.
- Do not replace dynamic/mock-store data with static hardcoded UI.
- Keep role-based logic, validation, forms, routes, and state behavior intact.
- UI components must not contain clinical risk rules directly.
- Backend routes, when added, must delegate to service functions and validate inputs.
- Never expose secrets, API keys, database URLs, or patient-sensitive data in frontend code.

## Healthcare AI Safety

CareGo AI is a follow-up assistant, not a clinician. It may collect, transcribe, summarize, extract, classify by hospital protocol, and escalate to human staff. It must never diagnose, prescribe, change medication dose, tell patients to stop/start medication, replace clinical judgment, claim certainty from incomplete data, or automatically dispatch emergency services.

All Red cases, uncertain extractions, conflicting answers, high-risk medication concerns, sensitive safety content, and patient requests for human contact require human review.

## Done Criteria

Before finishing work, verify role behavior, navigation, visible state updates, toasts/modals, risk colors, Thai hospital-facing text, loading/empty/error states, versioning, patch log updates, and build/lint status.
