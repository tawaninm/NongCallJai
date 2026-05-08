import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth-context';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';
import { patients, aiFollowUps, activityTimeline, carePlanTemplates, auditLog } from '@/lib/mock-data';
import type { RiskLevel } from '@/lib/mock-data';
import {
  Users, ShieldCheck, AlertTriangle, ShieldAlert, Clock, PhoneOff,
  PhoneCall, Timer, CheckCircle, Activity, Phone, Eye, UserPlus,
  Pill, BarChart3, Bot, Settings, Stethoscope, ArrowRight,
  Heart, FileText, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { role, userName } = useAuth();

  switch (role) {
    case 'nurse': return <NurseDashboard userName={userName} />;
    case 'doctor': return <DoctorDashboard userName={userName} />;
    case 'pharmacist': return <PharmacistDashboard userName={userName} />;
    case 'admin': return <AdminDashboard userName={userName} />;
    case 'callcenter': return <CallCenterDashboard userName={userName} />;
    default: return <NurseDashboard userName={userName} />;
  }
}

/* ============================================================
   NURSE DASHBOARD
   ============================================================ */
const aiAgents = [
  { name: 'Voice Follow-up Agent', status: 'online' as const, calls: 6, success: 5 },
  { name: 'Risk Scoring Agent', status: 'online' as const, calls: 6, success: 6 },
  { name: 'Appointment Reminder Agent', status: 'online' as const, calls: 3, success: 3 },
  { name: 'Chatbot Triage Agent', status: 'soon' as const, calls: 0, success: 0 },
  { name: 'Medication Adherence Agent', status: 'soon' as const, calls: 0, success: 0 },
  { name: 'Family Notification Agent', status: 'soon' as const, calls: 0, success: 0 },
];

function NurseDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const greenCount = patients.filter(p => p.riskLevel === 'green').length;
  const yellowCount = patients.filter(p => p.riskLevel === 'yellow').length;
  const redCount = patients.filter(p => p.riskLevel === 'red').length;
  const pendingCount = patients.filter(p => p.caseStatus === 'pending').length;
  const callbackCount = patients.filter(p => p.caseStatus === 'callback').length;
  const noAnswerCount = aiFollowUps.filter(f => f.callStatus === 'no_answer').length;
  const referredDoctor = patients.filter(p => p.caseStatus === 'referred_doctor' || p.caseStatus === 'escalated').length;
  const referredPharm = patients.filter(p => p.pharmacistStatus === 'รอตรวจ').length;

  const redPatients = patients.filter(p => p.riskLevel === 'red');
  const yellowPatients = patients.filter(p => p.riskLevel === 'yellow');
  const priorityQueue = [...redPatients, ...yellowPatients].slice(0, 5);

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">สวัสดี {userName} 👋</h1>
        <p className="text-sm text-muted-foreground">AI Care Command Center — วันที่ 6 พ.ค. 2568</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <StatCard title="ผู้ป่วยทั้งหมด" value={patients.length} icon={Users} variant="teal" trend="ติดตามอยู่" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="เคสเขียว / Stable" value={greenCount} icon={ShieldCheck} variant="green" trend="ปกติ" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="เคสเหลือง / Follow-up" value={yellowCount} icon={AlertTriangle} variant="yellow" trend="ต้องติดตาม" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="เคสเร่งด่วน" value={redCount} icon={ShieldAlert} variant="red" trend="ต้องตรวจสอบทันที" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="รอโทรกลับ" value={callbackCount} icon={PhoneCall} trend="รายการ" onClick={() => navigate({ to: '/cases' })} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-8">
        <StatCard title="ติดต่อไม่ได้" value={noAnswerCount} icon={PhoneOff} />
        <StatCard title="AI โทรสำเร็จวันนี้" value="83%" icon={CheckCircle} trend="5/6 สาย" />
        <StatCard title="เวลาตอบสนองเฉลี่ย" value="12 นาที" icon={Timer} trend="↓ 8% จากสัปดาห์ก่อน" />
        <StatCard title="รอแพทย์ตรวจ" value={referredDoctor} icon={Stethoscope} />
        <StatCard title="รอเภสัชกรตรวจ" value={referredPharm} icon={Pill} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Panel 1: Priority Risk Queue */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-risk-red" /> คิวความเสี่ยงเร่งด่วน
          </h2>
          <div className="space-y-2">
            {priorityQueue.map(p => (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-md hover:border-primary/40 group"
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${p.riskLevel === 'red' ? 'bg-risk-red/10 text-risk-red' : 'bg-risk-yellow/10 text-risk-yellow'}`}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.hn}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.carePlan} — {p.symptomSummary}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <RiskBadge level={p.riskLevel} showLabel={false} />
                    <CaseStatusBadge status={p.caseStatus} />
                    <span className="text-xs text-muted-foreground">{p.assignedNurse}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary">ดูเคส</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 2: AI Activity Timeline */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" /> กิจกรรม AI วันนี้
          </h2>
          <div className="space-y-2">
            {activityTimeline.map((item, i) => (
              <button
                key={item.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: item.patientId } })}
                className="flex w-full gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className="flex flex-col items-center pt-0.5">
                  <div className={`h-3 w-3 rounded-full shrink-0 ${item.riskLevel === 'green' ? 'bg-risk-green' : item.riskLevel === 'yellow' ? 'bg-risk-yellow' : 'bg-risk-red'}`} />
                  {i < activityTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-muted-foreground">{item.time}</span>
                    <span className="text-xs font-medium">{item.patientName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.riskLevel === 'red' ? 'bg-risk-red-bg text-risk-red' : item.riskLevel === 'yellow' ? 'bg-risk-yellow-bg text-risk-yellow' : 'bg-risk-green-bg text-risk-green'}`}>{item.statusBadge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.action}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 3: Alert Center */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-risk-yellow" /> ศูนย์แจ้งเตือน
          </h2>
          <div className="space-y-2">
            {patients.filter(p => p.riskLevel === 'red' || p.riskLevel === 'yellow').map(p => (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                className={`w-full rounded-lg border-l-4 p-3 text-left transition-all hover:shadow-md ${p.riskLevel === 'red' ? 'border-l-risk-red bg-risk-red-bg/50' : 'border-l-risk-yellow bg-risk-yellow-bg/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{p.riskLevel === 'red' ? '🔴' : '🟡'} {p.name}</span>
                  <RiskBadge level={p.riskLevel} showLabel={false} />
                </div>
                <p className="text-xs text-muted-foreground">{p.hn} — {p.carePlan}</p>
                <p className="text-xs mt-1">{p.riskLevel === 'red' ? p.redFlagReason : p.yellowFlagReason || p.symptomSummary}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{p.lastContact.split(' ')[1]}</span>
                  <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">เปิดเคส →</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 4: Care Plan Summary */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> สรุปแผนการดูแล
          </h2>
          <div className="space-y-3">
            {carePlanTemplates.filter(cp => ['hypertension', 'diabetes', 'heart_failure'].includes(cp.type)).map(cp => {
              const cpPatients = patients.filter(p => p.carePlanType === cp.type);
              const g = cpPatients.filter(p => p.riskLevel === 'green').length;
              const y = cpPatients.filter(p => p.riskLevel === 'yellow').length;
              const r = cpPatients.filter(p => p.riskLevel === 'red').length;
              const medIssue = cpPatients.filter(p => p.medicationStatus !== 'ทานยาครบ').length;
              return (
                <div key={cp.id} className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cp.icon}</span>
                      <div>
                        <h3 className="text-sm font-semibold">{cp.name}</h3>
                        <p className="text-xs text-muted-foreground">{cp.nameEn}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold">{cpPatients.length}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-risk-green" /> {g}</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-risk-yellow" /> {y}</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-risk-red" /> {r}</span>
                    {medIssue > 0 && <span className="text-risk-yellow">💊 ปัญหายา {medIssue}</span>}
                  </div>
                  <button
                    onClick={() => navigate({ to: '/patients' })}
                    className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    ดูผู้ป่วยในแผนนี้ <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 5: AI Agent Status */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" /> สถานะ AI Agent
          </h2>
          <div className="space-y-2">
            {aiAgents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${agent.status === 'online' ? 'bg-risk-green' : 'bg-muted-foreground'}`} />
                  <span className="text-sm truncate">{agent.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {agent.status === 'online' ? (
                    <>
                      <span className="text-xs text-muted-foreground">{agent.success}/{agent.calls} สาย</span>
                      <span className="rounded-full bg-risk-green-bg px-2 py-0.5 text-xs font-semibold text-risk-green">ออนไลน์</span>
                    </>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">เร็วๆ นี้</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate({ to: '/ai-agents' })}
            className="mt-3 w-full text-center text-xs text-primary hover:underline flex items-center justify-center gap-1"
          >
            จัดการ AI Agents <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   DOCTOR DASHBOARD
   ============================================================ */
function DoctorDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const redCases = patients.filter(p => p.riskLevel === 'red');
  const referredCases = patients.filter(p => p.caseStatus === 'referred_doctor' || p.caseStatus === 'escalated');
  const yellowCases = patients.filter(p => p.riskLevel === 'yellow');
  const reviewNeeded = [...new Set([...redCases, ...referredCases])];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">สวัสดี {userName} 👨‍⚕️</h1>
        <p className="text-sm text-muted-foreground">Doctor Dashboard — วันที่ 6 พ.ค. 2568</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        <StatCard title="เคสรอแพทย์ตรวจ" value={referredCases.length} icon={Stethoscope} variant="red" />
        <StatCard title="เคส Red วันนี้" value={redCases.length} icon={ShieldAlert} variant="red" />
        <StatCard title="เคส Yellow" value={yellowCases.length} icon={AlertTriangle} variant="yellow" />
        <StatCard title="AI สรุปใหม่" value={aiFollowUps.filter(f => f.humanReviewRequired).length} icon={FileText} variant="teal" />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="section-title flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-risk-red" /> เคสที่ต้องตรวจสอบ
        </h2>
        <div className="space-y-3">
          {reviewNeeded.map(p => {
            const followUp = aiFollowUps.find(f => f.patientId === p.id);
            return (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                className={`w-full rounded-lg border-l-4 p-4 text-left transition-all hover:shadow-md ${p.riskLevel === 'red' ? 'border-l-risk-red' : 'border-l-risk-yellow'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.hn} — อายุ {p.age}</span>
                    <RiskBadge level={p.riskLevel} />
                  </div>
                  <CaseStatusBadge status={p.caseStatus} />
                </div>
                <p className="text-xs mb-1"><span className="font-medium">โรค:</span> {p.carePlan}</p>
                {followUp && (
                  <div className="rounded bg-teal-light p-2 text-xs mt-1">
                    <span className="font-medium">AI Summary:</span> {followUp.summary}
                  </div>
                )}
                {p.redFlagReason && (
                  <p className="text-xs text-risk-red mt-1 font-medium">🔴 {p.redFlagReason}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>BP: {p.latestBP}</span>
                  {p.latestBloodSugar !== '-' && <span>FBS: {p.latestBloodSugar}</span>}
                  <span>ยา: {p.medicationStatus}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">เปิด Clinical Review →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PHARMACIST DASHBOARD
   ============================================================ */
function PharmacistDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const medIssues = patients.filter(p => p.medicationStatus !== 'ทานยาครบ');
  const forgotMed = patients.filter(p => p.medicationStatus === 'ลืมทานยา');
  const stoppedMed = patients.filter(p => p.medicationStatus === 'หยุดยาเอง');
  const waitingPharm = patients.filter(p => p.pharmacistStatus === 'รอตรวจ');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">สวัสดี {userName} 💊</h1>
        <p className="text-sm text-muted-foreground">Medication Dashboard — วันที่ 6 พ.ค. 2568</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        <StatCard title="ปัญหาการใช้ยา" value={medIssues.length} icon={Pill} variant="yellow" />
        <StatCard title="ลืมทานยา" value={forgotMed.length} icon={AlertTriangle} variant="yellow" />
        <StatCard title="หยุดยาเอง" value={stoppedMed.length} icon={ShieldAlert} variant="red" />
        <StatCard title="รอเภสัชกรตรวจ" value={waitingPharm.length} icon={Stethoscope} variant="teal" />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="section-title flex items-center gap-2">
          <Pill className="h-5 w-5 text-risk-yellow" /> รายการรอตรวจสอบ
        </h2>
        <div className="space-y-3">
          {[...medIssues].map(p => {
            const followUp = aiFollowUps.find(f => f.patientId === p.id);
            return (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                className="w-full rounded-lg border p-4 text-left transition-all hover:shadow-md hover:border-primary/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.hn}</span>
                    <RiskBadge level={p.riskLevel} showLabel={false} />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.pharmacistStatus === 'รอตรวจ' ? 'bg-risk-yellow-bg text-risk-yellow' : 'bg-muted text-muted-foreground'}`}>{p.pharmacistStatus}</span>
                </div>
                <p className="text-xs"><span className="font-medium">โรค:</span> {p.carePlan} | <span className="font-medium">ปัญหา:</span> <span className="text-risk-yellow">{p.medicationStatus}</span></p>
                {followUp && <p className="text-xs text-muted-foreground mt-1">AI: {followUp.summary.substring(0, 80)}...</p>}
                <div className="mt-2 flex justify-end">
                  <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">เปิด Medication Review →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function AdminDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">สวัสดี {userName} ⚙️</h1>
        <p className="text-sm text-muted-foreground">System Overview — วันที่ 6 พ.ค. 2568</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        <StatCard title="ผู้ใช้ระบบ" value={5} icon={Users} variant="teal" />
        <StatCard title="ผู้ป่วยทั้งหมด" value={patients.length} icon={Heart} />
        <StatCard title="AI โทรสำเร็จ" value="83%" icon={CheckCircle} variant="green" />
        <StatCard title="แผนดูแล" value={carePlanTemplates.length} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Agent Status */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> สถานะ AI Agent</h2>
          <div className="space-y-2">
            {['Voice Follow-up Agent', 'Risk Scoring Agent', 'Appointment Reminder Agent'].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{name}</span>
                <span className="rounded-full bg-risk-green-bg px-2 py-0.5 text-xs font-semibold text-risk-green">เชื่อมต่อแล้ว</span>
              </div>
            ))}
            {['Chatbot Triage', 'Medication Adherence', 'Family Notification'].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm">{name} Agent</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">เร็วๆ นี้</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Audit Log ล่าสุด</h2>
          <div className="space-y-2">
            {auditLog.slice(0, 6).map(entry => (
              <div key={entry.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${entry.isAI ? 'bg-primary' : 'bg-risk-green'}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{entry.timestamp} — {entry.user}</p>
                  <p className="text-xs">{entry.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CALL CENTER DASHBOARD
   ============================================================ */
function CallCenterDashboard({ userName }: { userName: string }) {
  const navigate = useNavigate();
  const callbackQueue = patients.filter(p => p.caseStatus === 'callback');
  const noAnswerFollowUps = aiFollowUps.filter(f => f.callStatus === 'no_answer');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">สวัสดี {userName} 📞</h1>
        <p className="text-sm text-muted-foreground">Call Center Dashboard — วันที่ 6 พ.ค. 2568</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        <StatCard title="คิวโทรกลับ" value={callbackQueue.length} icon={PhoneCall} variant="yellow" />
        <StatCard title="ไม่รับสาย" value={noAnswerFollowUps.length} icon={PhoneOff} variant="red" />
        <StatCard title="AI โทรสำเร็จ" value="83%" icon={CheckCircle} variant="green" />
        <StatCard title="รอดำเนินการ" value={patients.filter(p => p.caseStatus === 'pending').length} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2"><PhoneCall className="h-5 w-5 text-risk-yellow" /> คิวโทรกลับ</h2>
          <div className="space-y-2">
            {callbackQueue.map(p => (
              <button
                key={p.id}
                onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:shadow-md hover:border-primary/40 transition-all"
              >
                <div>
                  <p className="text-sm font-medium">{p.name} <span className="text-xs text-muted-foreground">{p.hn}</span></p>
                  <p className="text-xs text-muted-foreground">{p.symptomSummary}</p>
                </div>
                <RiskBadge level={p.riskLevel} />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h2 className="section-title flex items-center gap-2"><PhoneOff className="h-5 w-5 text-risk-red" /> ติดต่อไม่ได้</h2>
          <div className="space-y-2">
            {noAnswerFollowUps.map(f => (
              <button
                key={f.id}
                onClick={() => navigate({ to: '/ai-followup' })}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:shadow-md hover:border-primary/40 transition-all"
              >
                <div>
                  <p className="text-sm font-medium">{f.patientName} <span className="text-xs text-muted-foreground">{f.hn}</span></p>
                  <p className="text-xs text-muted-foreground">{f.summary}</p>
                </div>
                <RiskBadge level={f.riskLevel} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
