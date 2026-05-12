# Data Model Overview

Recommended database: PostgreSQL with Prisma.

CareGo separates Patient, CarePlan, FollowUpSchedule, AIConversation, RiskAssessment, Case, CaseAction, MedicationStatus, Appointment, FamilyContact, FamilyNotification, AgentConfig, AgentLog, and AuditLog.

A case is an operational hospital work item. An AI conversation is not the case itself; a case may contain many AI conversations, risk assessments, human actions, and family notifications.

## Core Relationships

- Patient 1-many AIConversation
- Patient 1-many Case
- Patient many-1 CarePlan
- Case 1-many CaseAction
- Case 1-many RiskAssessment
- Patient 1-many Appointment
- Patient 1-many FamilyContact
- FamilyContact 1-many FamilyNotification
- AgentConfig 1-many AgentLog

## Disease-specific Data

Use flexible JSON fields for disease-specific values rather than many disease columns on Patient. Examples: symptoms, vitalSigns, medication adherence, appointment understanding, caregiver availability.

## Seed Data

The prototype should include realistic Thai demo data for 8 patients, 5 care plans, 10 AI conversations, 8 active cases, 5 medication issues, 4 appointments, 4 family contacts, 8 agent configs, and audit logs.
