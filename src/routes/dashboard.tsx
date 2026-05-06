import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { patients, aiFollowUps } from '@/lib/mock-data';
import {
  Users, ShieldCheck, AlertTriangle, ShieldAlert, Clock, PhoneOff,
  PhoneCall, Timer, CheckCircle, Activity,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const greenCount = patients.filter(p => p.riskLevel === 'green').length;
  const yellowCount = patients.filter(p => p.riskLevel === 'yellow').length;
  const redCount = patients.filter(p => p.riskLevel === 'red').length;
  const pendingCount = patients.filter(p => p.caseStatus === 'pending').length;
  const callbackCount = patients.filter(p => p.caseStatus === 'callback').length;
  const noAnswerCount = aiFollowUps.filter(f => f.callStatus === 'no_answer').length;

  const redPatients = patients.filter(p => p.riskLevel === 'red');
  const yellowPatients = patients.filter(p => p.riskLevel === 'yellow');

  const timeline = [
    { time: '09:30', text: 'AI ติดตาม สมชาย วงศ์สุวรรณ — สถานะปกติ', type: 'green' as const },
    { time: '08:00', text: 'AI ติดตาม ประยุทธ์ ศรีสุข — เจ็บหน้าอก ส่งต่อพยาบาล', type: 'red' as const },
    { time: '14:15', text: 'AI ติดตาม วิภา แซ่ลิ้ม — ลืมทานยา ส่งคิวโทรกลับ', type: 'yellow' as const },
    { time: '15:30', text: 'AI โทร บุญมี ทองดี — ไม่รับสาย (ครั้งที่ 3)', type: 'yellow' as const },
    { time: '10:45', text: 'AI ติดตาม สุนีย์ จันทร์เพ็ญ — แผลบวมแดง มีไข้ ส่งแพทย์', type: 'red' as const },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Care Command Center</h1>
          <p className="text-sm text-muted-foreground">ศูนย์ควบคุมการดูแลผู้ป่วยอัจฉริยะ — วันที่ 6 พ.ค. 2568</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mb-6">
        <StatCard title="ผู้ป่วยทั้งหมด" value={patients.length} icon={Users} variant="teal" />
        <StatCard title="สีเขียว" value={greenCount} icon={ShieldCheck} variant="green" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="สีเหลือง" value={yellowCount} icon={AlertTriangle} variant="yellow" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="สีแดง" value={redCount} icon={ShieldAlert} variant="red" onClick={() => navigate({ to: '/patients' })} />
        <StatCard title="รอติดตาม" value={pendingCount} icon={Clock} />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard title="ไม่รับสาย" value={noAnswerCount} icon={PhoneOff} />
        <StatCard title="คิวโทรกลับ" value={callbackCount} icon={PhoneCall} />
        <StatCard title="เวลาเฉลี่ย" value="12 นาที" icon={Timer} trend="ลดลง 8% จากสัปดาห์ก่อน" />
        <StatCard title="AI โทรสำเร็จวันนี้" value="75%" icon={CheckCircle} trend="3/4 สาย" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Queue */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="section-title flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-risk-red" /> คิวความเสี่ยง
            </h2>
            <div className="space-y-3">
              {[...redPatients, ...yellowPatients].map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                  className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.hn} — {p.symptomSummary}</p>
                  </div>
                  <RiskBadge level={p.riskLevel} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="section-title flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> กิจกรรมติดตาม AI วันนี้
            </h2>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${item.type === 'green' ? 'bg-risk-green' : item.type === 'yellow' ? 'bg-risk-yellow' : 'bg-risk-red'}`} />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-risk-yellow" /> การแจ้งเตือน
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border-l-4 border-l-risk-red bg-risk-red-bg p-3">
                <p className="text-sm font-medium text-risk-red">🔴 ประยุทธ์ ศรีสุข — เจ็บแน่นหน้าอก</p>
                <p className="text-xs text-muted-foreground">08:00 — ต้องพบแพทย์ทันที</p>
              </div>
              <div className="rounded-lg border-l-4 border-l-risk-red bg-risk-red-bg p-3">
                <p className="text-sm font-medium text-risk-red">🔴 สุนีย์ จันทร์เพ็ญ — แผลบวมแดง มีไข้</p>
                <p className="text-xs text-muted-foreground">10:45 — ส่งต่อแพทย์แล้ว</p>
              </div>
              <div className="rounded-lg border-l-4 border-l-risk-yellow bg-risk-yellow-bg p-3">
                <p className="text-sm font-medium text-risk-yellow">🟡 วิภา แซ่ลิ้ม — ลืมทานยาเบาหวาน</p>
                <p className="text-xs text-muted-foreground">14:15 — รอพยาบาลโทรกลับ</p>
              </div>
              <div className="rounded-lg border-l-4 border-l-risk-yellow bg-risk-yellow-bg p-3">
                <p className="text-sm font-medium text-risk-yellow">🟡 บุญมี ทองดี — ไม่รับสาย 3 ครั้ง</p>
                <p className="text-xs text-muted-foreground">15:30 — ต้องติดต่อทางอื่น</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
