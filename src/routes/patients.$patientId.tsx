import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { patients, aiFollowUps } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  ArrowLeft, Phone, Bell, UserPlus, Pill, CalendarPlus, XCircle,
  User, FileText, MessageSquare, HeartPulse, Calendar, Users as UsersIcon,
  ClipboardList, Stethoscope, Activity, AlertTriangle, Send,
} from 'lucide-react';

export const Route = createFileRoute('/patients/$patientId')({
  component: PatientDetailPage,
});

function PatientDetailPage() {
  const { patientId } = Route.useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const patient = patients.find(p => p.id === patientId);
  const followUp = aiFollowUps.find(f => f.patientId === patientId);
  const [activeTab, setActiveTab] = useState('overview');
  const [nurseNote, setNurseNote] = useState('');
  const [doctorNote, setDoctorNote] = useState('');

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">ไม่พบข้อมูลผู้ป่วย</p>
        <button onClick={() => navigate({ to: '/patients' })} className="mt-4 text-primary hover:underline">กลับไปคิวผู้ป่วย</button>
      </div>
    );
  }

  const diseaseIcon = patient.carePlanType === 'hypertension' ? '🫀' : patient.carePlanType === 'diabetes' ? '🩸' : patient.carePlanType === 'heart_failure' ? '❤️‍🩹' : patient.carePlanType === 'post_op' ? '🩹' : '💊';

  const tabs = [
    { id: 'overview', label: 'ภาพรวม', icon: User },
    { id: 'ai-summary', label: 'สรุปจาก AI', icon: FileText },
    { id: 'transcript', label: 'บทสนทนา', icon: MessageSquare },
    { id: 'vitals', label: 'ข้อมูลชีวัด', icon: HeartPulse },
    { id: 'medication', label: 'การใช้ยา', icon: Pill },
    { id: 'appointment', label: 'นัดหมาย', icon: Calendar },
    { id: 'family', label: 'ญาติ/ผู้ดูแล', icon: UsersIcon },
    { id: 'action-log', label: 'บันทึกกิจกรรม', icon: ClipboardList },
  ];

  const actionLog = [
    { time: '2025-05-06 09:30', action: 'AI ติดตามโทรศัพท์ — สำเร็จ', by: 'ระบบ AI' },
    { time: '2025-05-05 15:00', action: 'พยาบาลบันทึกข้อมูล', by: patient.assignedNurse },
    { time: '2025-05-04 10:00', action: 'AI ส่ง LINE แจ้งเตือนนัดพบแพทย์', by: 'ระบบ AI' },
    { time: '2025-04-28 16:00', action: 'จำหน่ายจากโรงพยาบาล', by: patient.assignedDoctor },
  ];

  return (
    <div>
      <button onClick={() => navigate({ to: '/patients' })} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> กลับไปคิวผู้ป่วย
      </button>

      {/* Header */}
      <div className={`mb-6 rounded-xl border-l-4 border bg-card p-6 ${patient.riskLevel === 'red' ? 'border-l-risk-red' : patient.riskLevel === 'yellow' ? 'border-l-risk-yellow' : 'border-l-risk-green'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold ${patient.riskLevel === 'red' ? 'bg-risk-red/10 text-risk-red' : patient.riskLevel === 'yellow' ? 'bg-risk-yellow/10 text-risk-yellow' : 'bg-risk-green/10 text-risk-green'}`}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{patient.name}</h1>
                <span className="text-lg">{diseaseIcon}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="font-mono">{patient.hn}</span>
                <span>อายุ {patient.age} ปี ({patient.gender})</span>
                <span>{patient.department}</span>
                <span>{patient.carePlan}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RiskBadge level={patient.riskLevel} />
            <CaseStatusBadge status={patient.caseStatus} />
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 text-sm">
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">แพทย์</p>
            <p className="font-medium">{patient.assignedDoctor}</p>
          </div>
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">พยาบาล</p>
            <p className="font-medium">{patient.assignedNurse}</p>
          </div>
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">ติดต่อล่าสุด</p>
            <p className="font-medium">{patient.lastContact}</p>
          </div>
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">ยินยอม</p>
            <p className="font-medium">{patient.consentStatus}</p>
          </div>
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">คะแนนเสี่ยง</p>
            <p className="font-medium">{patient.riskScore}/100</p>
          </div>
          <div className="rounded-lg border p-2.5">
            <p className="text-xs text-muted-foreground">ช่องทาง</p>
            <p className="font-medium">{patient.contactChannel}</p>
          </div>
        </div>

        {/* Disease-specific Clinical Snapshot */}
        <div className="mt-4 rounded-lg bg-muted/50 p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
            <HeartPulse className="h-3.5 w-3.5" /> Clinical Snapshot
          </h3>
          {patient.carePlanType === 'hypertension' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-xs text-muted-foreground">BP</span><p className="font-bold">{patient.latestBP}</p></div>
              <div><span className="text-xs text-muted-foreground">ทานยา</span><p className="font-medium">{patient.medicationAdherence}</p></div>
              <div><span className="text-xs text-muted-foreground">ปวดหัว/เวียนศีรษะ</span><p className="font-medium">{patient.symptomSummary.includes('เวียน') || patient.symptomSummary.includes('ปวดหัว') ? '🟡 มี' : '🟢 ไม่มี'}</p></div>
              <div><span className="text-xs text-muted-foreground">เจ็บหน้าอก/เหนื่อย</span><p className="font-medium">{patient.redFlagReason.includes('เจ็บหน้าอก') ? '🔴 มี' : '🟢 ไม่มี'}</p></div>
            </div>
          )}
          {patient.carePlanType === 'diabetes' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-xs text-muted-foreground">น้ำตาล</span><p className="font-bold">{patient.latestBloodSugar}</p></div>
              <div><span className="text-xs text-muted-foreground">ทานยา/อินซูลิน</span><p className="font-medium">{patient.medicationAdherence}</p></div>
              <div><span className="text-xs text-muted-foreground">Hypoglycemia</span><p className="font-medium">{patient.symptomSummary.includes('เหงื่อ') || patient.symptomSummary.includes('มือสั่น') ? '🔴 มี' : '🟢 ไม่มี'}</p></div>
              <div><span className="text-xs text-muted-foreground">แผลเท้า</span><p className="font-medium">{patient.symptomSummary.includes('แผล') ? '🟡 มี' : '🟢 ไม่มี'}</p></div>
            </div>
          )}
          {patient.carePlanType === 'heart_failure' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-xs text-muted-foreground">น้ำหนัก</span><p className="font-bold">{patient.latestWeightChange}</p></div>
              <div><span className="text-xs text-muted-foreground">เหนื่อย/หอบ</span><p className="font-medium">{patient.symptomSummary.includes('เหนื่อย') ? '🟡 มี' : '🟢 ไม่มี'}</p></div>
              <div><span className="text-xs text-muted-foreground">นอนราบ (Orthopnea)</span><p className="font-medium">{patient.symptomSummary.includes('นอนราบ') ? '🟡 ไม่ได้' : '🟢 ปกติ'}</p></div>
              <div><span className="text-xs text-muted-foreground">ขาบวม</span><p className="font-medium">{patient.symptomSummary.includes('บวม') ? '🟡 มี' : '🟢 ไม่มี'}</p></div>
            </div>
          )}
          {patient.carePlanType === 'post_op' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-xs text-muted-foreground">แผล</span><p className="font-bold">{patient.symptomSummary.includes('บวม') ? '🔴 บวมแดง' : '🟢 ปกติ'}</p></div>
              <div><span className="text-xs text-muted-foreground">ไข้</span><p className="font-medium">{patient.symptomSummary.includes('ไข้') ? '🔴 มีไข้' : '🟢 ไม่มี'}</p></div>
              <div><span className="text-xs text-muted-foreground">ยาปฏิชีวนะ</span><p className="font-medium">{patient.medicationAdherence}</p></div>
              <div><span className="text-xs text-muted-foreground">BP</span><p className="font-medium">{patient.latestBP}</p></div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => toast.success(`กำลังโทร ${patient.name}`)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"><Phone className="h-3.5 w-3.5" /> โทรผู้ป่วย</button>
          <button onClick={() => toast.info('ส่งต่อแพทย์แล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Stethoscope className="h-3.5 w-3.5" /> ส่งแพทย์</button>
          <button onClick={() => toast.info('ส่งต่อเภสัชกรแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Pill className="h-3.5 w-3.5" /> ส่งเภสัชกร</button>
          <button onClick={() => toast.info('ส่งแจ้งเตือนญาติแล้ว')} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"><Bell className="h-3.5 w-3.5" /> แจ้งญาติ</button>
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
              <div className="flex justify-between"><dt className="text-muted-foreground">การเข้าถึงยา</dt><dd>{patient.medicationAdherence}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">นัดหมาย</dt><dd>{patient.appointmentStatus}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">ผู้ดูแล</dt><dd>{patient.primaryCaregiver}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">วัน Admit</dt><dd>{patient.admitDate}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">วัน Discharge</dt><dd>{patient.dischargeDate}</dd></div>
            </dl>
          </div>
          {/* Role-specific panels */}
          {(role === 'nurse' || role === 'admin') && (
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
          )}
          {(role === 'doctor') && (
            <div className="space-y-4">
              {followUp && (
                <div className="rounded-xl border bg-card p-5">
                  <h3 className="section-title flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> AI SBAR Summary</h3>
                  <div className="rounded-lg bg-teal-light p-3 text-sm mb-3">{followUp.summary}</div>
                  {patient.redFlagReason && <p className="text-sm text-risk-red font-medium mb-2">🔴 Red Flag: {patient.redFlagReason}</p>}
                  <p className="text-xs text-muted-foreground mb-3">ความมั่นใจ AI: {followUp.confidence}%</p>
                </div>
              )}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="section-title">Doctor Note</h3>
                <textarea
                  value={doctorNote} onChange={e => setDoctorNote(e.target.value)}
                  placeholder="เขียนคำแนะนำทางคลินิก..."
                  className="w-full rounded-lg border bg-background p-3 text-sm min-h-[100px]"
                />
                <div className="mt-2 flex gap-2">
                  <button onClick={() => { toast.success('บันทึก Doctor Note แล้ว'); setDoctorNote(''); }} className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">บันทึก</button>
                  <button onClick={() => toast.success('ส่งคำแนะนำกลับพยาบาลแล้ว')} className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-muted flex items-center gap-1"><Send className="h-3.5 w-3.5" /> ส่งคำแนะนำกลับพยาบาล</button>
                </div>
              </div>
            </div>
          )}
          {role === 'pharmacist' && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="section-title flex items-center gap-2"><Pill className="h-4 w-4" /> Pharmacist Note</h3>
              <div className="space-y-2 mb-4">
                {patient.medications.map((med, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">{med.name} {med.dose}</p>
                      <p className="text-xs text-muted-foreground">{med.frequency}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${med.adherence === 'ครบ' ? 'bg-risk-green-bg text-risk-green' : 'bg-risk-yellow-bg text-risk-yellow'}`}>{med.adherence}</span>
                  </div>
                ))}
              </div>
              <textarea
                placeholder="เขียนคำแนะนำเรื่องยา..."
                className="w-full rounded-lg border bg-background p-3 text-sm min-h-[80px]"
              />
              <button onClick={() => toast.success('ส่งคำแนะนำเรื่องยาให้ทีมดูแลแล้ว')} className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground flex items-center gap-1"><Send className="h-3.5 w-3.5" /> ส่งคำแนะนำเรื่องยาให้ทีมดูแล</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai-summary' && followUp && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="section-title">สรุปจาก AI</h3>
          <div className="rounded-lg bg-teal-light p-4">
            <p className="text-sm">{followUp.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">อาการ</span><p className="font-medium mt-0.5">{followUp.symptoms.length > 0 ? followUp.symptoms.join(', ') : 'ไม่มี'}</p></div>
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">การทานยา</span><p className="font-medium mt-0.5">{followUp.medicationAdherence}</p></div>
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">สัญญาณชีพ</span><p className="font-medium mt-0.5">{followUp.vitalSigns}</p></div>
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ช่องทาง</span><p className="font-medium mt-0.5">{followUp.channel}</p></div>
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ความเสี่ยงล้ม</span><p className="font-medium mt-0.5">{followUp.fallRisk}</p></div>
            <div className="rounded-lg border p-3"><span className="text-muted-foreground text-xs">ผู้ดูแล</span><p className="font-medium mt-0.5">{followUp.caregiverAvailability}</p></div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium mb-1">เหตุผลการจำแนกระดับ: <RiskBadge level={followUp.riskLevel} /></p>
            <p className="text-sm text-muted-foreground">{followUp.riskExplanation}</p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-xs text-muted-foreground">ความมั่นใจ: {followUp.confidence}%</span>
              <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${followUp.confidence}%` }} />
              </div>
            </div>
          </div>
          <div className="rounded-lg border-l-4 border-l-risk-yellow bg-risk-yellow-bg/30 p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> AI ไม่ได้วินิจฉัยหรือสั่งการรักษา — สรุปข้อมูลเพื่อให้เจ้าหน้าที่ตรวจสอบเท่านั้น</p>
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
          <h3 className="section-title">บทสนทนา AI — {followUp.channel}</h3>
          <div className="space-y-2 text-sm max-h-[500px] overflow-y-auto">
            {followUp.transcript.split('\n').map((line, i) => {
              const isAI = line.startsWith('AI:');
              const content = line.replace(/^(AI|ผู้ป่วย): /, '');
              const hasRedFlag = patient.redFlagReason && patient.redFlagReason.split(' ').some(w => w.length > 2 && content.includes(w));
              return (
                <div key={i} className={`rounded-lg p-3 ${isAI ? 'bg-teal-light ml-0 mr-12' : 'bg-muted ml-12 mr-0'}`}>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{isAI ? '🤖 AI' : '👤 ผู้ป่วย'}</p>
                  <p className={hasRedFlag ? 'text-risk-red font-medium' : ''}>{content}</p>
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

      {activeTab === 'vitals' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">ข้อมูลชีวัด</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">ความดันโลหิต</p>
              <p className="text-2xl font-bold">{patient.latestBP}</p>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </div>
            {patient.latestBloodSugar !== '-' && (
              <div className="rounded-lg border p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">น้ำตาลในเลือด</p>
                <p className="text-2xl font-bold">{patient.latestBloodSugar}</p>
              </div>
            )}
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">น้ำหนัก</p>
              <p className="text-2xl font-bold">{patient.latestWeightChange}</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Adherence</p>
              <p className="text-2xl font-bold">{patient.medicationAdherence}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'medication' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">รายการยา</h3>
          <div className="space-y-2">
            {patient.medications.map((med, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-semibold">{med.name}</p>
                  <p className="text-xs text-muted-foreground">{med.dose} — {med.frequency}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${med.adherence === 'ครบ' ? 'bg-risk-green-bg text-risk-green' : 'bg-risk-yellow-bg text-risk-yellow'}`}>
                  {med.adherence}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border p-3 text-sm">
            <span className="text-muted-foreground">สถานะเภสัชกร:</span>{' '}
            <span className={`font-medium ${patient.pharmacistStatus === 'รอตรวจ' ? 'text-risk-yellow' : 'text-risk-green'}`}>{patient.pharmacistStatus}</span>
          </div>
        </div>
      )}

      {activeTab === 'appointment' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">นัดหมาย</h3>
          <div className="rounded-lg border p-4 text-sm">
            <p><span className="text-muted-foreground">สถานะ:</span> <span className="font-medium">{patient.appointmentStatus}</span></p>
            <p className="mt-1"><span className="text-muted-foreground">แพทย์:</span> <span className="font-medium">{patient.assignedDoctor}</span></p>
            <p className="mt-1"><span className="text-muted-foreground">แผนก:</span> <span className="font-medium">{patient.department}</span></p>
          </div>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">ญาติ / ผู้ดูแล</h3>
          <div className="rounded-lg border p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">ผู้ดูแลหลัก</span><span className="font-medium">{patient.primaryCaregiver}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">เบอร์โทร</span><span className="font-medium">{patient.caregiverPhone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">ระดับยินยอม</span><span className="font-medium">{patient.familyConsentLevel}</span></div>
          </div>
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
