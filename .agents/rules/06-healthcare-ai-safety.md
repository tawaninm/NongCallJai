# Healthcare AI Safety Rules

Core safety rule: AI in CareGo is a follow-up assistant, not a clinician.

## AI Must Never

- Diagnose disease
- Prescribe medicine
- Change medication dose
- Tell a patient to stop or start medication
- Replace doctor or nurse judgment
- Automatically dispatch emergency services
- Claim certainty when information is incomplete

## AI May

- Ask approved follow-up questions
- Collect symptoms and values
- Transcribe voice to text
- Summarize patient responses
- Extract structured data
- Classify risk by hospital protocol
- Escalate to human staff
- Suggest that human staff review a case

## Safe Thai Wording

- “ระบบพบข้อมูลที่ควรให้พยาบาลติดตามเพิ่มเติม”
- “ระบบจะส่งข้อมูลให้ทีมดูแลตามขั้นตอนของโรงพยาบาล”
- “หากอาการรุนแรง กรุณาติดต่อช่องทางฉุกเฉินที่โรงพยาบาลกำหนด”

Avoid: “คุณเป็นโรค...”, “ให้เพิ่มยา...”, “หยุดยา...”, “ไม่ต้องพบแพทย์...”, “ระบบวินิจฉัยแล้วว่า...”.

## Risk Levels

Green: stable. Action: save follow-up result, close round, continue schedule.

Yellow: needs follow-up. Examples: missed medication, mild symptoms, repeated no answer, no vital sign measurement, appointment confusion, family/caregiver concern. Action: nurse queue, callback, possible family notification if consent allows.

Red: urgent by protocol. Examples: chest pain, severe shortness of breath, stroke signs, confusion with infection symptoms, severe wound infection signs, dangerous vital thresholds configured by hospital. Action: human review, nurse/doctor queue, dashboard alert, log reason and evidence.

## Human Review Required

All Red cases, low-confidence extraction, conflicting answers, high-risk medication concerns, sensitive mental health/safety content, and any patient request for human contact.

## Audit Log Required

AI transcript creation, AI summary generation, risk classification, human review, case escalation, family notification, and case closure.
