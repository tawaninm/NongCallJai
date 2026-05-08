import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import {
  Bot, Mic, MessageSquare, ShieldAlert, Pill, CalendarCheck, Heart,
  FileText, BarChart3, Play, Pause, Settings, Eye, Clock, CheckCircle2,
  XCircle, AlertTriangle, Activity, Zap, ToggleLeft, ToggleRight
} from 'lucide-react';

export const Route = createFileRoute('/ai-agents')({
  component: AIAgentsPage,
});

type AgentStatus = 'active' | 'paused' | 'coming_soon' | 'error';

interface Agent {
  id: string;
  icon: typeof Mic;
  name: string;
  purpose: string;
  status: AgentStatus;
  input: string;
  output: string;
  approval: boolean;
  todayCalls: number;
  successRate: number;
  avgDuration: string;
  lastRun: string;
  logs: { time: string; event: string; status: 'success' | 'warning' | 'error' }[];
}

const agentsData: Agent[] = [
  {
    id: 'voice', icon: Mic, name: 'Voice Follow-up Agent',
    purpose: 'โทรติดตามผู้ป่วยอัตโนมัติด้วยเสียง AI',
    status: 'active', input: 'ข้อมูลผู้ป่วย, แผนดูแล', output: 'บทสนทนา, สรุปอาการ, ระดับความเสี่ยง',
    approval: true, todayCalls: 24, successRate: 78, avgDuration: '4:32', lastRun: '5 นาทีที่แล้ว',
    logs: [
      { time: '14:32', event: 'โทรหา นายสมชาย — สำเร็จ, Risk: Yellow', status: 'success' },
      { time: '14:15', event: 'โทรหา นางมาลี — ไม่รับสาย (ครั้งที่ 2)', status: 'warning' },
      { time: '13:58', event: 'โทรหา นายวิชัย — สำเร็จ, Risk: Red → ส่งแพทย์', status: 'error' },
      { time: '13:40', event: 'โทรหา นางสาวพิมพ์ — สำเร็จ, Risk: Green', status: 'success' },
    ],
  },
  {
    id: 'risk', icon: ShieldAlert, name: 'Risk Scoring Agent',
    purpose: 'ประเมินระดับความเสี่ยงจากข้อมูลอาการ, ยา, สัญญาณชีพ',
    status: 'active', input: 'อาการ, ยา, สัญญาณชีพ', output: 'คะแนนเสี่ยง, ระดับสี, เหตุผล',
    approval: false, todayCalls: 45, successRate: 100, avgDuration: '0:02', lastRun: '1 นาทีที่แล้ว',
    logs: [
      { time: '14:33', event: 'ประเมิน HN-1002 → Risk Red (BP 180/110)', status: 'error' },
      { time: '14:33', event: 'ประเมิน HN-1001 → Risk Yellow (ลืมทานยา)', status: 'warning' },
      { time: '14:32', event: 'ประเมิน HN-1004 → Risk Green', status: 'success' },
    ],
  },
  {
    id: 'appointment', icon: CalendarCheck, name: 'Appointment Reminder Agent',
    purpose: 'แจ้งเตือนนัดพบแพทย์อัตโนมัติผ่าน LINE/SMS',
    status: 'active', input: 'ตารางนัดหมาย', output: 'ข้อความแจ้งเตือน, ยืนยันนัด',
    approval: false, todayCalls: 18, successRate: 92, avgDuration: '0:01', lastRun: '30 นาทีที่แล้ว',
    logs: [
      { time: '14:00', event: 'ส่งเตือนนัด 3 วันล่วงหน้า — 15 ราย', status: 'success' },
      { time: '13:00', event: 'ส่งเตือนนัด 1 วันล่วงหน้า — 3 ราย', status: 'success' },
    ],
  },
  {
    id: 'nurse_summary', icon: FileText, name: 'Nurse Summary Agent',
    purpose: 'สรุปข้อมูลให้พยาบาลก่อนโทรกลับ',
    status: 'paused', input: 'ประวัติติดตาม, AI transcript', output: 'สรุป 1 หน้า, จุดสำคัญ',
    approval: false, todayCalls: 0, successRate: 95, avgDuration: '0:05', lastRun: 'หยุดชั่วคราว',
    logs: [
      { time: '12:00', event: 'Agent หยุดทำงานโดยผู้ดูแลระบบ', status: 'warning' },
    ],
  },
  {
    id: 'chatbot', icon: MessageSquare, name: 'Chatbot Triage Agent',
    purpose: 'คัดกรองอาการเบื้องต้นผ่าน LINE/Chat',
    status: 'coming_soon', input: 'ข้อความผู้ป่วย', output: 'ระดับความเร่งด่วน, คำแนะนำ',
    approval: true, todayCalls: 0, successRate: 0, avgDuration: '-', lastRun: '-',
    logs: [],
  },
  {
    id: 'medication', icon: Pill, name: 'Medication Adherence Agent',
    purpose: 'ติดตามการทานยาและแจ้งเตือนรายวัน',
    status: 'coming_soon', input: 'ตารางยา, การตอบของผู้ป่วย', output: 'สถานะการทานยา, แจ้งเตือน',
    approval: false, todayCalls: 0, successRate: 0, avgDuration: '-', lastRun: '-',
    logs: [],
  },
  {
    id: 'family', icon: Heart, name: 'Family Notification Agent',
    purpose: 'แจ้งเตือนญาติผู้ป่วยตามเงื่อนไขอัตโนมัติ',
    status: 'coming_soon', input: 'เหตุการณ์ความเสี่ยง, ความยินยอม', output: 'ข้อความ LINE, สรุปสถานะ',
    approval: true, todayCalls: 0, successRate: 0, avgDuration: '-', lastRun: '-',
    logs: [],
  },
  {
    id: 'report', icon: BarChart3, name: 'Report Generation Agent',
    purpose: 'สร้างรายงานสรุปอัตโนมัติรายวัน/รายสัปดาห์',
    status: 'coming_soon', input: 'ข้อมูลรวม, ช่วงเวลา', output: 'รายงาน PDF, Dashboard',
    approval: false, todayCalls: 0, successRate: 0, avgDuration: '-', lastRun: '-',
    logs: [],
  },
];

const statusConfig: Record<AgentStatus, { label: string; className: string; icon: typeof Play }> = {
  active: { label: 'กำลังทำงาน', className: 'bg-risk-green-bg text-risk-green', icon: CheckCircle2 },
  paused: { label: 'หยุดชั่วคราว', className: 'bg-risk-yellow-bg text-risk-yellow', icon: Pause },
  coming_soon: { label: 'เร็วๆ นี้', className: 'bg-muted text-muted-foreground', icon: Clock },
  error: { label: 'มีปัญหา', className: 'bg-risk-red-bg text-risk-red', icon: XCircle },
};

function AIAgentsPage() {
  const { role } = useAuth();
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const isAdmin = role === 'admin';

  const activeAgents = agentsData.filter(a => a.status === 'active').length;
  const totalCallsToday = agentsData.reduce((sum, a) => sum + a.todayCalls, 0);
  const avgSuccess = Math.round(
    agentsData.filter(a => a.status === 'active' && a.successRate > 0)
      .reduce((sum, a) => sum + a.successRate, 0) /
    agentsData.filter(a => a.status === 'active' && a.successRate > 0).length
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Agent Center</h1>
          <p className="text-sm text-muted-foreground">ศูนย์ควบคุม AI Agent สำหรับการติดตามดูแลผู้ป่วย</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Bot className="h-4 w-4" />
            <span className="text-xs">Agent ที่ทำงาน</span>
          </div>
          <p className="text-2xl font-bold text-risk-green">{activeAgents}</p>
          <p className="text-xs text-muted-foreground">จาก {agentsData.length} ทั้งหมด</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-xs">งานวันนี้</span>
          </div>
          <p className="text-2xl font-bold">{totalCallsToday}</p>
          <p className="text-xs text-muted-foreground">calls / tasks</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">อัตราสำเร็จเฉลี่ย</span>
          </div>
          <p className="text-2xl font-bold text-teal">{avgSuccess}%</p>
          <p className="text-xs text-muted-foreground">Active agents</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">ต้องตรวจสอบ</span>
          </div>
          <p className="text-2xl font-bold text-risk-yellow">{agentsData.filter(a => a.status === 'paused' || a.status === 'error').length}</p>
          <p className="text-xs text-muted-foreground">paused / error</p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {agentsData.map(agent => {
          const status = statusConfig[agent.status];
          const isExpanded = expandedAgent === agent.id;
          const StatusIcon = status.icon;

          return (
            <div key={agent.id} className={`rounded-xl border bg-card transition-all ${agent.status === 'active' ? 'border-risk-green/30' : agent.status === 'paused' ? 'border-risk-yellow/30' : ''}`}>
              {/* Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${agent.status === 'active' ? 'bg-risk-green-bg text-risk-green' : agent.status === 'paused' ? 'bg-risk-yellow-bg text-risk-yellow' : 'bg-muted text-muted-foreground'}`}>
                      <agent.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                      <StatusIcon className="h-3 w-3" /> {status.label}
                    </span>
                  </div>
                </div>

                {/* Metrics (only for active/paused) */}
                {agent.status !== 'coming_soon' && (
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold">{agent.todayCalls}</p>
                      <p className="text-[10px] text-muted-foreground">งานวันนี้</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${agent.successRate >= 90 ? 'text-risk-green' : agent.successRate >= 70 ? 'text-risk-yellow' : 'text-risk-red'}`}>{agent.successRate}%</p>
                      <p className="text-[10px] text-muted-foreground">สำเร็จ</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{agent.avgDuration}</p>
                      <p className="text-[10px] text-muted-foreground">เวลาเฉลี่ย</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-muted-foreground mt-1">{agent.lastRun}</p>
                      <p className="text-[10px] text-muted-foreground">ล่าสุด</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {agent.status !== 'coming_soon' && (
                    <>
                      <button onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                        className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-muted">
                        <Eye className="h-3.5 w-3.5" /> {isExpanded ? 'ซ่อน Log' : 'ดู Log'}
                      </button>
                      {isAdmin && agent.status === 'active' && (
                        <button onClick={() => toast.info(`หยุด ${agent.name} ชั่วคราว`)}
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-muted text-risk-yellow">
                          <Pause className="h-3.5 w-3.5" /> หยุด
                        </button>
                      )}
                      {isAdmin && agent.status === 'paused' && (
                        <button onClick={() => toast.success(`เปิด ${agent.name} อีกครั้ง`)}
                          className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs hover:bg-muted text-risk-green">
                          <Play className="h-3.5 w-3.5" /> เปิดใช้งาน
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => toast.info(`ตั้งค่า ${agent.name}`)}
                          className="rounded-lg border p-1.5 text-xs hover:bg-muted">
                          <Settings className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </>
                  )}
                  {agent.approval && (
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">ต้องอนุมัติก่อนดำเนินการ</span>
                  )}
                </div>
              </div>

              {/* Expanded Log */}
              {isExpanded && agent.logs.length > 0 && (
                <div className="border-t px-5 py-3 bg-muted/30">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Activity Log วันนี้
                  </h4>
                  <div className="space-y-1.5">
                    {agent.logs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-muted-foreground w-10 shrink-0 font-mono">{log.time}</span>
                        <span className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${log.status === 'success' ? 'bg-risk-green' : log.status === 'warning' ? 'bg-risk-yellow' : 'bg-risk-red'}`} />
                        <span>{log.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
