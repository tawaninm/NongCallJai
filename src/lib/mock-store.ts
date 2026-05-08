/**
 * Mutable mock store for prototype mode.
 * Allows buttons/modals to update patient state, case status, etc.
 * Uses localStorage + React state via useSyncExternalStore pattern.
 */
import { patients as initialPatients, aiFollowUps as initialFollowUps, type Patient, type AIFollowUp, type CaseStatus, type RiskLevel } from './mock-data';

// Deep clone initial data so mutations don't affect original
let _patients: Patient[] = JSON.parse(JSON.stringify(initialPatients));
let _followUps: AIFollowUp[] = JSON.parse(JSON.stringify(initialFollowUps));
let _actionLog: ActionLogEntry[] = [];
let _notificationLog: NotificationEntry[] = [];
let _listeners: Set<() => void> = new Set();

export interface ActionLogEntry {
  id: string;
  patientId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  note: string;
}

export interface NotificationEntry {
  id: string;
  patientId: string;
  patientName: string;
  caregiverName: string;
  type: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'failed';
}

function emit() { _listeners.forEach(fn => fn()); }
function now() { return new Date().toLocaleString('th-TH'); }
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

export const mockStore = {
  subscribe(fn: () => void) { _listeners.add(fn); return () => { _listeners.delete(fn); }; },

  getPatients() { return _patients; },
  getFollowUps() { return _followUps; },
  getActionLog() { return _actionLog; },
  getNotificationLog() { return _notificationLog; },

  getPatient(id: string) { return _patients.find(p => p.id === id); },
  getFollowUp(id: string) { return _followUps.find(f => f.id === id); },

  updatePatientStatus(patientId: string, status: CaseStatus, by: string, note?: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = status;
      _actionLog.unshift({ id: uid(), patientId, action: `เปลี่ยนสถานะเป็น ${status}`, performedBy: by, timestamp: now(), note: note || '' });
      emit();
    }
  },

  referDoctor(patientId: string, doctor: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'referred_doctor';
      p.assignedDoctor = doctor;
      _actionLog.unshift({ id: uid(), patientId, action: `ส่งต่อแพทย์ ${doctor}`, performedBy: by, timestamp: now(), note: '' });
      emit();
    }
  },

  referPharmacist(patientId: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'referred_pharmacist';
      p.pharmacistStatus = 'รอตรวจ';
      _actionLog.unshift({ id: uid(), patientId, action: 'ส่งต่อเภสัชกร', performedBy: by, timestamp: now(), note: '' });
      emit();
    }
  },

  closeCase(patientId: string, reason: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'closed';
      _actionLog.unshift({ id: uid(), patientId, action: `ปิดเคส — ${reason}`, performedBy: by, timestamp: now(), note: reason });
      emit();
    }
  },

  logCallback(patientId: string, result: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'contacted';
      p.lastContact = now();
      _actionLog.unshift({ id: uid(), patientId, action: `โทรกลับ — ${result}`, performedBy: by, timestamp: now(), note: result });
      emit();
    }
  },

  notifyFamily(patientId: string, message: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'family_notified';
      _notificationLog.unshift({
        id: uid(), patientId, patientName: p.name, caregiverName: p.primaryCaregiver,
        type: 'LINE', message, timestamp: now(), status: 'sent',
      });
      _actionLog.unshift({ id: uid(), patientId, action: `แจ้งญาติ — ${p.primaryCaregiver}`, performedBy: by, timestamp: now(), note: message });
      emit();
    }
  },

  sendToNurseQueue(followUpId: string, by: string) {
    const f = _followUps.find(x => x.id === followUpId);
    if (f) {
      const p = _patients.find(x => x.id === f.patientId);
      if (p) { p.caseStatus = 'nurse_review'; }
      _actionLog.unshift({ id: uid(), patientId: f.patientId, action: 'ส่งเข้าคิวพยาบาล', performedBy: by, timestamp: now(), note: '' });
      emit();
    }
  },

  addPatient(data: Partial<Patient>): string {
    const id = uid();
    const newP: Patient = {
      id, hn: `HN-${Date.now().toString().slice(-6)}`,
      name: data.name || 'ผู้ป่วยใหม่', age: data.age || 50, gender: data.gender || 'ไม่ระบุ',
      phone: data.phone || '', carePlan: data.carePlan || '', carePlanType: data.carePlanType || 'hypertension',
      department: data.department || 'อายุรกรรม', lastContact: '-', symptomSummary: '-',
      medicationStatus: 'ไม่ทราบ', appointmentStatus: '-',
      riskLevel: 'green', riskScore: 0, riskReason: '-', redFlagReason: '', yellowFlagReason: '',
      assignedNurse: data.assignedNurse || 'พว.สมหญิง', assignedDoctor: data.assignedDoctor || 'นพ.วิชัย',
      caseStatus: 'pending', consentStatus: data.consentStatus || 'ยินยอม',
      primaryCaregiver: data.primaryCaregiver || '', caregiverPhone: data.caregiverPhone || '',
      contactChannel: 'โทรศัพท์', admitDate: now(), dischargeDate: '-',
      latestBP: '-', latestBloodSugar: '-', latestWeightChange: '-',
      medicationAdherence: '-', pharmacistStatus: 'ไม่ต้องตรวจ', familyConsentLevel: data.familyConsentLevel || 'เต็มรูปแบบ',
      medications: [],
    };
    _patients.unshift(newP);
    emit();
    return id;
  },

  acknowledgeAlert(patientId: string, by: string) {
    _actionLog.unshift({ id: uid(), patientId, action: 'รับทราบการแจ้งเตือน', performedBy: by, timestamp: now(), note: '' });
    emit();
  },

  getActionLogForPatient(patientId: string) {
    return _actionLog.filter(a => a.patientId === patientId);
  },

  reset() {
    _patients = JSON.parse(JSON.stringify(initialPatients));
    _followUps = JSON.parse(JSON.stringify(initialFollowUps));
    _actionLog = [];
    _notificationLog = [];
    emit();
  },
};
