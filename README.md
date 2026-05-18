# NongCallJai by VoiceMed (น้องคอลใจ)

**NongCallJai by VoiceMed** is a B2C AI Voice Companion subscription platform designed for family members who care for elderly parents, grandparents, or relatives. It provides a warm, conversational AI voice bot ("น้องคอลใจ") to help families check in on their loved ones when they can't be there in person.

The platform helps families set up a Voice bot / Chatbot flow, schedule simple check-in calls, review call logs, receive alerts, and manage subscription status from one easy-to-use caregiver dashboard.

## Core Promise
"ทำงานอย่างหมดห่วง เพราะ น้องคอลใจ อยู่เคียงข้างคุณตาคุณยาย"

## Product Direction

- **Primary customer:** Family members, relatives, and caregivers (B2C-first).
- **End user:** Elderly people who may or may not be patients.
- **Key Features:** Landing page, pricing, mock checkout, onboarding, family dashboard, elder profiles, bot settings, care templates, call history, alerts, reports, billing, and settings.
- **Future channel:** B2B/hospital partnerships may exist later, but this app is currently focused on the B2C experience.

## Current Stack

- Vite + TanStack Router + React + TypeScript
- Tailwind CSS v4
- Radix/shadcn-style UI primitives
- Recharts for data visualization
- Sonner for toast notifications
- Mock data/store in frontend TypeScript

*Note: Use `npm` for dependency management because `package-lock.json` is present.*

## Commands

```bash
# Start development server
npm run dev

# Run ESLint check
npm run lint

# Build for production
npm run build
```

## Healthcare AI Safety

NongCallJai is an AI companion and monitoring layer. It must **never**:
- Diagnose diseases.
- Prescribe medicine.
- Change medication doses.
- Tell someone to start or stop medication.
- Replace doctor, nurse, or caregiver judgment.
- Claim certainty when information is incomplete.

Serious symptoms should be phrased as a reason for family review and, when needed, a reason to contact medical professionals or the proper emergency channel.
> Example safe wording: "หากอาการรุนแรง ควรติดต่อบุคลากรทางการแพทย์หรือช่องทางฉุกเฉินที่เหมาะสม"
