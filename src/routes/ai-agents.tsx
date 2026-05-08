import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Bot, Phone, MessageSquare, Brain, Pill, Heart, Bell,
  CheckCircle, Clock, AlertTriangle, Settings, Play, FileText,
  ArrowRight, ExternalLink, Zap, Shield, Activity,
} from 'lucide-react';

export const Route = createFileRoute('/ai-agents')({
  component: AIAgentsPage,
});

interface Agent {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'connected' | 'draft' | 'coming_soon';
  provider: string;
  lastRun: string;
  successRate: string;
  totalCalls: number;
  errors: number;
  color: string;
  features: string[];
}

const agents: Agent[] = [
  {
    id: 'voice-followup', name: 'Voice Follow-up Agent', nameEn: 'Botnoi Voicebot',
    description: 'โทรติดตามผู้ป่วยอัตโนมัติ ถามอาการ สัญญาณชีพ การทานยา และนัดหมาย ด้วย Botnoi Voice AI',
    icon: Phone, status: 'connected', provider: 'Botnoi Voice', lastRun: '08:00 วันนี้',
    successRate: '83%', totalCalls: 6, errors: 1, color: 'text-teal-600 bg-teal-50',
    features: ['โทรออกอัตโนมัติ', 'STT / TTS ภาษาไทย', 'สรุปอาการ', 'จำแนกความเสี่ยง'],
  },
  {
    id: 'chatbot-triage', name: 'Chatbot Triage Agent', nameEn: 'Botnoi Chatbot',
    description: 'แชทบอทคัดกรองอาการเบื้องต้นผ่าน LINE / Web Chat ด้วย Botnoi Chatbot Platform',
    icon: MessageSquare, status: 'connected', provider: 'Botnoi Chatbot', lastRun: '10:30 วันนี้',
    successRate: '92%', totalCalls: 24, errors: 0, color: 'text-blue-600 bg-blue-50',
    features: ['รับข้อความ LINE / Web', 'คัดกรอง Intent', 'ส่งต่อพยาบาล', 'บันทึกประวัติ'],
  },
  {
    id: 'risk-scoring', name: 'Risk Scoring Agent', nameEn: 'Protocol-based Risk AI',
    description: 'วิเคราะห์ความเสี่ยงจากข้อมูลที่ AI รวบรวม จำแนกเป็น Green / Yellow / Red ตามโปรโตคอล',
    icon: Brain, status: 'connected', provider: 'CareGo Internal', lastRun: '08:05 วันนี้',
    successRate: '100%', totalCalls: 6, errors: 0, color: 'text-purple-600 bg-purple-50',
    features: ['วิเคราะห์ตามโปรโตคอลโรค', 'ระบุ Red Flags', 'คำนวณ Risk Score', 'ส่งเข้าคิวพยาบาล/แพทย์'],
  },
  {
    id: 'appointment-reminder', name: 'Appointment Reminder Agent', nameEn: 'Botnoi Voicebot',
    description: 'โทรเตือนนัดหมายอัตโนมัติ ยืนยันวัน เวลา สถานที่ ด้วย Botnoi Voice',
    icon: Bell, status: 'connected', provider: 'Botnoi Voice', lastRun: '07:00 วันนี้',
    successRate: '100%', totalCalls: 3, errors: 0, color: 'text-orange-600 bg-orange-50',
    features: ['โทรเตือนนัด', 'ยืนยัน/เลื่อนนัด', 'แจ้งญาติ', 'บันทึกผล'],
  },
  {
    id: 'med-adherence', name: 'Medication Adherence Agent', nameEn: 'Botnoi Chatbot',
    description: 'ติดตามการทานยาผ่าน LINE Chat แจ้งเตือนมื้อยา สอบถามผลข้างเคียง',
    icon: Pill, status: 'draft', provider: 'Botnoi Chatbot', lastRun: '-',
    successRate: '-', totalCalls: 0, errors: 0, color: 'text-green-600 bg-green-50',
    features: ['แจ้งเตือนมื้อยา', 'สอบถามผลข้างเคียง', 'รายงานเภสัชกร', 'ส่ง Sticker กำลังใจ'],
  },
  {
    id: 'family-notification', name: 'Family Notification Agent', nameEn: 'LINE OA + Botnoi',
    description: 'แจ้งญาติผู้ป่วยอัตโนมัติผ่าน LINE Official Account เมื่อมีอาการเปลี่ยนแปลง',
    icon: Heart, status: 'coming_soon', provider: 'LINE OA + Botnoi', lastRun: '-',
    successRate: '-', totalCalls: 0, errors: 0, color: 'text-pink-600 bg-pink-50',
    features: ['แจ้งเตือน LINE OA', 'Template ข้อความ', 'บันทึกการยืนยัน', 'ส่งรูปแบบหลายภาษา'],
  },
];

const statusConfig = {
  connected: { label: 'เชื่อมต่อแล้ว', badge: 'bg-risk-green-bg text-risk-green', icon: CheckCircle },
  draft: { label: 'กำลังพัฒนา', badge: 'bg-risk-yellow-bg text-risk-yellow', icon: Clock },
  coming_soon: { label: 'เร็วๆ นี้', badge: 'bg-muted text-muted-foreground', icon: AlertTriangle },
};

function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Bot className="h-7 w-7 text-primary" /> AI Agent Center</h1>
          <p className="text-sm text-muted-foreground mt-1">จัดการ AI Agent สำหรับติดตามดูแลผู้ป่วย — Powered by Botnoi AI</p>
        </div>
      </div>

      {/* Data Flow */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="section-title flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Data Flow Pipeline</h2>
        <div className="flex items-center gap-2 overflow-x-auto py-2 text-xs">
          {['Patient Response', 'Transcript (STT)', 'AI Summary', 'Risk Scoring', 'Nurse Queue', 'Human Action', 'Audit Log'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="rounded-lg bg-primary/10 px-3 py-1.5 font-medium text-primary whitespace-nowrap">{step}</span>
              {i < 6 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>
      </div>

      {/* Botnoi Integration Banner */}
      <div className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-800 p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Botnoi AI Platform</h3>
              <p className="text-xs opacity-80">Voicebot + Chatbot Integration — Bot ID: 69fd5d09fb</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Connected</span>
            <a href="https://console.botnoi.ai" target="_blank" rel="noopener" className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium hover:bg-white/30 flex items-center gap-1">
              Console <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 mb-6">
        {agents.map(agent => {
          const Icon = agent.icon;
          const st = statusConfig[agent.status];
          const StIcon = st.icon;
          return (
            <div key={agent.id} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedAgent(agent)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${agent.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.provider}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.badge}`}>
                  <StIcon className="h-3 w-3" /> {st.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{agent.description}</p>
              {agent.status === 'connected' && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 p-2"><p className="text-lg font-bold text-primary">{agent.totalCalls}</p><p className="text-[10px] text-muted-foreground">สาย</p></div>
                  <div className="rounded-lg bg-muted/50 p-2"><p className="text-lg font-bold text-risk-green">{agent.successRate}</p><p className="text-[10px] text-muted-foreground">สำเร็จ</p></div>
                  <div className="rounded-lg bg-muted/50 p-2"><p className="text-lg font-bold text-risk-red">{agent.errors}</p><p className="text-[10px] text-muted-foreground">Error</p></div>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-3">
                {agent.features.slice(0, 3).map((f, i) => <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{f}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Drawer */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelectedAgent(null)}>
          <div className="w-full max-w-lg bg-card h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b p-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{selectedAgent.name}</h2>
              <button onClick={() => setSelectedAgent(null)} className="rounded-lg p-2 hover:bg-muted text-sm">✕</button>
            </div>
            <div className="p-5 space-y-5">
              {/* Overview */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Activity className="h-4 w-4" /> Overview</h3>
                <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Provider</p><p className="font-medium">{selectedAgent.provider}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Last Run</p><p className="font-medium">{selectedAgent.lastRun}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Success Rate</p><p className="font-medium">{selectedAgent.successRate}</p></div>
                  <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Errors</p><p className="font-medium">{selectedAgent.errors}</p></div>
                </div>
              </div>
              {/* Features */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">{selectedAgent.features.map((f, i) => <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{f}</span>)}</div>
              </div>
              {/* Safety Rules */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4" /> AI Safety Rules</h3>
                <div className="rounded-lg bg-risk-yellow-bg p-3 text-xs space-y-1">
                  <p>• AI ต้องไม่วินิจฉัยโรคหรือสั่งยา</p>
                  <p>• AI รวบรวมข้อมูล สรุป และจำแนกความเสี่ยงตามโปรโตคอลเท่านั้น</p>
                  <p>• เคสสีแดงต้องมี Human Review ทุกครั้ง</p>
                  <p>• ข้อมูลต้องไม่ถูกเปิดเผยนอกทีมดูแล</p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={() => { toast.success(`ทดสอบ ${selectedAgent.name} สำเร็จ`); }} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2"><Play className="h-4 w-4" /> Test Agent</button>
                <button onClick={() => { toast.info('เปิด Log viewer'); }} className="flex-1 rounded-xl border py-2.5 text-sm font-medium flex items-center justify-center gap-2"><FileText className="h-4 w-4" /> View Logs</button>
                <button onClick={() => { toast.info('เปิดหน้าตั้งค่า Agent'); }} className="rounded-xl border px-4 py-2.5 text-sm font-medium"><Settings className="h-4 w-4" /></button>
              </div>
              {/* Botnoi-specific */}
              {selectedAgent.provider.includes('Botnoi') && (
                <div className="rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 p-4">
                  <h3 className="text-sm font-semibold mb-2 text-teal-700">🤖 Botnoi Platform Config</h3>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p><span className="font-medium text-foreground">Bot ID:</span> 69fd5d09fb3079f007911739</p>
                    <p><span className="font-medium text-foreground">Platform:</span> {selectedAgent.provider}</p>
                    <p><span className="font-medium text-foreground">Console:</span> <a href="https://console.botnoi.ai" target="_blank" className="text-primary underline">console.botnoi.ai</a></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
