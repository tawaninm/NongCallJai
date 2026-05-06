import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { patients, aiFollowUps } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  ArrowLeft, Phone, Bell, UserPlus, Pill, CalendarPlus, XCircle,
  User, FileText, MessageSquare, Mic, HeartPulse, Calendar, Users as UsersIcon, ClipboardList,
} from 'lucide-react';

export const Route = createFileRoute('/patients/$patientId')({
  component: PatientDetailPage,
});

function PatientDetailPage() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const patient = patients.find(p => p.id === patientId);
  const followUp = aiFollowUps.find(f => f.patientId === patientId);
  const [activeTab, setActiveTab] = useState('overview');
  const [nurseNote, setNurseNote] = useState('');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">ไม่พบข้อมูลผู้ป่วย</p>
        <button onClick={() => navigate({ to: '/patients' })} className="mt-4 text-primary hover:underline">กลับไปคิวผู้ป่วย</button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: User },
    { id: 'ai-summary', label: 'สรุป AI', icon: FileText },
    { id: 'transcript', label: 'บทสนทนา', icon: MessageSquare },
    { id: 'recording', label: 'บันทึกเสียง', icon: Mic },
    { id: 'medication', label: 'ยา', icon: Pill },
    { id: 'appointment', label: 'นัดหมาย', icon: Calendar },
    { id: 'family', label: 'ญาติ/ผู้ดูแล', icon: UsersIcon },
    { id: 'action-log', label: 'บันทึกกิจกรรม', icon: ClipboardList },
  ];

  const actionLog = [
    { time: '2025-05-06 09:30', action: 'AI ติดตามโทรศัพท์ — สำเร็จ', by: 'ระบบ AI' },
    { time: '2025-05-05 15:00', action: 'พยาบาลบันทึกข้อมูล', by: patient.assignedNurse },
    { time: '2025-05-04 10:00', action: 'AI ส่ง LINE แจ้งเตือนนัดพบแพทย์', by: 'ระบบ AI' },
    { time: '2025-04-28 16:00', action: 'จำหน่ายจากโรงพยาบาล', by: 'นพ.วิชัย' },
  ];

  return (
    <div>
      <button onClick={() => navigate({ to: '/patients' })} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> กลับไปคิวผู้ป่วย
      </button>

      {/* Header */}
      <div className="mb-6 rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{patient.hn}</span>
                <span>อายุ {patient.age} ปี</span>
                <span>{patient.department}</span>
                <span>{patient.contactChannel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={patient.riskLevel} />
            <CaseStatusBadge status={patient.caseStatus} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 text-sm">
          <div><span className="text-muted-foreground">แผนดูแล:</span> <span className="font-medium">{patient.carePlan}</span></div>
          <div><span className="text-muted-foreground">ยินยอม:</span> <span className="font-medium">{patient.consentStatus}</span></div>
          <div><span className="text-muted-foreground">ผู้ดูแล:</span> <span className="font-medium">{patient.primaryCaregiver}</span></div>
          <div><span className="text-muted-foreground">คะแนนเสี่ยง:</span> <span className="font-medium">{patient.riskScore}/100</span></div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => toast.success(`กำลังโทร ${patient.name}`)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"><Phone className="h-3.5 w-3.5" /> โทรผู้ป่วย</button>
          <button onClick={() => toast.info('ส่งแจ้งเตือนญาติแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Bell className="h-3.5 w-3.5" /> แจ้งญาติ</button>
          <button onClick={() => toast.info('ส่งต่อแพทย์แล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><UserPlus className="h-3.5 w-3.5" /> ส่งแพทย์</button>
          <button onClick={() => toast.info('ส่งต่อเภสัชกรแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Pill className="h-3.5 w-3.5" /> ส่งเภสัชกร</button>
          <button onClick={() => toast.success('ตั้งเวลานัดติดตามแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><CalendarPlus className="h-3.5 w-3.5" /> นัดติดตาม</button>
          <button onClick={() => toast.success(`ปิดเคส ${patient.name}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-risk-red/30 px-3 py-2 text-xs font-medium text-risk-red hover:bg-risk-red-bg"><XCircle className="h-3.5 w-3.5" /> ปิดเคส</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border bg-card p-5">
            <h3 className="section-title">ข้อมูลทั่วไป</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">เหตุผลความเสี่ยง</dt><dd className="font-medium text-right max-w-[60%]">{patient.riskReason}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">ยา</dt><dd>{patient.medicationStatus}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">นัดหมาย</dt><dd>{patient.appointmentStatus}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">วัน Admit</dt><dd>{patient.admitDate}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">วัน Discharge</dt><dd>{patient.dischargeDate}</dd></div>
            </dl>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <h3 className="section-title">บันทึกพยาบาล</h3>
            <textarea
              value={nurseNote} onChange={e => setNurseNote(e.target.value)}
              placeholder="เขียนบันทึกที่นี่..."
              className="w-full rounded-lg border bg-background p-3 text-sm min-h-[120px]"
            />
            <button onClick={() => { toast.success('บันทึกแล้ว'); setNurseNote(''); }} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              บันทึก
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ai-summary' && followUp && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="section-title">สรุปจาก AI</h3>
          <div className="rounded-lg bg-teal-light p-4">
            <p className="text-sm">{followUp.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 text-sm">
            <div><span className="text-muted-foreground">อาการ:</span> <span className="font-medium">{followUp.symptoms.length > 0 ? followUp.symptoms.join(', ') : 'ไม่มี'}</span></div>
            <div><span className="text-muted-foreground">การทานยา:</span> <span className="font-medium">{followUp.medicationAdherence}</span></div>
            <div><span className="text-muted-foreground">สัญญาณชีพ:</span> <span className="font-medium">{followUp.vitalSigns}</span></div>
            <div><span className="text-muted-foreground">ความเข้าใจนัด:</span> <span className="font-medium">{followUp.appointmentUnderstanding}</span></div>
            <div><span className="text-muted-foreground">ความเสี่ยงล้ม:</span> <span className="font-medium">{followUp.fallRisk}</span></div>
            <div><span className="text-muted-foreground">ผู้ดูแล:</span> <span className="font-medium">{followUp.caregiverAvailability}</span></div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-1">เหตุผลการจำแนกระดับ: <RiskBadge level={followUp.riskLevel} /></p>
            <p className="text-sm text-muted-foreground">{followUp.riskExplanation}</p>
            <p className="mt-2 text-xs text-muted-foreground">ความมั่นใจ: {followUp.confidence}%</p>
          </div>
        </div>
      )}

      {activeTab === 'ai-summary' && !followUp && (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mb-3" />
          <p>ยังไม่มีผลสรุปจาก AI</p>
        </div>
      )}

      {activeTab === 'transcript' && followUp && followUp.transcript && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">บทสนทนา AI</h3>
          <div className="space-y-2 text-sm">
            {followUp.transcript.split('\n').map((line, i) => {
              const isAI = line.startsWith('AI:');
              return (
                <div key={i} className={`rounded-lg p-3 ${isAI ? 'bg-teal-light ml-0 mr-12' : 'bg-muted ml-12 mr-0'}`}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{isAI ? '🤖 AI' : '👤 ผู้ป่วย'}</p>
                  <p>{line.replace(/^(AI|ผู้ป่วย): /, '')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'transcript' && (!followUp || !followUp.transcript) && (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-3" />
          <p>ยังไม่มีบทสนทนา</p>
        </div>
      )}

      {activeTab === 'recording' && (
        <div className="flex flex-col items-center py-12 text-muted-foreground">
          <Mic className="h-12 w-12 mb-3" />
          <p>ฟังก์ชันบันทึกเสียงจะเปิดใช้งานในเวอร์ชันถัดไป</p>
        </div>
      )}

      {activeTab === 'medication' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">การใช้ยา</h3>
          <p className="text-sm"><span className="text-muted-foreground">สถานะ:</span> <span className="font-medium">{patient.medicationStatus}</span></p>
        </div>
      )}

      {activeTab === 'appointment' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">นัดหมาย</h3>
          <p className="text-sm"><span className="text-muted-foreground">สถานะ:</span> <span className="font-medium">{patient.appointmentStatus}</span></p>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">ญาติ / ผู้ดูแล</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">ผู้ดูแลหลัก</dt><dd>{patient.primaryCaregiver}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">เบอร์โทร</dt><dd>{patient.caregiverPhone}</dd></div>
          </dl>
        </div>
      )}

      {activeTab === 'action-log' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">บันทึกกิจกรรม</h3>
          <div className="space-y-3">
            {actionLog.map((log, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1.5" />
                  {i < actionLog.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-3">
                  <p className="text-xs text-muted-foreground">{log.time} — {log.by}</p>
                  <p>{log.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
