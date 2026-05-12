// Types
export type RiskLevel = "green" | "yellow" | "red";
export type CaseStatus =
  | "pending"
  | "contacted"
  | "callback"
  | "nurse_review"
  | "referred_doctor"
  | "referred_pharmacist"
  | "family_notified"
  | "escalated"
  | "closed";
export type CallStatus = "completed" | "no_answer" | "failed" | "contacted";
export type UserRole = "admin" | "nurse" | "doctor" | "pharmacist" | "callcenter";
export type CarePlanType =
  | "hypertension"
  | "diabetes"
  | "heart_failure"
  | "post_op"
  | "medication_adherence";

export interface Patient {
  id: string;
  hn: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  carePlan: string;
  carePlanType: CarePlanType;
  department: string;
  lastContact: string;
  symptomSummary: string;
  medicationStatus: string;
  appointmentStatus: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReason: string;
  redFlagReason: string;
  yellowFlagReason: string;
  assignedNurse: string;
  assignedDoctor: string;
  caseStatus: CaseStatus;
  consentStatus: string;
  primaryCaregiver: string;
  caregiverPhone: string;
  contactChannel: string;
  admitDate: string;
  dischargeDate: string;
  // Disease-specific vitals
  latestBP: string;
  latestBloodSugar: string;
  latestWeightChange: string;
  medicationAdherence: string;
  pharmacistStatus: string;
  familyConsentLevel: string;
  // Medication details
  medications: { name: string; dose: string; frequency: string; adherence: string }[];
}

export interface AIFollowUp {
  id: string;
  patientId: string;
  patientName: string;
  hn: string;
  callStatus: CallStatus;
  callTime: string;
  duration: string;
  channel: string;
  transcript: string;
  summary: string;
  symptoms: string[];
  medicationAdherence: string;
  vitalSigns: string;
  appointmentUnderstanding: string;
  fallRisk: string;
  caregiverAvailability: string;
  riskLevel: RiskLevel;
  riskExplanation: string;
  confidence: number;
  humanReviewRequired: boolean;
}

export interface CarePlanTemplate {
  id: string;
  name: string;
  nameEn: string;
  type: CarePlanType;
  icon: string;
  patientGroup: string;
  followUpSchedule: string;
  activePatients: number;
  questions: string[];
  redFlags: string[];
  yellowFlags: string[];
  greenCriteria: string[];
  familyNotification: string;
  handoffRule: string;
  voiceScript: string;
}

export interface CaseAction {
  id: string;
  patientId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  note: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  hn: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  disease: string;
  status: "upcoming" | "missed" | "completed";
  reminderSent: boolean;
  reminderFailed: boolean;
  familyNotified: boolean;
  needsTransport: boolean;
}

export interface FamilyContact {
  id: string;
  patientId: string;
  patientName: string;
  caregiverName: string;
  relationship: string;
  phone: string;
  lineId: string;
  consentLevel: string;
  lastNotification: string;
  notificationHistory: { date: string; type: string; status: string }[];
}

// Mock patients — 3 main diseases
export const patients: Patient[] = [
  {
    id: "1",
    hn: "HN-650001",
    name: "สมชาย วงศ์สุวรรณ",
    age: 72,
    gender: "ชาย",
    phone: "081-234-5678",
    carePlan: "ความดันโลหิตสูง",
    carePlanType: "hypertension",
    department: "อายุรกรรม",
    lastContact: "2025-05-06 09:30",
    symptomSummary: "ไม่มีอาการผิดปกติ นอนหลับได้ดี ทานอาหารได้",
    medicationStatus: "ทานยาครบ",
    appointmentStatus: "นัดพบ 12 พ.ค.",
    riskLevel: "green",
    riskScore: 15,
    riskReason: "ไม่พบความเสี่ยง",
    redFlagReason: "",
    yellowFlagReason: "",
    assignedNurse: "พว.สมหญิง",
    assignedDoctor: "นพ.วิชัย",
    caseStatus: "contacted",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นางสมศรี วงศ์สุวรรณ (ภรรยา)",
    caregiverPhone: "081-234-5679",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-04-20",
    dischargeDate: "2025-04-28",
    latestBP: "128/82",
    latestBloodSugar: "-",
    latestWeightChange: "คงที่",
    medicationAdherence: "ดี (100%)",
    pharmacistStatus: "ไม่ต้องตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Amlodipine", dose: "5 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
      { name: "Enalapril", dose: "10 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
    ],
  },
  {
    id: "2",
    hn: "HN-650002",
    name: "วิภา แซ่ลิ้ม",
    age: 65,
    gender: "หญิง",
    phone: "089-876-5432",
    carePlan: "เบาหวานชนิดที่ 2",
    carePlanType: "diabetes",
    department: "ต่อมไร้ท่อ",
    lastContact: "2025-05-05 14:15",
    symptomSummary: "ลืมทานยาเบาหวาน 2 วัน มีอาการเวียนศีรษะเล็กน้อย",
    medicationStatus: "ลืมทานยา",
    appointmentStatus: "นัดพบ 15 พ.ค.",
    riskLevel: "yellow",
    riskScore: 55,
    riskReason: "ลืมทานยาเบาหวาน 2 วัน อาจเกิดภาวะน้ำตาลสูง",
    redFlagReason: "",
    yellowFlagReason: "ลืมทานยา 2 วัน เวียนศีรษะ",
    assignedNurse: "พว.นภัสสร",
    assignedDoctor: "พญ.สุวรรณี",
    caseStatus: "callback",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นายวิชัย แซ่ลิ้ม (บุตรชาย)",
    caregiverPhone: "089-876-5433",
    contactChannel: "LINE",
    admitDate: "2025-03-10",
    dischargeDate: "2025-03-15",
    latestBP: "135/85",
    latestBloodSugar: "210 mg/dL",
    latestWeightChange: "+1 kg",
    medicationAdherence: "ต่ำ (60%)",
    pharmacistStatus: "รอตรวจ",
    familyConsentLevel: "เฉพาะฉุกเฉิน",
    medications: [
      { name: "Metformin", dose: "500 mg", frequency: "วันละ 2 ครั้ง", adherence: "ลืม 2 วัน" },
      { name: "Glipizide", dose: "5 mg", frequency: "วันละ 1 ครั้ง", adherence: "ลืม 2 วัน" },
    ],
  },
  {
    id: "3",
    hn: "HN-650003",
    name: "ประยุทธ์ ศรีสุข",
    age: 58,
    gender: "ชาย",
    phone: "062-345-6789",
    carePlan: "ความดันโลหิตสูง",
    carePlanType: "hypertension",
    department: "หทัยวิทยา",
    lastContact: "2025-05-06 08:00",
    symptomSummary: "เจ็บแน่นหน้าอก หายใจลำบาก BP 180/120",
    medicationStatus: "ทานยาครบ",
    appointmentStatus: "ไม่มีนัด",
    riskLevel: "red",
    riskScore: 88,
    riskReason: "เจ็บแน่นหน้าอก + หายใจลำบาก ในผู้ป่วยโรคความดัน",
    redFlagReason: "เจ็บแน่นหน้าอก หายใจลำบาก BP 180/120",
    yellowFlagReason: "",
    assignedNurse: "พว.สมหญิง",
    assignedDoctor: "นพ.วิชัย",
    caseStatus: "escalated",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นางสาวปรียา ศรีสุข (บุตรสาว)",
    caregiverPhone: "062-345-6790",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-04-01",
    dischargeDate: "2025-04-05",
    latestBP: "180/120",
    latestBloodSugar: "-",
    latestWeightChange: "คงที่",
    medicationAdherence: "ดี (100%)",
    pharmacistStatus: "ไม่ต้องตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Amlodipine", dose: "10 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
      { name: "Losartan", dose: "50 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
      { name: "Aspirin", dose: "81 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
    ],
  },
  {
    id: "4",
    hn: "HN-650004",
    name: "สุขีย์ จันทร์เพ็ญ",
    age: 45,
    gender: "หญิง",
    phone: "091-456-7890",
    carePlan: "หลังผ่าตัด",
    carePlanType: "post_op",
    department: "ศัลยกรรม",
    lastContact: "2025-05-06 10:45",
    symptomSummary: "แผลบวมแดง มีไข้ 38.2°C",
    medicationStatus: "ทานยาครบ",
    appointmentStatus: "นัดตรวจแผล 8 พ.ค.",
    riskLevel: "red",
    riskScore: 82,
    riskReason: "แผลผ่าตัดอักเสบ มีไข้ ต้องพบแพทย์ด่วน",
    redFlagReason: "แผลบวมแดง มีไข้ 38.2°C",
    yellowFlagReason: "",
    assignedNurse: "พว.นภัสสร",
    assignedDoctor: "นพ.ธีรศักดิ์",
    caseStatus: "referred_doctor",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นายธนา จันทร์เพ็ญ (สามี)",
    caregiverPhone: "091-456-7891",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-04-25",
    dischargeDate: "2025-05-01",
    latestBP: "120/78",
    latestBloodSugar: "-",
    latestWeightChange: "คงที่",
    medicationAdherence: "ดี (100%)",
    pharmacistStatus: "ไม่ต้องตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Paracetamol", dose: "500 mg", frequency: "ทุก 6 ชม.", adherence: "ครบ" },
      { name: "Amoxicillin", dose: "500 mg", frequency: "วันละ 3 ครั้ง", adherence: "ครบ" },
    ],
  },
  {
    id: "5",
    hn: "HN-650005",
    name: "บุญมี ทองดี",
    age: 78,
    gender: "ชาย",
    phone: "083-567-8901",
    carePlan: "ภาวะหัวใจล้มเหลว",
    carePlanType: "heart_failure",
    department: "อายุรกรรม",
    lastContact: "2025-05-04 15:30",
    symptomSummary: "ติดต่อไม่ได้ 3 ครั้ง",
    medicationStatus: "ไม่ทราบ",
    appointmentStatus: "นัดพบ 10 พ.ค.",
    riskLevel: "yellow",
    riskScore: 50,
    riskReason: "ไม่สามารถติดต่อได้ 3 ครั้ง ต้องติดตาม",
    redFlagReason: "",
    yellowFlagReason: "ติดต่อไม่ได้ 3 ครั้ง",
    assignedNurse: "พว.สมหญิง",
    assignedDoctor: "นพ.วิชัย",
    caseStatus: "callback",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นางสาวบุญศรี ทองดี (บุตรสาว)",
    caregiverPhone: "083-567-8902",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-04-15",
    dischargeDate: "2025-04-22",
    latestBP: "110/70",
    latestBloodSugar: "-",
    latestWeightChange: "+2.5 kg (3 วัน)",
    medicationAdherence: "ไม่ทราบ",
    pharmacistStatus: "รอตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Furosemide", dose: "40 mg", frequency: "วันละ 1 ครั้ง", adherence: "ไม่ทราบ" },
      { name: "Enalapril", dose: "5 mg", frequency: "วันละ 2 ครั้ง", adherence: "ไม่ทราบ" },
      { name: "Carvedilol", dose: "6.25 mg", frequency: "วันละ 2 ครั้ง", adherence: "ไม่ทราบ" },
    ],
  },
  {
    id: "6",
    hn: "HN-650006",
    name: "มาลี สมบูรณ์",
    age: 60,
    gender: "หญิง",
    phone: "095-678-9012",
    carePlan: "ความดันโลหิตสูง",
    carePlanType: "hypertension",
    department: "อายุรกรรม",
    lastContact: "2025-05-05 11:00",
    symptomSummary: "ขาดนัดตรวจ หยุดยาเอง ไม่ได้วัดความดัน",
    medicationStatus: "หยุดยาเอง",
    appointmentStatus: "ขาดนัด 3 พ.ค.",
    riskLevel: "yellow",
    riskScore: 60,
    riskReason: "ขาดนัดพบแพทย์ หยุดทานยาเอง",
    redFlagReason: "",
    yellowFlagReason: "หยุดยาเอง ขาดนัด",
    assignedNurse: "พว.นภัสสร",
    assignedDoctor: "นพ.วิชัย",
    caseStatus: "pending",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นางวรรณา สมบูรณ์ (น้องสาว)",
    caregiverPhone: "095-678-9013",
    contactChannel: "LINE",
    admitDate: "2025-02-20",
    dischargeDate: "2025-02-25",
    latestBP: "ไม่ได้วัด",
    latestBloodSugar: "-",
    latestWeightChange: "ไม่ทราบ",
    medicationAdherence: "แย่ (0%)",
    pharmacistStatus: "รอตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Amlodipine", dose: "5 mg", frequency: "วันละ 1 ครั้ง", adherence: "หยุดเอง" },
    ],
  },
  {
    id: "7",
    hn: "HN-650007",
    name: "อนันต์ พิทักษ์",
    age: 55,
    gender: "ชาย",
    phone: "086-789-0123",
    carePlan: "เบาหวานชนิดที่ 2",
    carePlanType: "diabetes",
    department: "ต่อมไร้ท่อ",
    lastContact: "2025-05-06 13:00",
    symptomSummary: "ควบคุมน้ำตาลได้ดี ออกกำลังกายสม่ำเสมอ",
    medicationStatus: "ทานยาครบ",
    appointmentStatus: "นัดพบ 20 พ.ค.",
    riskLevel: "green",
    riskScore: 10,
    riskReason: "ไม่พบความเสี่ยง",
    redFlagReason: "",
    yellowFlagReason: "",
    assignedNurse: "พว.สมหญิง",
    assignedDoctor: "พญ.สุวรรณี",
    caseStatus: "contacted",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นางอรุณ พิทักษ์ (ภรรยา)",
    caregiverPhone: "086-789-0124",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-01-15",
    dischargeDate: "2025-01-18",
    latestBP: "125/80",
    latestBloodSugar: "118 mg/dL",
    latestWeightChange: "-0.5 kg",
    medicationAdherence: "ดี (100%)",
    pharmacistStatus: "ไม่ต้องตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Metformin", dose: "500 mg", frequency: "วันละ 2 ครั้ง", adherence: "ครบ" },
    ],
  },
  {
    id: "8",
    hn: "HN-650008",
    name: "จินดา เรืองศรี",
    age: 80,
    gender: "หญิง",
    phone: "087-890-1234",
    carePlan: "ภาวะหัวใจล้มเหลว",
    carePlanType: "heart_failure",
    department: "อายุรกรรม",
    lastContact: "2025-05-06 07:45",
    symptomSummary: "เหนื่อยง่ายขึ้น ขาบวม นอนราบไม่ได้",
    medicationStatus: "ทานยาครบ",
    appointmentStatus: "นัดพบ 9 พ.ค.",
    riskLevel: "yellow",
    riskScore: 58,
    riskReason: "เหนื่อยง่ายขึ้น ขาบวม อาจมีน้ำเกิน",
    redFlagReason: "",
    yellowFlagReason: "เหนื่อยง่าย ขาบวม นอนราบไม่ได้",
    assignedNurse: "พว.นภัสสร",
    assignedDoctor: "นพ.วิชัย",
    caseStatus: "nurse_review",
    consentStatus: "ยินยอม",
    primaryCaregiver: "นายสมศักดิ์ เรืองศรี (บุตรชาย)",
    caregiverPhone: "087-890-1235",
    contactChannel: "โทรศัพท์",
    admitDate: "2025-04-28",
    dischargeDate: "2025-05-03",
    latestBP: "100/65",
    latestBloodSugar: "-",
    latestWeightChange: "+3 kg (สัปดาห์)",
    medicationAdherence: "ดี (90%)",
    pharmacistStatus: "ไม่ต้องตรวจ",
    familyConsentLevel: "เต็มรูปแบบ",
    medications: [
      { name: "Furosemide", dose: "40 mg", frequency: "วันละ 2 ครั้ง", adherence: "ครบ" },
      { name: "Enalapril", dose: "10 mg", frequency: "วันละ 2 ครั้ง", adherence: "ครบ" },
      { name: "Digoxin", dose: "0.125 mg", frequency: "วันละ 1 ครั้ง", adherence: "ครบ" },
    ],
  },
];

export const aiFollowUps: AIFollowUp[] = [
  {
    id: "ai-1",
    patientId: "1",
    patientName: "สมชาย วงศ์สุวรรณ",
    hn: "HN-650001",
    callStatus: "completed",
    callTime: "2025-05-06 09:30",
    duration: "4:23",
    channel: "Voicebot",
    transcript:
      "AI: สวัสดีค่ะ คุณสมชาย สบายดีไหมคะ\nผู้ป่วย: สบายดีครับ\nAI: วันนี้วัดความดันหรือยังคะ\nผู้ป่วย: วัดแล้วครับ ได้ 128/82\nAI: ดีค่ะ อยู่ในเกณฑ์ปกติ ทานยาครบทุกมื้อไหมคะ\nผู้ป่วย: ทานครบครับ ไม่ได้ลืมเลย\nAI: มีอาการปวดหัว เวียนศีรษะ หรือเจ็บหน้าอกไหมคะ\nผู้ป่วย: ไม่มีครับ ปกติดี\nAI: ขอบคุณค่ะ พบแพทย์ 12 พ.ค. นะคะ",
    summary:
      "ผู้ป่วยสบายดี BP 128/82 อยู่ในเกณฑ์ปกติ ทานยาครบ ไม่มีอาการผิดปกติ พร้อมพบแพทย์ตามนัด",
    symptoms: [],
    medicationAdherence: "ทานครบทุกมื้อ",
    vitalSigns: "BP 128/82",
    appointmentUnderstanding: "เข้าใจนัดพบแพทย์ 12 พ.ค.",
    fallRisk: "ต่ำ",
    caregiverAvailability: "ภรรยาดูแล",
    riskLevel: "green",
    riskExplanation: "BP ปกติ ทานยาครบ ไม่มีอาการผิดปกติ",
    confidence: 95,
    humanReviewRequired: false,
  },
  {
    id: "ai-2",
    patientId: "2",
    patientName: "วิภา แซ่ลิ้ม",
    hn: "HN-650002",
    callStatus: "completed",
    callTime: "2025-05-05 14:15",
    duration: "6:10",
    channel: "Voicebot",
    transcript:
      "AI: สวัสดีค่ะ คุณวิภา วันนี้วัดน้ำตาลหรือยังคะ\nผู้ป่วย: ไม่ได้วัดค่ะ เครื่องเสีย\nAI: ทานยาเบาหวานครบไหมคะ\nผู้ป่วย: ลืมทาน 2 วันค่ะ ยุ่งดูแลหลาน\nAI: มีอาการเหงื่อแตก มือสั่น ใจสั่น หรือหน้ามืดไหมคะ\nผู้ป่วย: เวียนหัวนิดหน่อยค่ะ\nAI: มีแผลที่เท้าหรือแผลหายช้าไหมคะ\nผู้ป่วย: ไม่มีค่ะ\nAI: แนะนำให้กลับมาทานยาตามปกติ และวัดน้ำตาลนะคะ จะให้พยาบาลโทรติดตามค่ะ",
    summary:
      "ผู้ป่วยลืมทานยาเบาหวาน 2 วัน มีอาการเวียนศีรษะ ไม่ได้วัดระดับน้ำตาล เครื่องวัดเสีย ต้องติดตาม",
    symptoms: ["เวียนศีรษะ"],
    medicationAdherence: "ลืมทาน 2 วัน",
    vitalSigns: "FBS ไม่ได้วัด (เครื่องเสีย)",
    appointmentUnderstanding: "จำนัดได้ 15 พ.ค.",
    fallRisk: "ปานกลาง",
    caregiverAvailability: "บุตรชายอยู่คนละจังหวัด",
    riskLevel: "yellow",
    riskExplanation: "ลืมทานยาเบาหวาน 2 วัน + เวียนศีรษะ + ไม่ได้วัดน้ำตาล → เสี่ยงภาวะน้ำตาลสูง",
    confidence: 85,
    humanReviewRequired: true,
  },
  {
    id: "ai-3",
    patientId: "3",
    patientName: "ประยุทธ์ ศรีสุข",
    hn: "HN-650003",
    callStatus: "completed",
    callTime: "2025-05-06 08:00",
    duration: "5:45",
    channel: "Voicebot",
    transcript:
      "AI: สวัสดีค่ะ คุณประยุทธ์ วันนี้วัดความดันหรือยังคะ\nผู้ป่วย: วัดแล้วครับ สูงมาก 180/120\nAI: มีอาการปวดหัว หรือเจ็บหน้าอกไหมคะ\nผู้ป่วย: เจ็บแน่นหน้าอกครับ ตั้งแต่เมื่อคืน\nAI: เจ็บแบบไหนคะ เจ็บแปลบ หรือ แน่นๆ\nผู้ป่วย: แน่นๆ ครับ หายใจก็ลำบากนิดหน่อย\nAI: กรุณารอสายค่ะ จะส่งต่อพยาบาลทันที\nAI: ⚠️ [ระบบส่งต่อพยาบาลอัตโนมัติ — เจ็บหน้าอก + BP สูง]",
    summary:
      "🔴 ผู้ป่วยมีอาการเจ็บแน่นหน้าอกตั้งแต่เมื่อคืน หายใจลำบาก BP 180/120 — ต้องพบแพทย์ทันที",
    symptoms: ["เจ็บแน่นหน้าอก", "หายใจลำบาก"],
    medicationAdherence: "ทานครบ",
    vitalSigns: "BP 180/120",
    appointmentUnderstanding: "ไม่มีนัด",
    fallRisk: "ต่ำ",
    caregiverAvailability: "บุตรสาวดูแล",
    riskLevel: "red",
    riskExplanation:
      "เจ็บแน่นหน้าอก + หายใจลำบาก + BP 180/120 ในผู้ป่วยโรคความดันโลหิตสูง → สัญญาณอันตราย ต้องพบแพทย์ทันที",
    confidence: 92,
    humanReviewRequired: true,
  },
  {
    id: "ai-4",
    patientId: "5",
    patientName: "บุญมี ทองดี",
    hn: "HN-650005",
    callStatus: "no_answer",
    callTime: "2025-05-04 15:30",
    duration: "0:00",
    channel: "Voicebot",
    transcript: "",
    summary:
      "ไม่สามารถติดต่อผู้ป่วยได้ โทร 3 ครั้ง ไม่รับสาย — ผู้ป่วยหัวใจล้มเหลว อายุ 78 ปี ต้องติดตามทางอื่น",
    symptoms: [],
    medicationAdherence: "ไม่ทราบ",
    vitalSigns: "ไม่ทราบ",
    appointmentUnderstanding: "ไม่ทราบ",
    fallRisk: "ไม่ทราบ",
    caregiverAvailability: "ไม่ทราบ",
    riskLevel: "yellow",
    riskExplanation:
      "ไม่สามารถติดต่อได้ 3 ครั้ง ผู้ป่วยสูงอายุ 78 ปี โรคหัวใจล้มเหลว ต้องติดตามทางอื่น",
    confidence: 70,
    humanReviewRequired: true,
  },
  {
    id: "ai-5",
    patientId: "4",
    patientName: "สุขีย์ จันทร์เพ็ญ",
    hn: "HN-650004",
    callStatus: "completed",
    callTime: "2025-05-06 10:45",
    duration: "5:30",
    channel: "Voicebot",
    transcript:
      "AI: สวัสดีค่ะ คุณสุขีย์ แผลผ่าตัดเป็นยังไงบ้างคะ\nผู้ป่วย: บวมแดงขึ้นค่ะ\nAI: มีไข้ไหมคะ\nผู้ป่วย: วัดได้ 38.2 ค่ะ\nAI: มีหนองหรือเลือดออกจากแผลไหมคะ\nผู้ป่วย: ยังไม่มีหนอง แต่แดงมากค่ะ\nAI: ทานยาปฏิชีวนะครบไหมคะ\nผู้ป่วย: ทานครบค่ะ\nAI: ⚠️ [ระบบส่งต่อแพทย์ — แผลบวมแดง + ไข้]",
    summary: "🔴 แผลผ่าตัดบวมแดง มีไข้ 38.2°C ทานยาปฏิชีวนะครบ — สงสัยติดเชื้อ ต้องพบแพทย์",
    symptoms: ["แผลบวมแดง", "ไข้ 38.2°C"],
    medicationAdherence: "ทานครบ",
    vitalSigns: "T 38.2°C",
    appointmentUnderstanding: "นัดตรวจแผล 8 พ.ค.",
    fallRisk: "ต่ำ",
    caregiverAvailability: "สามีดูแล",
    riskLevel: "red",
    riskExplanation: "แผลผ่าตัดบวมแดง + ไข้ 38.2°C → สงสัยติดเชื้อ ต้องพบแพทย์ด่วน",
    confidence: 90,
    humanReviewRequired: true,
  },
  {
    id: "ai-6",
    patientId: "8",
    patientName: "จินดา เรืองศรี",
    hn: "HN-650008",
    callStatus: "completed",
    callTime: "2025-05-06 07:45",
    duration: "7:00",
    channel: "Voicebot",
    transcript:
      "AI: สวัสดีค่ะ คุณจินดา วันนี้เหนื่อยมากขึ้นไหมคะ\nผู้ป่วย: เหนื่อยมากขึ้นค่ะ เดินนิดเดียวก็หอบ\nAI: นอนราบแล้วเหนื่อยไหมคะ\nผู้ป่วย: นอนราบไม่ได้เลยค่ะ ต้องหนุนหมอน 3 ใบ\nAI: ขาบวมมากขึ้นไหมคะ\nผู้ป่วย: บวมมากค่ะ กดแล้วบุ๋ม\nAI: น้ำหนักขึ้นเร็วไหมคะ\nผู้ป่วย: ขึ้น 3 กิโลในสัปดาห์เดียวค่ะ\nAI: กินยาขับปัสสาวะครบไหมคะ\nผู้ป่วย: กินครบค่ะ\nAI: จะส่งข้อมูลให้พยาบาลตรวจสอบนะคะ",
    summary:
      "🟡 ผู้ป่วยเหนื่อยง่ายขึ้น นอนราบไม่ได้ (orthopnea) ขาบวม น้ำหนักขึ้น 3 kg/สัปดาห์ — อาจมีภาวะน้ำเกิน ต้องพยาบาลตรวจสอบ",
    symptoms: ["เหนื่อยง่าย", "นอนราบไม่ได้", "ขาบวม", "น้ำหนักขึ้นเร็ว"],
    medicationAdherence: "ทานครบ",
    vitalSigns: "น้ำหนักขึ้น 3 kg/สัปดาห์",
    appointmentUnderstanding: "นัดพบ 9 พ.ค.",
    fallRisk: "สูง",
    caregiverAvailability: "บุตรชายดูแล",
    riskLevel: "yellow",
    riskExplanation:
      "เหนื่อยมากขึ้น + orthopnea + ขาบวม + น้ำหนักขึ้น 3 kg ในผู้ป่วย HF → อาจมี fluid overload ต้องพยาบาลตรวจสอบ",
    confidence: 82,
    humanReviewRequired: true,
  },
];

export const carePlanTemplates: CarePlanTemplate[] = [
  {
    id: "cp-1",
    name: "ความดันโลหิตสูง",
    nameEn: "Hypertension",
    type: "hypertension",
    icon: "🫀",
    patientGroup: "ผู้ป่วยความดันโลหิตสูง",
    followUpSchedule: "ทุก 7 วัน",
    activePatients: 3,
    questions: [
      "วันนี้วัดความดันหรือยัง",
      "ค่าความดันล่าสุดเท่าไร",
      "กินยาความดันครบไหม",
      "มีเวียนหัว หน้ามืด ปวดหัว หรือไม่",
      "มีเจ็บหน้าอกหรือหายใจเหนื่อยไหม",
    ],
    redFlags: [
      "เจ็บหน้าอก",
      "หายใจลำบาก",
      "ความดันสูงกว่า 180/120",
      "สับสน พูดไม่ชัด",
      "ชาครึ่งซีก",
    ],
    yellowFlags: ["ลืมทานยา", "ปวดศีรษะบ่อย", "ความดัน 160-179/100-119", "เวียนศีรษะ", "หยุดยาเอง"],
    greenCriteria: ["BP < 140/90", "ทานยาครบ", "ไม่มีอาการ", "ออกกำลังกาย"],
    familyNotification: "แจ้งญาติทันทีเมื่อระดับสีแดง",
    handoffRule: "ส่งแพทย์ทันทีเมื่อเจ็บหน้าอกหรือ BP > 180/120",
    voiceScript: "สวัสดีค่ะ คุณ{name} ระบบ CareGo ติดตามสุขภาพค่ะ วันนี้วัดความดันหรือยังคะ...",
  },
  {
    id: "cp-2",
    name: "เบาหวานชนิดที่ 2",
    nameEn: "Type 2 Diabetes",
    type: "diabetes",
    icon: "🩸",
    patientGroup: "ผู้ป่วยเบาหวานชนิดที่ 2",
    followUpSchedule: "ทุก 3 วัน",
    activePatients: 2,
    questions: [
      "วันนี้วัดน้ำตาลหรือยัง",
      "ค่าน้ำตาลล่าสุดเท่าไร",
      "กินยาหรือฉีดอินซูลินครบไหม",
      "มีเหงื่อแตก มือสั่น ใจสั่น หรือหน้ามืดไหม",
      "มีแผลที่เท้าหรือแผลหายช้าไหม",
    ],
    redFlags: ["น้ำตาลต่ำกว่า 70", "หมดสติ", "ชัก", "น้ำตาลสูงกว่า 400", "แผลติดเชื้อ"],
    yellowFlags: ["ลืมทานยา", "น้ำตาลสูงกว่า 250", "เวียนศีรษะ", "แผลที่เท้า", "ไม่ได้วัดน้ำตาล"],
    greenCriteria: ["FBS 80-130", "ทานยาครบ", "ไม่มีแผล", "ออกกำลังกาย"],
    familyNotification: "แจ้งญาติเมื่อระดับสีเหลืองขึ้นไป",
    handoffRule: "ส่งพยาบาลทันทีเมื่อระดับสีแดง",
    voiceScript: "สวัสดีค่ะ คุณ{name} ระบบ CareGo ติดตามสุขภาพค่ะ วันนี้วัดน้ำตาลหรือยังคะ...",
  },
  {
    id: "cp-3",
    name: "ภาวะหัวใจล้มเหลว",
    nameEn: "Heart Failure",
    type: "heart_failure",
    icon: "❤️‍🩹",
    patientGroup: "ผู้ป่วยภาวะหัวใจล้มเหลว",
    followUpSchedule: "ทุก 3 วัน",
    activePatients: 2,
    questions: [
      "วันนี้เหนื่อยมากขึ้นไหม",
      "นอนราบแล้วเหนื่อยไหม",
      "ขาบวมมากขึ้นไหม",
      "น้ำหนักขึ้นเร็วผิดปกติไหม",
      "กินยาครบไหม โดยเฉพาะยาขับปัสสาวะ",
    ],
    redFlags: [
      "เหนื่อยหอบรุนแรง",
      "นอนราบไม่ได้เลย",
      "น้ำหนักขึ้น >2 kg ใน 3 วัน",
      "เจ็บหน้าอก",
      "สับสน",
    ],
    yellowFlags: [
      "เหนื่อยง่ายขึ้น",
      "ขาบวมเล็กน้อย",
      "น้ำหนักขึ้น 1-2 kg",
      "ลืมยาขับปัสสาวะ",
      "นอนราบไม่สบาย",
    ],
    greenCriteria: ["หายใจปกติ", "ไม่บวม", "น้ำหนักคงที่", "ทานยาครบ"],
    familyNotification: "แจ้งญาติทันทีเมื่อระดับสีแดง",
    handoffRule: "ส่งแพทย์ทันทีเมื่อเหนื่อยหอบรุนแรงหรือน้ำหนักขึ้นเร็ว",
    voiceScript: "สวัสดีค่ะ คุณ{name} ระบบ CareGo ติดตามสุขภาพค่ะ วันนี้เหนื่อยมากขึ้นไหมคะ...",
  },
  {
    id: "cp-4",
    name: "หลังผ่าตัด",
    nameEn: "Post-Op Wound",
    type: "post_op",
    icon: "🩹",
    patientGroup: "ผู้ป่วยหลังผ่าตัด",
    followUpSchedule: "ทุกวัน (7 วันแรก)",
    activePatients: 1,
    questions: ["แผลเป็นยังไง", "มีไข้ไหม", "ปวดมากไหม", "ทานยาปฏิชีวนะครบไหม"],
    redFlags: ["ไข้สูงกว่า 38.5", "แผลมีหนอง", "เลือดออกมาก"],
    yellowFlags: ["แผลบวมแดง", "ไข้ต่ำ", "ปวดมากขึ้น"],
    greenCriteria: ["ไม่มีไข้", "แผลแห้งดี", "ปวดลดลง", "ทานยาครบ"],
    familyNotification: "แจ้งญาติเมื่อมีปัญหาแผล",
    handoffRule: "ส่งแพทย์เมื่อสงสัยติดเชื้อ",
    voiceScript: "สวัสดีค่ะ คุณ{name} ระบบ CareGo ติดตามอาการหลังผ่าตัดค่ะ แผลเป็นยังไงบ้างคะ...",
  },
  {
    id: "cp-5",
    name: "ติดตามการใช้ยา",
    nameEn: "Medication Adherence",
    type: "medication_adherence",
    icon: "💊",
    patientGroup: "ผู้ป่วยที่มีปัญหาการทานยา",
    followUpSchedule: "ทุก 2 วัน",
    activePatients: 3,
    questions: ["ทานยาครบไหม", "มีผลข้างเคียงไหม", "เข้าใจวิธีทานยาไหม", "ยาหมดเมื่อไหร่"],
    redFlags: ["หยุดยาเอง > 3 วัน", "แพ้ยารุนแรง", "ผลข้างเคียงรุนแรง"],
    yellowFlags: ["ลืมทานยาบ่อย", "ไม่เข้าใจวิธีทาน", "ผลข้างเคียงเล็กน้อย"],
    greenCriteria: ["ทานยาครบ", "ไม่มีผลข้างเคียง", "เข้าใจวิธีทาน"],
    familyNotification: "แจ้งญาติเมื่อผู้ป่วยหยุดยา",
    handoffRule: "ส่งเภสัชกรเมื่อมีปัญหายา",
    voiceScript: "สวัสดีค่ะ คุณ{name} ระบบ CareGo ติดตามการใช้ยาค่ะ ทานยาครบทุกมื้อไหมคะ...",
  },
];

export const appointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "1",
    patientName: "สมชาย วงศ์สุวรรณ",
    hn: "HN-650001",
    date: "2025-05-12",
    time: "09:00",
    department: "อายุรกรรม",
    doctor: "นพ.วิชัย",
    disease: "ความดันโลหิตสูง",
    status: "upcoming",
    reminderSent: true,
    reminderFailed: false,
    familyNotified: true,
    needsTransport: false,
  },
  {
    id: "apt-2",
    patientId: "2",
    patientName: "วิภา แซ่ลิ้ม",
    hn: "HN-650002",
    date: "2025-05-15",
    time: "10:30",
    department: "ต่อมไร้ท่อ",
    doctor: "พญ.สุวรรณี",
    disease: "เบาหวานชนิดที่ 2",
    status: "upcoming",
    reminderSent: true,
    reminderFailed: false,
    familyNotified: false,
    needsTransport: false,
  },
  {
    id: "apt-3",
    patientId: "6",
    patientName: "มาลี สมบูรณ์",
    hn: "HN-650006",
    date: "2025-05-03",
    time: "14:00",
    department: "อายุรกรรม",
    doctor: "นพ.วิชัย",
    disease: "ความดันโลหิตสูง",
    status: "missed",
    reminderSent: true,
    reminderFailed: false,
    familyNotified: true,
    needsTransport: false,
  },
  {
    id: "apt-4",
    patientId: "4",
    patientName: "สุขีย์ จันทร์เพ็ญ",
    hn: "HN-650004",
    date: "2025-05-08",
    time: "11:00",
    department: "ศัลยกรรม",
    doctor: "นพ.ธีรศักดิ์",
    disease: "หลังผ่าตัด",
    status: "upcoming",
    reminderSent: false,
    reminderFailed: true,
    familyNotified: false,
    needsTransport: false,
  },
  {
    id: "apt-5",
    patientId: "8",
    patientName: "จินดา เรืองศรี",
    hn: "HN-650008",
    date: "2025-05-09",
    time: "09:30",
    department: "อายุรกรรม",
    doctor: "นพ.วิชัย",
    disease: "ภาวะหัวใจล้มเหลว",
    status: "upcoming",
    reminderSent: true,
    reminderFailed: false,
    familyNotified: true,
    needsTransport: true,
  },
  {
    id: "apt-6",
    patientId: "5",
    patientName: "บุญมี ทองดี",
    hn: "HN-650005",
    date: "2025-05-10",
    time: "10:00",
    department: "อายุรกรรม",
    doctor: "นพ.วิชัย",
    disease: "ภาวะหัวใจล้มเหลว",
    status: "upcoming",
    reminderSent: true,
    reminderFailed: false,
    familyNotified: false,
    needsTransport: true,
  },
];

export const familyContacts: FamilyContact[] = [
  {
    id: "fc-1",
    patientId: "1",
    patientName: "สมชาย วงศ์สุวรรณ",
    caregiverName: "นางสมศรี วงศ์สุวรรณ",
    relationship: "ภรรยา",
    phone: "081-234-5679",
    lineId: "somsri_w",
    consentLevel: "เต็มรูปแบบ",
    lastNotification: "2025-05-06 10:00",
    notificationHistory: [
      { date: "2025-05-06", type: "สถานะปกติ", status: "ส่งแล้ว" },
      { date: "2025-04-29", type: "แจ้งจำหน่าย", status: "ส่งแล้ว" },
    ],
  },
  {
    id: "fc-2",
    patientId: "2",
    patientName: "วิภา แซ่ลิ้ม",
    caregiverName: "นายวิชัย แซ่ลิ้ม",
    relationship: "บุตรชาย",
    phone: "089-876-5433",
    lineId: "wichai_s",
    consentLevel: "เฉพาะฉุกเฉิน",
    lastNotification: "2025-05-05 15:00",
    notificationHistory: [{ date: "2025-05-05", type: "ลืมยา", status: "ส่งแล้ว" }],
  },
  {
    id: "fc-3",
    patientId: "3",
    patientName: "ประยุทธ์ ศรีสุข",
    caregiverName: "นางสาวปรียา ศรีสุข",
    relationship: "บุตรสาว",
    phone: "062-345-6790",
    lineId: "preeya_s",
    consentLevel: "เต็มรูปแบบ",
    lastNotification: "2025-05-06 08:30",
    notificationHistory: [
      { date: "2025-05-06", type: "เคสเร่งด่วน", status: "ส่งแล้ว" },
      { date: "2025-05-06", type: "แจ้งเจ็บหน้าอก", status: "ส่งแล้ว" },
    ],
  },
  {
    id: "fc-4",
    patientId: "5",
    patientName: "บุญมี ทองดี",
    caregiverName: "นางสาวบุญศรี ทองดี",
    relationship: "บุตรสาว",
    phone: "083-567-8902",
    lineId: "boonsri_t",
    consentLevel: "เต็มรูปแบบ",
    lastNotification: "2025-05-04 16:00",
    notificationHistory: [{ date: "2025-05-04", type: "ติดต่อไม่ได้", status: "ส่งแล้ว" }],
  },
  {
    id: "fc-5",
    patientId: "8",
    patientName: "จินดา เรืองศรี",
    caregiverName: "นายสมศักดิ์ เรืองศรี",
    relationship: "บุตรชาย",
    phone: "087-890-1235",
    lineId: "somsak_r",
    consentLevel: "เต็มรูปแบบ",
    lastNotification: "2025-05-06 08:00",
    notificationHistory: [{ date: "2025-05-06", type: "ต้องพยาบาลติดตาม", status: "ส่งแล้ว" }],
  },
];

export const caseStatusLabels: Record<CaseStatus, string> = {
  pending: "รอติดตาม",
  contacted: "ติดต่อแล้ว",
  callback: "รอโทรกลับ",
  nurse_review: "รอพยาบาลตรวจ",
  referred_doctor: "ส่งแพทย์",
  referred_pharmacist: "ส่งเภสัชกร",
  family_notified: "แจ้งญาติแล้ว",
  escalated: "ยกระดับ",
  closed: "ปิดเคส",
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  green: "เขียว - ปกติ",
  yellow: "เหลือง - ต้องติดตาม",
  red: "แดง - เร่งด่วน",
};

export const roleLabels: Record<UserRole, string> = {
  admin: "ผู้ดูแลระบบ",
  nurse: "พยาบาล / Case Manager",
  doctor: "แพทย์",
  pharmacist: "เภสัชกร",
  callcenter: "Call Center",
};

// Role permissions
export interface NavItem {
  title: string;
  url: string;
  icon: string;
  badge?: number;
  roles: UserRole[];
}

export const roleMenuConfig: NavItem[] = [
  {
    title: "แดชบอร์ด",
    url: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["admin", "nurse", "doctor", "pharmacist", "callcenter"],
  },
  {
    title: "คิวผู้ป่วย",
    url: "/patients",
    icon: "Users",
    roles: ["admin", "nurse", "doctor", "pharmacist"],
  },
  { title: "ลงทะเบียนใหม่", url: "/register", icon: "UserPlus", roles: ["admin", "nurse"] },
  { title: "จัดการเคส", url: "/cases", icon: "Columns3", roles: ["admin", "nurse", "doctor"] },
  {
    title: "ผลติดตาม AI",
    url: "/ai-followup",
    icon: "Bot",
    roles: ["admin", "nurse", "callcenter"],
  },
  { title: "แผนการดูแล", url: "/care-plans", icon: "ClipboardList", roles: ["admin", "nurse"] },
  {
    title: "การใช้ยา",
    url: "/medication",
    icon: "Pill",
    roles: ["admin", "nurse", "doctor", "pharmacist"],
  },
  {
    title: "นัดหมาย",
    url: "/appointments",
    icon: "CalendarCheck",
    roles: ["admin", "nurse", "callcenter"],
  },
  { title: "แจ้งญาติ", url: "/family", icon: "Heart", roles: ["admin", "nurse", "callcenter"] },
  {
    title: "รายงาน",
    url: "/reports",
    icon: "BarChart3",
    roles: ["admin", "nurse", "doctor", "pharmacist"],
  },
  { title: "AI Agent Center", url: "/ai-agents", icon: "BrainCircuit", roles: ["admin", "nurse"] },
  { title: "อัปเดต", url: "/patch-log", icon: "FileClock", roles: ["admin"] },
  { title: "ตั้งค่า", url: "/settings", icon: "Settings", roles: ["admin"] },
];

// Activity timeline for dashboard
export interface ActivityItem {
  id: string;
  time: string;
  patientId: string;
  patientName: string;
  hn: string;
  action: string;
  type:
    | "call_completed"
    | "no_answer"
    | "risk_upgraded"
    | "sent_nurse"
    | "referred_doctor"
    | "family_notified"
    | "case_closed";
  riskLevel: RiskLevel;
  statusBadge: string;
}

export const activityTimeline: ActivityItem[] = [
  {
    id: "act-1",
    time: "08:00",
    patientId: "3",
    patientName: "ประยุทธ์ ศรีสุข",
    hn: "HN-650003",
    action: "AI ติดตาม — เจ็บหน้าอก BP 180/120 ส่งต่อพยาบาลทันที",
    type: "risk_upgraded",
    riskLevel: "red",
    statusBadge: "ต้องดำเนินการ",
  },
  {
    id: "act-2",
    time: "07:45",
    patientId: "8",
    patientName: "จินดา เรืองศรี",
    hn: "HN-650008",
    action: "AI ติดตาม — เหนื่อยง่าย ขาบวม น้ำหนักขึ้น ส่งพยาบาลตรวจ",
    type: "sent_nurse",
    riskLevel: "yellow",
    statusBadge: "รอตรวจสอบ",
  },
  {
    id: "act-3",
    time: "09:30",
    patientId: "1",
    patientName: "สมชาย วงศ์สุวรรณ",
    hn: "HN-650001",
    action: "AI ติดตาม — สถานะปกติ BP 128/82 ทานยาครบ",
    type: "call_completed",
    riskLevel: "green",
    statusBadge: "เสร็จสิ้น",
  },
  {
    id: "act-4",
    time: "10:45",
    patientId: "4",
    patientName: "สุขีย์ จันทร์เพ็ญ",
    hn: "HN-650004",
    action: "AI ติดตาม — แผลบวมแดง มีไข้ ส่งแพทย์",
    type: "referred_doctor",
    riskLevel: "red",
    statusBadge: "ส่งต่อแล้ว",
  },
  {
    id: "act-5",
    time: "14:15",
    patientId: "2",
    patientName: "วิภา แซ่ลิ้ม",
    hn: "HN-650002",
    action: "AI ติดตาม — ลืมยาเบาหวาน 2 วัน ส่งคิวโทรกลับ",
    type: "sent_nurse",
    riskLevel: "yellow",
    statusBadge: "รอโทรกลับ",
  },
  {
    id: "act-6",
    time: "15:30",
    patientId: "5",
    patientName: "บุญมี ทองดี",
    hn: "HN-650005",
    action: "AI โทร — ไม่รับสาย (ครั้งที่ 3) แจ้งญาติแล้ว",
    type: "no_answer",
    riskLevel: "yellow",
    statusBadge: "ติดต่อไม่ได้",
  },
  {
    id: "act-7",
    time: "08:30",
    patientId: "3",
    patientName: "ประยุทธ์ ศรีสุข",
    hn: "HN-650003",
    action: "แจ้งญาติ — ปรียา ศรีสุข รับทราบแล้ว",
    type: "family_notified",
    riskLevel: "red",
    statusBadge: "แจ้งแล้ว",
  },
];

// Message templates for family
export const familyMessageTemplates = [
  {
    id: "tpl-1",
    name: "สถานะปกติ",
    message: "เรียนคุณ{caregiver} ผลการติดตาม{patient} — สถานะปกติ ไม่มีอาการผิดปกติ",
  },
  {
    id: "tpl-2",
    name: "ลืมยา",
    message: "เรียนคุณ{caregiver} {patient} ลืมทานยา กรุณาช่วยเตือนด้วยค่ะ",
  },
  {
    id: "tpl-3",
    name: "ต้องพยาบาลติดตาม",
    message: "เรียนคุณ{caregiver} พยาบาลจะติดต่อ{patient} เพื่อติดตามอาการ",
  },
  {
    id: "tpl-4",
    name: "แจ้งเตือนนัด",
    message: "เรียนคุณ{caregiver} {patient} มีนัดพบแพทย์ วันที่{date} เวลา{time}",
  },
  {
    id: "tpl-5",
    name: "ติดต่อไม่ได้",
    message: "เรียนคุณ{caregiver} ไม่สามารถติดต่อ{patient} ได้ กรุณาช่วยตรวจสอบ",
  },
  {
    id: "tpl-6",
    name: "เคสเร่งด่วน",
    message: "🔴 เรียนคุณ{caregiver} {patient} มีอาการ{symptom} กรุณาพามาพบแพทย์ทันที",
  },
];

// Audit log
export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  isAI: boolean;
}

export const auditLog: AuditEntry[] = [
  {
    id: "aud-1",
    timestamp: "2025-05-06 09:30",
    user: "ระบบ AI",
    role: "system",
    action: "ติดตาม สมชาย วงศ์สุวรรณ สำเร็จ — สีเขียว",
    target: "HN-650001",
    isAI: true,
  },
  {
    id: "aud-2",
    timestamp: "2025-05-06 08:00",
    user: "ระบบ AI",
    role: "system",
    action: "ส่งต่อพยาบาล — ประยุทธ์ ศรีสุข เจ็บหน้าอก",
    target: "HN-650003",
    isAI: true,
  },
  {
    id: "aud-3",
    timestamp: "2025-05-06 08:15",
    user: "พว.สมหญิง",
    role: "nurse",
    action: "รับเคส ประยุทธ์ ศรีสุข ส่งต่อแพทย์",
    target: "HN-650003",
    isAI: false,
  },
  {
    id: "aud-4",
    timestamp: "2025-05-06 08:30",
    user: "ระบบ AI",
    role: "system",
    action: "แจ้งญาติ ปรียา ศรีสุข — เจ็บหน้าอก",
    target: "HN-650003",
    isAI: true,
  },
  {
    id: "aud-5",
    timestamp: "2025-05-05 14:15",
    user: "ระบบ AI",
    role: "system",
    action: "ติดตาม วิภา แซ่ลิ้ม — ลืมยา ส่งพยาบาล",
    target: "HN-650002",
    isAI: true,
  },
  {
    id: "aud-6",
    timestamp: "2025-05-05 16:00",
    user: "พว.นภัสสร",
    role: "nurse",
    action: "โทรกลับ วิภา แซ่ลิ้ม — แนะนำทานยา",
    target: "HN-650002",
    isAI: false,
  },
];
