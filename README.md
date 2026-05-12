# CareGo Hospital Platform

CareGo Hospital Platform is a hospital-side AI care follow-up platform for elderly patients, chronic disease follow-up, post-discharge follow-up, medication follow-up, nurse triage, doctor review, pharmacist review, family notification, and AI agent orchestration.

Current version: v0.1.0

## Current App Stack

This repository is currently a Vite + TanStack Router + React + TypeScript + Tailwind CSS prototype with mock data and local/session state. Keep this prototype working while improving it incrementally.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## AI Agent Entry Points

AI coding agents must read AGENTS.md first, then DESIGN.md, then relevant files under .agents/rules and .agents/workflows.

Recommended first reads: AGENTS.md, GEMINI.md, AI*AGENT_README.md, DESIGN.md, .agents/rules/*, .agents/workflows/\_, docs/API_CONTRACTS.md, docs/DATA_MODEL_OVERVIEW.md, docs/PROJECT_STRUCTURE.md, and docs/PATCH_LOG.md.

## Product Direction

CareGo supports hospital-side workflows for Admin, Nurse/Case Manager, Doctor, Pharmacist, and Call Center users.

Core flow: Patient visit/discharge -> hospital registers patient -> assign care plan -> AI schedules follow-up -> patient answers -> AI summarizes and extracts data -> AI classifies Green/Yellow/Red by protocol -> dashboard queues human review/action -> family is notified when consent allows -> action log/report is updated.

MVP care plans: Hypertension, Type 2 Diabetes Mellitus, and Heart Failure. Medication follow-up is cross-cutting.

## Safety

CareGo AI is a follow-up assistant, not a clinician. It must not diagnose, prescribe, change medication, replace hospital staff judgment, or automatically dispatch emergency services. Red and uncertain cases require human review.

## Version and Patch Log

- Developer changelog: docs/CHANGELOG.md
- Patch log: docs/PATCH_LOG.md
- Admin UI: Patch Log / อัปเดต page in the app
