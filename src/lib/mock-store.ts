/**
 * CareGo v2.1 — Prototype Mock Store
 * Central frontend mock state manager.
 * Uses useSyncExternalStore pattern for React integration.
 * Persists key data to localStorage.
 */
import { patients as initialPatients, aiFollowUps as initialFollowUps, type Patient, type AIFollowUp, type CaseStatus, type RiskLevel } from './mock-data';

// Types
export interface ActionLogEntry {
  id: string;
  patientId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  note: string;
  type?: 'case' | 'ai' | 'medical' | 'medication' | 'system' | 'family' | 'call';
}

export interface NotificationEntry {
  id: string;
  patientId: string;
  patientName: string;
  caregiverName: string;
  type: string;
  message: string;
  template?: string;
  timestamp: string;
  status: 'sent' | 'failed';
}

export interface AlertEntry {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  severity: 'red' | 'yellow';
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export interface TopNotification {
  id: string;
  title: string;
  description: string;
  patientId?: string;
  aiResultId?: string;
  type: 'red_case' | 'human_review' | 'no_answer' | 'medication' | 'missed_appointment';
  read: boolean;
  timestamp: string;
}

// State
let _patients: Patient[] = JSON.parse(JSON.stringify(initialPatients));
let _followUps: AIFollowUp[] = JSON.parse(JSON.stringify(initialFollowUps));
let _actionLog: ActionLogEntry[] = [];
let _notificationLog: NotificationEntry[] = [];
let _alerts: AlertEntry[] = [];
let _topNotifications: TopNotification[] = [];
let _listeners: Set<() => void> = new Set();

// Helpers
function emit() { _listeners.forEach(fn => fn()); }
function now() { return new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }); }
function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

// Init alerts from current red patients + AI requiring review
function initAlerts() {
  _alerts = [];
  const reds = _patients.filter(p => p.riskLevel === 'red');
  reds.forEach(p => {
    _alerts.push({
      id: uid(), patientId: p.id, patientName: p.name,
      title: p.redFlagReason?.includes('เจ็บ') ? 'Critical Vitals' : 'High Risk Patient',
      description: `${p.name} — ${p.redFlagReason || p.riskReason}`,
      severity: 'red', timestamp: now(), acknowledged: false,
    });
  });
  // AI human review required
  _followUps.filter(f => f.humanReviewRequired).forEach(f => {
    _topNotifications.push({
      id: uid(), title: 'AI ต้องการ Human Review',
      description: `${f.patientName} — ${f.summary.slice(0, 60)}...`,
      patientId: f.patientId, aiResultId: f.id,
      type: 'human_review', read: false, timestamp: now(),
    });
  });
  // No answer patients
  _followUps.filter(f => f.callStatus === 'no_answer').forEach(f => {
    _topNotifications.push({
      id: uid(), title: 'ติดต่อผู้ป่วยไม่ได้',
      description: `${f.patientName} — โทรไม่รับ`,
      patientId: f.patientId, type: 'no_answer', read: false, timestamp: now(),
    });
  });
  // Red case notifications
  reds.forEach(p => {
    _topNotifications.push({
      id: uid(), title: `ผู้ป่วยความเสี่ยงสูง`, description: `${p.name} — ${p.riskReason}`,
      patientId: p.id, type: 'red_case', read: false, timestamp: now(),
    });
  });
}

// Try to load from localStorage
function loadFromStorage() {
  try {
    const saved = localStorage.getItem('carego_store');
    if (saved) {
      const data = JSON.parse(saved);
      if (data._patients) _patients = data._patients;
      if (data._actionLog) _actionLog = data._actionLog;
      if (data._notificationLog) _notificationLog = data._notificationLog;
      if (data._alerts) _alerts = data._alerts;
      if (data._topNotifications) _topNotifications = data._topNotifications;
      return;
    }
  } catch { /* ignore */ }
  initAlerts();
}

function saveToStorage() {
  try {
    localStorage.setItem('carego_store', JSON.stringify({
      _patients, _actionLog, _notificationLog, _alerts, _topNotifications,
    }));
  } catch { /* ignore */ }
}

function emitAndSave() { 
  _patients = [..._patients];
  _followUps = [..._followUps];
  _actionLog = [..._actionLog];
  _notificationLog = [..._notificationLog];
  _alerts = [..._alerts];
  _topNotifications = [..._topNotifications];
  saveToStorage(); 
  emit(); 
}

// Initialize
loadFromStorage();

export const mockStore = {
  subscribe(fn: () => void) { _listeners.add(fn); return () => { _listeners.delete(fn); }; },

  // Getters
  getPatients() { return _patients; },
  getFollowUps() { return _followUps; },
  getActionLog() { return _actionLog; },
  getNotificationLog() { return _notificationLog; },
  getAlerts() { return _alerts; },
  getTopNotifications() { return _topNotifications; },
  getUnreadCount() { return _topNotifications.filter(n => !n.read).length + _alerts.filter(a => !a.acknowledged).length; },
  
  getPatient(id: string) { return _patients.find(p => p.id === id); },
  getFollowUp(id: string) { return _followUps.find(f => f.id === id); },
  getActionLogForPatient(patientId: string) { return _actionLog.filter(a => a.patientId === patientId); },
  getNotificationsForPatient(patientId: string) { return _notificationLog.filter(n => n.patientId === patientId); },

  // Actions
  updatePatientStatus(patientId: string, status: CaseStatus, by: string, note?: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = status;
      _actionLog.unshift({ id: uid(), patientId, action: `เปลี่ยนสถานะเป็น ${status}`, performedBy: by, timestamp: now(), note: note || '', type: 'case' });
      emitAndSave();
    }
  },

  updateRiskLevel(patientId: string, riskLevel: RiskLevel, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.riskLevel = riskLevel;
      _actionLog.unshift({ id: uid(), patientId, action: `เปลี่ยนระดับความเสี่ยงเป็น ${riskLevel}`, performedBy: by, timestamp: now(), note: '', type: 'case' });
      emitAndSave();
    }
  },

  referDoctor(patientId: string, doctor: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'referred_doctor';
      if (doctor) p.assignedDoctor = doctor;
      _actionLog.unshift({ id: uid(), patientId, action: `ส่งต่อแพทย์ ${doctor || p.assignedDoctor}`, performedBy: by, timestamp: now(), note: '', type: 'medical' });
      emitAndSave();
    }
  },

  referPharmacist(patientId: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'referred_pharmacist';
      p.pharmacistStatus = 'รอตรวจ';
      _actionLog.unshift({ id: uid(), patientId, action: 'ส่งต่อเภสัชกร', performedBy: by, timestamp: now(), note: '', type: 'medication' });
      emitAndSave();
    }
  },

  closeCase(patientId: string, reason: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'closed';
      _actionLog.unshift({ id: uid(), patientId, action: `ปิดเคส — ${reason}`, performedBy: by, timestamp: now(), note: reason, type: 'case' });
      emitAndSave();
    }
  },

  logCallback(patientId: string, result: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'contacted';
      p.lastContact = now();
      _actionLog.unshift({ id: uid(), patientId, action: `โทรกลับ — ${result}`, performedBy: by, timestamp: now(), note: result, type: 'call' });
      emitAndSave();
    }
  },

  startCallback(patientId: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'callback';
      _actionLog.unshift({ id: uid(), patientId, action: 'เริ่มโทรกลับ', performedBy: by, timestamp: now(), note: '', type: 'call' });
      emitAndSave();
    }
  },

  completeCallback(patientId: string, note: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'contacted';
      p.lastContact = now();
      _actionLog.unshift({ id: uid(), patientId, action: `โทรกลับสำเร็จ — ${note}`, performedBy: by, timestamp: now(), note, type: 'call' });
      emitAndSave();
    }
  },

  notifyFamily(patientId: string, message: string, template: string, by: string) {
    const p = _patients.find(x => x.id === patientId);
    if (p) {
      p.caseStatus = 'family_notified';
      _notificationLog.unshift({
        id: uid(), patientId, patientName: p.name, caregiverName: p.primaryCaregiver,
        type: 'LINE', message, template, timestamp: now(), status: 'sent',
      });
      _actionLog.unshift({ id: uid(), patientId, action: `แจ้งญาติ — ${p.primaryCaregiver}`, performedBy: by, timestamp: now(), note: message, type: 'family' });
      emitAndSave();
    }
  },

  sendToNurseQueue(followUpId: string, by: string) {
    const f = _followUps.find(x => x.id === followUpId);
    if (f) {
      const p = _patients.find(x => x.id === f.patientId);
      if (p) { p.caseStatus = 'nurse_review'; }
      _actionLog.unshift({ id: uid(), patientId: f.patientId, action: 'ส่งเข้าคิวพยาบาล', performedBy: by, timestamp: now(), note: '', type: 'case' });
      emitAndSave();
    }
  },

  sendAIResultToNurseQueue(aiResultId: string, by: string) {
    this.sendToNurseQueue(aiResultId, by);
  },

  acknowledgeAlert(alertId: string, by: string) {
    const a = _alerts.find(x => x.id === alertId);
    if (a) {
      a.acknowledged = true;
      a.acknowledgedBy = by;
      _actionLog.unshift({ id: uid(), patientId: a.patientId, action: `รับทราบการแจ้งเตือน — ${a.title}`, performedBy: by, timestamp: now(), note: '', type: 'system' });
      emitAndSave();
    }
  },

  markNotificationRead(notifId: string) {
    const n = _topNotifications.find(x => x.id === notifId);
    if (n) { n.read = true; emitAndSave(); }
  },

  markAllNotificationsRead() {
    _topNotifications.forEach(n => { n.read = true; });
    emitAndSave();
  },

  addPatient(data: Partial<Patient>): string {
    const id = uid();
    const hn = `HN${Date.now().toString().slice(-4)}`;
    const newP: Patient = {
      id, hn,
      name: data.name || 'ผู้ป่วยใหม่', age: data.age || 50, gender: data.gender || 'ไม่ระบุ',
      phone: data.phone || '', carePlan: data.carePlan || '', carePlanType: data.carePlanType || 'hypertension',
      department: data.department || 'อายุรกรรม', lastContact: '-', symptomSummary: '-',
      medicationStatus: 'ไม่ทราบ', appointmentStatus: '-',
      riskLevel: 'green', riskScore: 0, riskReason: '-', redFlagReason: '', yellowFlagReason: '',
      assignedNurse: data.assignedNurse || 'พว.สมหญิง', assignedDoctor: data.assignedDoctor || 'นพ.วิชัย',
      caseStatus: 'pending', consentStatus: data.consentStatus || 'ยินยอม',
      primaryCaregiver: data.primaryCaregiver || '', caregiverPhone: data.caregiverPhone || '',
      contactChannel: 'โทรศัพท์', admitDate: now(), dischargeDate: '-',
      latestBP: data.latestBP || '-', latestBloodSugar: data.latestBloodSugar || '-', latestWeightChange: data.latestWeightChange || '-',
      medicationAdherence: '-', pharmacistStatus: 'ไม่ต้องตรวจ', familyConsentLevel: data.familyConsentLevel || 'เต็มรูปแบบ',
      medications: [],
    };
    _patients.unshift(newP);
    _actionLog.unshift({ id: uid(), patientId: id, action: `ลงทะเบียนผู้ป่วยใหม่ — ${newP.name}`, performedBy: 'ระบบ', timestamp: now(), note: '', type: 'system' });
    emitAndSave();
    return id;
  },

  createPatientFromRegistration(formData: {
    hn?: string; name: string; age: number; gender: string; phone: string;
    department: string; disease: string; carePlanType: string;
    channel: string; doctor: string; nurse: string;
    caregiverName: string; caregiverPhone: string; familyConsent: string;
  }): string {
    return this.addPatient({
      name: formData.name, age: formData.age, gender: formData.gender,
      phone: formData.phone, department: formData.department,
      carePlan: formData.disease, carePlanType: formData.carePlanType as any,
      assignedDoctor: formData.doctor, assignedNurse: formData.nurse,
      primaryCaregiver: formData.caregiverName, caregiverPhone: formData.caregiverPhone,
      familyConsentLevel: formData.familyConsent,
    });
  },

  addActionLog(patientId: string, action: string, by: string, type?: ActionLogEntry['type']) {
    _actionLog.unshift({ id: uid(), patientId, action, performedBy: by, timestamp: now(), note: '', type: type || 'case' });
    emitAndSave();
  },

  reset() {
    localStorage.removeItem('carego_store');
    _patients = JSON.parse(JSON.stringify(initialPatients));
    _followUps = JSON.parse(JSON.stringify(initialFollowUps));
    _actionLog = [];
    _notificationLog = [];
    _alerts = [];
    _topNotifications = [];
    initAlerts();
    emitAndSave();
  },
};
