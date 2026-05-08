# 06 — Healthcare AI Safety Rules

## Core safety rule

AI in CareGo is a follow-up assistant, not a clinician.

AI must never:

- Diagnose disease
- Prescribe medicine
- Change medication dose
- Tell a patient to stop or start medication
- Replace doctor or nurse judgment
- Automatically dispatch emergency services
- Claim certainty when information is incomplete

AI may:

- Ask approved follow-up questions
- Collect symptoms and values
- Transcribe voice to text
- Summarize patient responses
- Extract structured data
- Classify risk by hospital protocol
- Escalate to human staff
- Suggest that human staff review a case

## Wording rules

Use safe wording:

- ✅ “ระบบพบข้อมูลที่ควรให้พยาบาลติดตามเพิ่มเติม”
- ✅ “ระบบจะส่งข้อมูลให้ทีมดูแลตามขั้นตอนของโรงพยาบาล”
- ✅ “หากอาการรุนแรง กรุณาติดต่อช่องทางฉุกเฉินที่โรงพยาบาลกำหนด”

Avoid unsafe wording:

- ❌ “คุณเป็นโรค...”
- ❌ “ให้เพิ่มยา...”
- ❌ “หยุดยา...”
- ❌ “ไม่ต้องพบแพทย์...”
- ❌ “ระบบวินิจฉัยแล้วว่า...”

## Risk levels

### Green

Stable. No concerning symptoms. Medication and appointment status acceptable.

Action:

- Save follow-up result
- Close round
- Continue schedule

### Yellow

Needs follow-up. Examples:

- Missed medication
- Mild symptoms
- No answer repeated
- Did not measure vital sign
- Appointment confusion
- Family/caregiver concern

Action:

- Send to nurse queue
- Consider callback
- Consider family notification if consent allows

### Red

Urgent by protocol. Examples:

- Chest pain
- Severe shortness of breath
- Stroke signs
- Confusion with infection symptoms
- Severe wound infection signs
- Dangerous vital sign thresholds configured by hospital

Action:

- Human review required
- Escalate to nurse/doctor queue
- Alert dashboard
- Log reason and evidence

## Human review requirements

Require human review for:

- All Red cases
- Low-confidence AI extraction
- Conflicting patient answers
- Medication issues involving high-risk medication
- Sensitive mental health or safety content
- Any case where patient requests human contact

## Audit requirements

Log:

- AI transcript creation
- AI summary generation
- Risk classification
- Human review
- Case escalation
- Family notification
- Case closure
