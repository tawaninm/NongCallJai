import { createFileRoute } from '@tanstack/react-router';
import { Bot, Mic, MessageSquare, ShieldAlert, Pill, CalendarCheck, Heart, FileText, BarChart3 } from 'lucide-react';

export const Route = createFileRoute('/ai-agents')({
  component: AIAgentsPage,
});

const agents = [
  { icon: Mic, name: 'Voice Follow-up Agent', purpose: 'โทรติดตามผู้ป่วยอัตโนมัติด้วยเสียง', status: 'connected', input: 'ข้อมูลผู้ป่วย, แผนดูแล', output: 'บทสนทนา, สรุปอาการ, ระดับความเสี่ยง', approval: true },
  { icon: MessageSquare, name: 'Chatbot Triage Agent', purpose: 'คัดกรองอาการเบื้องต้นผ่าน LINE/Chat', status: 'coming_soon', input: 'ข้อความผู้ป่วย', output: 'ระดับความเร่งด่วน, คำแนะนำเบื้องต้น', approval: true },
  { icon: ShieldAlert, name: 'Risk Scoring Agent', purpose: 'ประเมินระดับความเสี่ยงจากข้อมูลที่รวบรวม', status: 'connected', input: 'อาการ, ยา, สัญญาณชีพ', output: 'คะแนนเสี่ยง, ระดับสี, เหตุผล', approval: false },
  { icon: Pill, name: 'Medication Adherence Agent', purpose: 'ติดตามการทานยาและแจ้งเตือน', status: 'coming_soon', input: 'ตารางยา, การตอบของผู้ป่วย', output: 'สถานะการทานยา, แจ้งเตือน', approval: false },
  { icon: CalendarCheck, name: 'Appointment Reminder Agent', purpose: 'แจ้งเตือนนัดพบแพทย์อัตโนมัติ', status: 'connected', input: 'ตารางนัดหมาย', output: 'ข้อความแจ้งเตือน, ยืนยันนัด', approval: false },
  { icon: Heart, name: 'Family Notification Agent', purpose: 'แจ้งเตือนญาติผู้ป่วยตามเงื่อนไข', status: 'coming_soon', input: 'เหตุการณ์ความเสี่ยง, ความยินยอม', output: 'ข้อความ LINE, สรุปสถานะ', approval: true },
  { icon: FileText, name: 'Nurse Summary Agent', purpose: 'สรุปข้อมูลให้พยาบาลก่อนโทรกลับ', status: 'needs_review', input: 'ประวัติติดตาม, AI transcript', output: 'สรุป 1 หน้า, จุดสำคัญ', approval: false },
  { icon: BarChart3, name: 'Report Generation Agent', purpose: 'สร้างรายงานสรุปอัตโนมัติ', status: 'coming_soon', input: 'ข้อมูลรวม, ช่วงเวลา', output: 'รายงาน PDF, Dashboard', approval: false },
];

const statusStyles: Record<string, { label: string; className: string }> = {
  connected: { label: 'เชื่อมต่อแล้ว', className: 'bg-risk-green-bg text-risk-green' },
  coming_soon: { label: 'เร็วๆ นี้', className: 'bg-muted text-muted-foreground' },
  needs_review: { label: 'รอตรวจสอบ', className: 'bg-risk-yellow-bg text-risk-yellow' },
};

function AIAgentsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Agent Center</h1>
        <p className="text-sm text-muted-foreground">ศูนย์จัดการ AI Agent สำหรับการติดตามดูแลผู้ป่วย</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agents.map((agent, i) => {
          const status = statusStyles[agent.status];
          return (
            <div key={i} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-light text-teal">
                    <agent.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.purpose}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>{status.label}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Input:</span> <span className="text-xs">{agent.input}</span></div>
                <div><span className="text-muted-foreground">Output:</span> <span className="text-xs">{agent.output}</span></div>
                <div><span className="text-muted-foreground">ต้องอนุมัติ:</span> <span className="text-xs">{agent.approval ? '✅ ใช่' : '❌ ไม่'}</span></div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted">API Connection</button>
                <button className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted">ดู Log</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
