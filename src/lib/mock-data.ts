// Types
export type RiskLevel = 'green' | 'yellow' | 'red';
export type CaseStatus = 'pending' | 'contacted' | 'callback' | 'referred_doctor' | 'referred_pharmacist' | 'family_notified' | 'escalated' | 'closed';
export type CallStatus = 'completed' | 'no_answer' | 'failed' | 'contacted';
export type UserRole = 'admin' | 'nurse' | 'doctor' | 'pharmacist' | 'callcenter';

export interface Patient {
  id: string;
  hn: string;
  name: string;
  age: number;
  phone: string;
  carePlan: string;
  department: string;
  lastContact: string;
  symptomSummary: string;
  medicationStatus: string;
  appointmentStatus: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReason: string;
  assignedNurse: string;
  caseStatus: CaseStatus;
  consentStatus: string;
  primaryCaregiver: string;
  caregiverPhone: string;
  contactChannel: string;
  admitDate: string;
  dischargeDate: string;
}

export interface AIFollowUp {
  id: string;
  patientId: string;
  patientName: string;
  hn: string;
  callStatus: CallStatus;
  callTime: string;
  duration: string;
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
  patientGroup: string;
  followUpSchedule: string;
  questions: string[];
  redFlags: string[];
  yellowFlags: string[];
  familyNotification: string;
  handoffRule: string;
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
  status: 'upcoming' | 'missed' | 'completed';
  reminderSent: boolean;
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

// Mock patients
export const patients: Patient[] = [
  {
    id: '1', hn: 'HN-650001', name: 'สมชาย วงศ์สุวรรณ', age: 72, phone: '081-234-5678',
    carePlan: 'ผู้สูงอายุหลังจำหน่าย', department: 'อายุรกรรม', lastContact: '2025-05-06 09:30',
    symptomSummary: 'ไม่มีอาการผิดปกติ นอนหลับได้ดี ทานอาหารได้', medicationStatus: 'ทานยาครบ',
    appointmentStatus: 'นัดพบ 12 พ.ค.', riskLevel: 'green', riskScore: 15, riskReason: 'ไม่พบความเสี่ยง',
    assignedNurse: 'พว.สมหญิง', caseStatus: 'contacted', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นางสมศรี วงศ์สุวรรณ (ภรรยา)', caregiverPhone: '081-234-5679',
    contactChannel: 'โทรศัพท์', admitDate: '2025-04-20', dischargeDate: '2025-04-28',
  },
  {
    id: '2', hn: 'HN-650002', name: 'วิภา แซ่ลิ้ม', age: 65, phone: '089-876-5432',
    carePlan: 'ติดตามเบาหวาน', department: 'ต่อมไร้ท่อ', lastContact: '2025-05-05 14:15',
    symptomSummary: 'ลืมทานยาเบาหวาน 2 วัน มีอาการเวียนศีรษะเล็กน้อย', medicationStatus: 'ลืมทานยา',
    appointmentStatus: 'นัดพบ 15 พ.ค.', riskLevel: 'yellow', riskScore: 55, riskReason: 'ลืมทานยาเบาหวาน 2 วัน อาจเกิดภาวะน้ำตาลสูง',
    assignedNurse: 'พว.นภัสสร', caseStatus: 'callback', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นายวิชัย แซ่ลิ้ม (บุตรชาย)', caregiverPhone: '089-876-5433',
    contactChannel: 'LINE', admitDate: '2025-03-10', dischargeDate: '2025-03-15',
  },
  {
    id: '3', hn: 'HN-650003', name: 'ประยุทธ์ ศรีสุข', age: 58, phone: '062-345-6789',
    carePlan: 'ติดตามความดันโลหิตสูง', department: 'หทัยวิทยา', lastContact: '2025-05-06 08:00',
    symptomSummary: 'มีอาการเจ็บแน่นหน้าอก หายใจลำบากเล็กน้อย', medicationStatus: 'ทานยาครบ',
    appointmentStatus: 'ไม่มีนัด', riskLevel: 'red', riskScore: 88, riskReason: 'รายงานอาการเจ็บแน่นหน้าอก อาจเป็นสัญญาณอันตราย',
    assignedNurse: 'พว.สมหญิง', caseStatus: 'escalated', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นางสาวปรียา ศรีสุข (บุตรสาว)', caregiverPhone: '062-345-6790',
    contactChannel: 'โทรศัพท์', admitDate: '2025-04-01', dischargeDate: '2025-04-05',
  },
  {
    id: '4', hn: 'HN-650004', name: 'สุนีย์ จันทร์เพ็ญ', age: 45, phone: '091-456-7890',
    carePlan: 'ติดตามหลังผ่าตัด', department: 'ศัลยกรรม', lastContact: '2025-05-06 10:45',
    symptomSummary: 'แผลผ่าตัดมีอาการบวมแดง มีไข้ 38.2°C', medicationStatus: 'ทานยาครบ',
    appointmentStatus: 'นัดตรวจแผล 8 พ.ค.', riskLevel: 'red', riskScore: 82, riskReason: 'แผลผ่าตัดอักเสบ มีไข้ ต้องพบแพทย์ด่วน',
    assignedNurse: 'พว.นภัสสร', caseStatus: 'referred_doctor', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นายธนา จันทร์เพ็ญ (สามี)', caregiverPhone: '091-456-7891',
    contactChannel: 'โทรศัพท์', admitDate: '2025-04-25', dischargeDate: '2025-05-01',
  },
  {
    id: '5', hn: 'HN-650005', name: 'บุญมี ทองดี', age: 78, phone: '083-567-8901',
    carePlan: 'ผู้สูงอายุหลังจำหน่าย', department: 'อายุรกรรม', lastContact: '2025-05-04 15:30',
    symptomSummary: 'ไม่สามารถติดต่อได้ 3 ครั้ง', medicationStatus: 'ไม่ทราบ',
    appointmentStatus: 'นัดพบ 10 พ.ค.', riskLevel: 'yellow', riskScore: 50, riskReason: 'ไม่สามารถติดต่อได้ 3 ครั้ง ต้องติดตาม',
    assignedNurse: 'พว.สมหญิง', caseStatus: 'callback', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นางสาวบุญศรี ทองดี (บุตรสาว)', caregiverPhone: '083-567-8902',
    contactChannel: 'โทรศัพท์', admitDate: '2025-04-15', dischargeDate: '2025-04-22',
  },
  {
    id: '6', hn: 'HN-650006', name: 'มาลี สมบูรณ์', age: 60, phone: '095-678-9012',
    carePlan: 'ติดตามการทานยา', department: 'อายุรกรรม', lastContact: '2025-05-05 11:00',
    symptomSummary: 'ขาดนัดตรวจ ไม่ได้มาตามนัด', medicationStatus: 'หยุดยาเอง',
    appointmentStatus: 'ขาดนัด 3 พ.ค.', riskLevel: 'yellow', riskScore: 60, riskReason: 'ขาดนัดพบแพทย์ หยุดทานยาเอง',
    assignedNurse: 'พว.นภัสสร', caseStatus: 'pending', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นางวรรณา สมบูรณ์ (น้องสาว)', caregiverPhone: '095-678-9013',
    contactChannel: 'LINE', admitDate: '2025-02-20', dischargeDate: '2025-02-25',
  },
  {
    id: '7', hn: 'HN-650007', name: 'อนันต์ พิทักษ์', age: 55, phone: '086-789-0123',
    carePlan: 'ติดตามเบาหวาน', department: 'ต่อมไร้ท่อ', lastContact: '2025-05-06 13:00',
    symptomSummary: 'ควบคุมน้ำตาลได้ดี ออกกำลังกายสม่ำเสมอ', medicationStatus: 'ทานยาครบ',
    appointmentStatus: 'นัดพบ 20 พ.ค.', riskLevel: 'green', riskScore: 10, riskReason: 'ไม่พบความเสี่ยง',
    assignedNurse: 'พว.สมหญิง', caseStatus: 'contacted', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นางอรุณ พิทักษ์ (ภรรยา)', caregiverPhone: '086-789-0124',
    contactChannel: 'โทรศัพท์', admitDate: '2025-01-15', dischargeDate: '2025-01-18',
  },
  {
    id: '8', hn: 'HN-650008', name: 'จินดา เรืองศรี', age: 80, phone: '087-890-1234',
    carePlan: 'ผู้สูงอายุหลังจำหน่าย', department: 'ออร์โธปิดิกส์', lastContact: '2025-05-06 07:45',
    symptomSummary: 'ปวดสะโพกมาก เดินลำบาก กลัวล้ม', medicationStatus: 'ทานยาครบ',
    appointmentStatus: 'นัดพบ 9 พ.ค.', riskLevel: 'yellow', riskScore: 45, riskReason: 'เสี่ยงล้ม ปวดสะโพก ต้องติดตาม',
    assignedNurse: 'พว.นภัสสร', caseStatus: 'callback', consentStatus: 'ยินยอม',
    primaryCaregiver: 'นายสมศักดิ์ เรืองศรี (บุตรชาย)', caregiverPhone: '087-890-1235',
    contactChannel: 'โทรศัพท์', admitDate: '2025-04-28', dischargeDate: '2025-05-03',
  },
];

export const aiFollowUps: AIFollowUp[] = [
  {
    id: 'ai-1', patientId: '1', patientName: 'สมชาย วงศ์สุวรรณ', hn: 'HN-650001',
    callStatus: 'completed', callTime: '2025-05-06 09:30', duration: '4:23',
    transcript: 'AI: สวัสดีค่ะ คุณสมชาย สบายดีไหมคะ\nผู้ป่วย: สบายดีครับ\nAI: ทานยาครบทุกมื้อไหมคะ\nผู้ป่วย: ทานครบครับ ไม่ได้ลืมเลย\nAI: มีอาการผิดปกติไหมคะ เช่น เจ็บหน้าอก เวียนศีรษะ\nผู้ป่วย: ไม่มีครับ ปกติดี\nAI: นอนหลับได้ดีไหมคะ\nผู้ป่วย: หลับได้ดีครับ\nAI: ขอบคุณค่ะ พบแพทย์ 12 พ.ค. นะคะ',
    summary: 'ผู้ป่วยสบายดี ทานยาครบ ไม่มีอาการผิดปกติ นอนหลับดี พร้อมพบแพทย์ตามนัด',
    symptoms: [], medicationAdherence: 'ทานครบทุกมื้อ', vitalSigns: 'ไม่ได้วัด',
    appointmentUnderstanding: 'เข้าใจนัดพบแพทย์ 12 พ.ค.', fallRisk: 'ต่ำ', caregiverAvailability: 'ภรรยาดูแล',
    riskLevel: 'green', riskExplanation: 'ผู้ป่วยสบายดี ทานยาครบ ไม่มีอาการผิดปกติ', confidence: 95, humanReviewRequired: false,
  },
  {
    id: 'ai-2', patientId: '2', patientName: 'วิภา แซ่ลิ้ม', hn: 'HN-650002',
    callStatus: 'completed', callTime: '2025-05-05 14:15', duration: '6:10',
    transcript: 'AI: สวัสดีค่ะ คุณวิภา ทานยาเบาหวานครบไหมคะ\nผู้ป่วย: ลืมทาน 2 วันค่ะ ยุ่งดูแลหลาน\nAI: มีอาการอะไรผิดปกติไหมคะ\nผู้ป่วย: เวียนหัวนิดหน่อยค่ะ\nAI: วัดน้ำตาลล่าสุดเท่าไหร่คะ\nผู้ป่วย: ไม่ได้วัดค่ะ เครื่องเสีย\nAI: แนะนำให้กลับมาทานยาตามปกติ และวัดน้ำตาลนะคะ',
    summary: 'ผู้ป่วยลืมทานยาเบาหวาน 2 วัน มีอาการเวียนศีรษะ ไม่ได้วัดระดับน้ำตาล เครื่องวัดเสีย ต้องติดตาม',
    symptoms: ['เวียนศีรษะ'], medicationAdherence: 'ลืมทาน 2 วัน', vitalSigns: 'ไม่ได้วัด เครื่องเสีย',
    appointmentUnderstanding: 'จำนัดได้ 15 พ.ค.', fallRisk: 'ปานกลาง', caregiverAvailability: 'บุตรชายอยู่คนละจังหวัด',
    riskLevel: 'yellow', riskExplanation: 'ลืมทานยาเบาหวาน 2 วัน + เวียนศีรษะ + ไม่ได้วัดน้ำตาล → เสี่ยงภาวะน้ำตาลสูง', confidence: 85, humanReviewRequired: true,
  },
  {
    id: 'ai-3', patientId: '3', patientName: 'ประยุทธ์ ศรีสุข', hn: 'HN-650003',
    callStatus: 'completed', callTime: '2025-05-06 08:00', duration: '5:45',
    transcript: 'AI: สวัสดีค่ะ คุณประยุทธ์ วันนี้เป็นยังไงบ้างคะ\nผู้ป่วย: ไม่ค่อยดีครับ เจ็บหน้าอก\nAI: เจ็บแบบไหนคะ เจ็บแปลบ หรือ แน่นๆ\nผู้ป่วย: แน่นๆ ครับ หายใจก็ลำบากนิดหน่อย\nAI: เริ่มเจ็บตั้งแต่เมื่อไหร่คะ\nผู้ป่วย: ตั้งแต่เมื่อคืนครับ\nAI: กรุณารอสายค่ะ จะส่งต่อพยาบาลทันที',
    summary: 'ผู้ป่วยมีอาการเจ็บแน่นหน้าอกตั้งแต่เมื่อคืน หายใจลำบาก ต้องพบแพทย์ทันที',
    symptoms: ['เจ็บแน่นหน้าอก', 'หายใจลำบาก'], medicationAdherence: 'ทานครบ', vitalSigns: 'ไม่ได้วัด',
    appointmentUnderstanding: 'ไม่มีนัด', fallRisk: 'ต่ำ', caregiverAvailability: 'บุตรสาวดูแล',
    riskLevel: 'red', riskExplanation: 'เจ็บแน่นหน้าอก + หายใจลำบาก ในผู้ป่วยโรคความดันโลหิตสูง → สัญญาณอันตราย ต้องพบแพทย์ทันที', confidence: 92, humanReviewRequired: true,
  },
  {
    id: 'ai-4', patientId: '5', patientName: 'บุญมี ทองดี', hn: 'HN-650005',
    callStatus: 'no_answer', callTime: '2025-05-04 15:30', duration: '0:00',
    transcript: '', summary: 'ไม่สามารถติดต่อผู้ป่วยได้ โทร 3 ครั้ง ไม่รับสาย',
    symptoms: [], medicationAdherence: 'ไม่ทราบ', vitalSigns: 'ไม่ทราบ',
    appointmentUnderstanding: 'ไม่ทราบ', fallRisk: 'ไม่ทราบ', caregiverAvailability: 'ไม่ทราบ',
    riskLevel: 'yellow', riskExplanation: 'ไม่สามารถติดต่อได้ 3 ครั้ง ผู้ป่วยสูงอายุ 78 ปี ต้องติดตามทางอื่น', confidence: 70, humanReviewRequired: true,
  },
];

export const carePlanTemplates: CarePlanTemplate[] = [
  { id: 'cp-1', name: 'ติดตามเบาหวาน', patientGroup: 'ผู้ป่วยเบาหวานทุกประเภท', followUpSchedule: 'ทุก 3 วัน',
    questions: ['ทานยาครบไหม', 'วัดน้ำตาลล่าสุดเท่าไหร่', 'มีอาการเวียนศีรษะไหม', 'ทานอาหารได้ปกติไหม', 'ออกกำลังกายไหม'],
    redFlags: ['น้ำตาลต่ำกว่า 70', 'หมดสติ', 'ชัก'], yellowFlags: ['ลืมทานยา', 'น้ำตาลสูงกว่า 250', 'เวียนศีรษะ'],
    familyNotification: 'แจ้งญาติเมื่อระดับสีเหลืองขึ้นไป', handoffRule: 'ส่งพยาบาลทันทีเมื่อระดับสีแดง' },
  { id: 'cp-2', name: 'ติดตามความดันโลหิตสูง', patientGroup: 'ผู้ป่วยความดันโลหิตสูง', followUpSchedule: 'ทุก 7 วัน',
    questions: ['วัดความดันล่าสุดเท่าไหร่', 'มีอาการปวดศีรษะไหม', 'เจ็บหน้าอกไหม', 'ทานยาครบไหม'],
    redFlags: ['เจ็บหน้าอก', 'หายใจลำบาก', 'ความดันสูงกว่า 180/120'], yellowFlags: ['ลืมทานยา', 'ปวดศีรษะบ่อย'],
    familyNotification: 'แจ้งญาติทันทีเมื่อระดับสีแดง', handoffRule: 'ส่งแพทย์ทันทีเมื่อเจ็บหน้าอก' },
  { id: 'cp-3', name: 'ติดตามหลังผ่าตัด', patientGroup: 'ผู้ป่วยหลังผ่าตัดทุกประเภท', followUpSchedule: 'ทุกวัน (7 วันแรก)',
    questions: ['แผลเป็นยังไง', 'มีไข้ไหม', 'ปวดมากไหม', 'ทานยาแก้ปวดครบไหม'],
    redFlags: ['ไข้สูงกว่า 38.5', 'แผลมีหนอง', 'เลือดออกมาก'], yellowFlags: ['แผลบวมแดง', 'ไข้ต่ำ', 'ปวดมากขึ้น'],
    familyNotification: 'แจ้งญาติเมื่อมีปัญหาแผล', handoffRule: 'ส่งแพทย์เมื่อสงสัยติดเชื้อ' },
  { id: 'cp-4', name: 'ดูแลผู้สูงอายุ', patientGroup: 'ผู้สูงอายุ 65 ปีขึ้นไป', followUpSchedule: 'ทุก 5 วัน',
    questions: ['ทานอาหารได้ไหม', 'นอนหลับดีไหม', 'เดินได้ปกติไหม', 'ล้มบ้างไหม', 'มีคนดูแลไหม'],
    redFlags: ['ล้ม', 'สับสน', 'ไม่ทานอาหาร 2 วัน'], yellowFlags: ['นอนไม่หลับ', 'ไม่มีคนดูแล', 'ปวดตามตัว'],
    familyNotification: 'แจ้งญาติทุกสัปดาห์', handoffRule: 'ส่งพยาบาลเมื่อเสี่ยงล้ม' },
  { id: 'cp-5', name: 'ผู้ป่วยหลังจำหน่าย', patientGroup: 'ผู้ป่วยหลังจำหน่ายจากโรงพยาบาล', followUpSchedule: 'วันที่ 1, 3, 7, 14',
    questions: ['อาการเป็นอย่างไร', 'ทานยาครบไหม', 'มีอาการใหม่ไหม', 'เข้าใจการนัดพบแพทย์ไหม'],
    redFlags: ['อาการแย่ลง', 'ไข้สูง', 'หายใจลำบาก'], yellowFlags: ['ลืมทานยา', 'ไม่เข้าใจการดูแลตัวเอง'],
    familyNotification: 'แจ้งญาติหลังจำหน่าย 24 ชม.', handoffRule: 'ส่งพยาบาลเมื่ออาการแย่ลง' },
  { id: 'cp-6', name: 'ติดตามการทานยา', patientGroup: 'ผู้ป่วยที่มีปัญหาการทานยา', followUpSchedule: 'ทุก 2 วัน',
    questions: ['ทานยาครบไหม', 'มีผลข้างเคียงไหม', 'เข้าใจวิธีทานยาไหม', 'ยาหมดเมื่อไหร่'],
    redFlags: ['หยุดยาเอง', 'แพ้ยา', 'ผลข้างเคียงรุนแรง'], yellowFlags: ['ลืมทานยาบ่อย', 'ไม่เข้าใจวิธีทาน'],
    familyNotification: 'แจ้งญาติเมื่อผู้ป่วยหยุดยา', handoffRule: 'ส่งเภสัชกรเมื่อมีปัญหายา' },
];

export const appointments: Appointment[] = [
  { id: 'apt-1', patientId: '1', patientName: 'สมชาย วงศ์สุวรรณ', hn: 'HN-650001', date: '2025-05-12', time: '09:00', department: 'อายุรกรรม', doctor: 'นพ.วิชัย', status: 'upcoming', reminderSent: true, familyNotified: true, needsTransport: false },
  { id: 'apt-2', patientId: '2', patientName: 'วิภา แซ่ลิ้ม', hn: 'HN-650002', date: '2025-05-15', time: '10:30', department: 'ต่อมไร้ท่อ', doctor: 'พญ.สุวรรณี', status: 'upcoming', reminderSent: true, familyNotified: false, needsTransport: false },
  { id: 'apt-3', patientId: '6', patientName: 'มาลี สมบูรณ์', hn: 'HN-650006', date: '2025-05-03', time: '14:00', department: 'อายุรกรรม', doctor: 'นพ.วิชัย', status: 'missed', reminderSent: true, familyNotified: true, needsTransport: false },
  { id: 'apt-4', patientId: '4', patientName: 'สุนีย์ จันทร์เพ็ญ', hn: 'HN-650004', date: '2025-05-08', time: '11:00', department: 'ศัลยกรรม', doctor: 'นพ.ธีรศักดิ์', status: 'upcoming', reminderSent: false, familyNotified: false, needsTransport: false },
  { id: 'apt-5', patientId: '8', patientName: 'จินดา เรืองศรี', hn: 'HN-650008', date: '2025-05-09', time: '09:30', department: 'ออร์โธปิดิกส์', doctor: 'นพ.กิตติ', status: 'upcoming', reminderSent: true, familyNotified: true, needsTransport: true },
];

export const familyContacts: FamilyContact[] = [
  { id: 'fc-1', patientId: '1', patientName: 'สมชาย วงศ์สุวรรณ', caregiverName: 'นางสมศรี วงศ์สุวรรณ', relationship: 'ภรรยา', phone: '081-234-5679', lineId: 'somsri_w', consentLevel: 'เต็มรูปแบบ', lastNotification: '2025-05-06 10:00', notificationHistory: [{ date: '2025-05-06', type: 'สรุปการติดตาม', status: 'ส่งแล้ว' }, { date: '2025-04-29', type: 'แจ้งจำหน่าย', status: 'ส่งแล้ว' }] },
  { id: 'fc-2', patientId: '2', patientName: 'วิภา แซ่ลิ้ม', caregiverName: 'นายวิชัย แซ่ลิ้ม', relationship: 'บุตรชาย', phone: '089-876-5433', lineId: 'wichai_s', consentLevel: 'เฉพาะกรณีฉุกเฉิน', lastNotification: '2025-05-05 15:00', notificationHistory: [{ date: '2025-05-05', type: 'แจ้งลืมทานยา', status: 'ส่งแล้ว' }] },
  { id: 'fc-3', patientId: '3', patientName: 'ประยุทธ์ ศรีสุข', caregiverName: 'นางสาวปรียา ศรีสุข', relationship: 'บุตรสาว', phone: '062-345-6790', lineId: 'preeya_s', consentLevel: 'เต็มรูปแบบ', lastNotification: '2025-05-06 08:30', notificationHistory: [{ date: '2025-05-06', type: 'แจ้งเตือนฉุกเฉิน', status: 'ส่งแล้ว' }, { date: '2025-05-06', type: 'แจ้งเจ็บหน้าอก', status: 'ส่งแล้ว' }] },
];

export const caseStatusLabels: Record<CaseStatus, string> = {
  pending: 'รอติดตาม',
  contacted: 'ติดต่อแล้ว',
  callback: 'รอโทรกลับ',
  referred_doctor: 'ส่งแพทย์',
  referred_pharmacist: 'ส่งเภสัชกร',
  family_notified: 'แจ้งญาติแล้ว',
  escalated: 'ยกระดับ',
  closed: 'ปิดเคส',
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  green: 'เขียว - ปกติ',
  yellow: 'เหลือง - ต้องติดตาม',
  red: 'แดง - เร่งด่วน',
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'ผู้ดูแลระบบ',
  nurse: 'พยาบาล / ผู้จัดการเคส',
  doctor: 'แพทย์',
  pharmacist: 'เภสัชกร',
  callcenter: 'Call Center',
};
