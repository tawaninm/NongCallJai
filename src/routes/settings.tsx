import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import {
  Users, Shield, Building2, ClipboardList, AlertTriangle, Bot, Bell,
  Link2, FileText, ChevronRight, Save, Plus, Trash2, Edit, Eye,
  Check, X, Settings as SettingsIcon, Clock, Search
} from 'lucide-react';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

type SettingsTab = 'users' | 'roles' | 'departments' | 'careplan' | 'risk' | 'ai_scripts' | 'notifications' | 'integrations' | 'audit';

const tabs: { id: SettingsTab; icon: typeof Users; label: string }[] = [
  { id: 'users', icon: Users, label: 'จัดการผู้ใช้' },
  { id: 'roles', icon: Shield, label: 'สิทธิ์การใช้งาน' },
  { id: 'departments', icon: Building2, label: 'จัดการแผนก' },
  { id: 'careplan', icon: ClipboardList, label: 'เทมเพลตแผนดูแล' },
  { id: 'risk', icon: AlertTriangle, label: 'เกณฑ์ความเสี่ยง' },
  { id: 'ai_scripts', icon: Bot, label: 'สคริปต์ AI' },
  { id: 'notifications', icon: Bell, label: 'กฎการแจ้งเตือน' },
  { id: 'integrations', icon: Link2, label: 'เชื่อมต่อระบบ' },
  { id: 'audit', icon: FileText, label: 'Audit Log' },
];

const mockUsers = [
  { id: '1', name: 'พย.สมศรี ดีมาก', email: 'somsri@hospital.go.th', role: 'nurse', status: 'active', lastLogin: '08 พ.ค. 2026, 08:30' },
  { id: '2', name: 'นพ.วิชัย สมบูรณ์', email: 'wichai@hospital.go.th', role: 'doctor', status: 'active', lastLogin: '08 พ.ค. 2026, 09:15' },
  { id: '3', name: 'ภญ.พิมพ์ใจ รักดี', email: 'pimjai@hospital.go.th', role: 'pharmacist', status: 'active', lastLogin: '07 พ.ค. 2026, 16:00' },
  { id: '4', name: 'จนท.สุดา โทรดี', email: 'suda@hospital.go.th', role: 'callcenter', status: 'active', lastLogin: '08 พ.ค. 2026, 07:45' },
  { id: '5', name: 'Admin ระบบ', email: 'admin@hospital.go.th', role: 'admin', status: 'active', lastLogin: '08 พ.ค. 2026, 10:00' },
];

const roleLabels: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ',
  nurse: 'พยาบาล',
  doctor: 'แพทย์',
  pharmacist: 'เภสัชกร',
  callcenter: 'Call Center',
};

const rolePermissions = [
  { module: 'Dashboard', admin: true, nurse: true, doctor: true, pharmacist: true, callcenter: true },
  { module: 'คิวผู้ป่วย', admin: true, nurse: true, doctor: true, pharmacist: true, callcenter: true },
  { module: 'เคสดูแล', admin: true, nurse: true, doctor: true, pharmacist: false, callcenter: true },
  { module: 'AI Follow-up', admin: true, nurse: true, doctor: true, pharmacist: false, callcenter: true },
  { module: 'แผนดูแล', admin: true, nurse: true, doctor: true, pharmacist: false, callcenter: false },
  { module: 'ติดตามยา', admin: true, nurse: true, doctor: true, pharmacist: true, callcenter: false },
  { module: 'นัดหมาย', admin: true, nurse: true, doctor: true, pharmacist: false, callcenter: true },
  { module: 'แจ้งญาติ', admin: true, nurse: true, doctor: false, pharmacist: false, callcenter: true },
  { module: 'รายงาน', admin: true, nurse: true, doctor: true, pharmacist: true, callcenter: false },
  { module: 'AI Agents', admin: true, nurse: false, doctor: false, pharmacist: false, callcenter: false },
  { module: 'ตั้งค่า', admin: true, nurse: false, doctor: false, pharmacist: false, callcenter: false },
];

const auditLogs = [
  { time: '14:35', user: 'พย.สมศรี', action: 'เปลี่ยนสถานะเคส HN-1001 → ส่งแพทย์', type: 'case' },
  { time: '14:20', user: 'AI Voice Agent', action: 'โทรติดตาม HN-1003 — สำเร็จ, Risk: Green', type: 'ai' },
  { time: '14:10', user: 'นพ.วิชัย', action: 'บันทึกบันทึกแพทย์สำหรับ HN-1002', type: 'medical' },
  { time: '13:55', user: 'AI Risk Agent', action: 'ประเมิน HN-1005 → Red (BP 185/115)', type: 'ai' },
  { time: '13:40', user: 'ภญ.พิมพ์ใจ', action: 'ตรวจสอบยา HN-1001 — ปรับขนาดยา', type: 'medication' },
  { time: '13:20', user: 'Admin ระบบ', action: 'เพิ่มผู้ใช้ใหม่: จนท.สุดา', type: 'system' },
  { time: '12:00', user: 'Admin ระบบ', action: 'หยุด Nurse Summary Agent ชั่วคราว', type: 'system' },
  { time: '11:30', user: 'พย.วิภา', action: 'แจ้งญาติ HN-1002 ผ่าน LINE', type: 'family' },
  { time: '10:00', user: 'AI Voice Agent', action: 'โทรติดตาม HN-1004 — ไม่รับสาย', type: 'ai' },
  { time: '09:30', user: 'พย.สมศรี', action: 'บันทึกบันทึกพยาบาลสำหรับ HN-1003', type: 'case' },
];

const typeColors: Record<string, string> = {
  case: 'bg-primary/10 text-primary',
  ai: 'bg-teal-light text-teal',
  medical: 'bg-risk-red-bg text-risk-red',
  medication: 'bg-risk-yellow-bg text-risk-yellow',
  system: 'bg-muted text-muted-foreground',
  family: 'bg-risk-green-bg text-risk-green',
};

function SettingsPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');
  const [auditSearch, setAuditSearch] = useState('');

  if (role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Shield className="h-12 w-12 mb-3" />
        <p className="text-lg font-semibold">ไม่มีสิทธิ์เข้าถึง</p>
        <p className="text-sm">หน้าตั้งค่าสำหรับผู้ดูแลระบบเท่านั้น</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">ตั้งค่าระบบ</h1>
          <p className="text-sm text-muted-foreground">จัดการผู้ใช้, สิทธิ์, และการตั้งค่าแพลตฟอร์ม</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === tab.id ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'users' && (
            <div className="rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-sm font-semibold">ผู้ใช้งานระบบ ({mockUsers.length})</h2>
                <button onClick={() => toast.info('เปิดฟอร์มเพิ่มผู้ใช้')} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-3.5 w-3.5" /> เพิ่มผู้ใช้
                </button>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">ชื่อ</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">อีเมล</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">บทบาท</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">สถานะ</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">เข้าสู่ระบบล่าสุด</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{roleLabels[u.role]}</span></td>
                      <td className="px-5 py-3"><span className="rounded-full bg-risk-green-bg px-2 py-0.5 text-xs font-medium text-risk-green">Active</span></td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => toast.info(`แก้ไข ${u.name}`)} className="rounded p-1.5 hover:bg-muted"><Edit className="h-4 w-4" /></button>
                          <button onClick={() => toast.error(`ลบ ${u.name}`)} className="rounded p-1.5 hover:bg-muted text-risk-red"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="rounded-xl border bg-card">
              <div className="border-b px-5 py-4">
                <h2 className="text-sm font-semibold">ตาราง Permission Matrix</h2>
                <p className="text-xs text-muted-foreground mt-0.5">กำหนดสิทธิ์การเข้าถึงแต่ละโมดูลตามบทบาท</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium text-muted-foreground">โมดูล</th>
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <th key={key} className="px-4 py-3 text-center font-medium text-muted-foreground">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rolePermissions.map((p, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-5 py-3 font-medium">{p.module}</td>
                        {(['admin', 'nurse', 'doctor', 'pharmacist', 'callcenter'] as const).map(r => (
                          <td key={r} className="px-4 py-3 text-center">
                            {p[r] ? <Check className="h-4 w-4 text-risk-green mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">แผนกในโรงพยาบาล</h2>
                <button onClick={() => toast.info('เพิ่มแผนกใหม่')} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-3.5 w-3.5" /> เพิ่มแผนก
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {['อายุรกรรม', 'หทัยวิทยา', 'ศัลยกรรม', 'ต่อมไร้ท่อ'].map((dept, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-light text-teal">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{dept}</p>
                        <p className="text-xs text-muted-foreground">{2 + i} แพทย์, {3 + i} พยาบาล</p>
                      </div>
                    </div>
                    <button className="rounded p-1.5 hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'careplan' && (
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">เทมเพลตแผนดูแล</h2>
                <button onClick={() => toast.info('สร้างเทมเพลตใหม่')} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-3.5 w-3.5" /> สร้างใหม่
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'ความดันโลหิตสูง — Post Discharge', icon: '🫀', rules: 5, active: true },
                  { name: 'เบาหวานชนิดที่ 2 — ติดตามรายสัปดาห์', icon: '🩸', rules: 7, active: true },
                  { name: 'หัวใจล้มเหลว — เฝ้าระวังน้ำหนัก', icon: '❤️‍🩹', rules: 6, active: true },
                  { name: 'หลังผ่าตัด — 7 วันแรก', icon: '🩹', rules: 4, active: false },
                ].map((cp, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cp.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{cp.name}</p>
                        <p className="text-xs text-muted-foreground">{cp.rules} กฎติดตาม · {cp.active ? 'ใช้งานอยู่' : 'ปิดใช้งาน'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cp.active ? 'bg-risk-green-bg text-risk-green' : 'bg-muted text-muted-foreground'}`}>
                        {cp.active ? 'Active' : 'Inactive'}
                      </span>
                      <button className="rounded p-1.5 hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">เกณฑ์ประเมินระดับความเสี่ยง</h2>
              <div className="space-y-4">
                {[
                  { level: 'Red (วิกฤต)', color: 'border-l-risk-red', criteria: ['BP ≥ 180/110', 'FBS ≥ 300 mg/dL', 'น้ำหนักเพิ่ม ≥ 2 kg/สัปดาห์', 'หยุดยาเอง', 'แจ้งอาการเจ็บหน้าอก/หายใจลำบาก'] },
                  { level: 'Yellow (เฝ้าระวัง)', color: 'border-l-risk-yellow', criteria: ['BP 140-179/90-109', 'FBS 200-299 mg/dL', 'น้ำหนักเพิ่ม 1-2 kg/สัปดาห์', 'ลืมทานยา 1-2 มื้อ', 'ไม่รับสาย 2 ครั้ง'] },
                  { level: 'Green (ปกติ)', color: 'border-l-risk-green', criteria: ['BP < 140/90', 'FBS < 200 mg/dL', 'น้ำหนักคงที่', 'ทานยาครบ', 'ไม่มีอาการผิดปกติ'] },
                ].map((r, i) => (
                  <div key={i} className={`rounded-lg border border-l-4 ${r.color} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold">{r.level}</h3>
                      <button className="rounded p-1 hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </div>
                    <ul className="space-y-1">
                      {r.criteria.map((c, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success('บันทึกเกณฑ์เรียบร้อย')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <Save className="h-3.5 w-3.5" /> บันทึกเกณฑ์
              </button>
            </div>
          )}

          {activeTab === 'ai_scripts' && (
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">สคริปต์ AI Voicebot</h2>
              <div className="space-y-3">
                {[
                  { name: 'สคริปต์เปิดสนทนา (Greeting)', lang: 'th', version: 'v2.1' },
                  { name: 'สคริปต์ถามอาการ (Symptom Check)', lang: 'th', version: 'v1.5' },
                  { name: 'สคริปต์ยืนยันยา (Medication Confirm)', lang: 'th', version: 'v1.3' },
                  { name: 'สคริปต์ปิดสนทนา (Closing)', lang: 'th', version: 'v2.0' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-teal" />
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">ภาษา: {s.lang} · เวอร์ชัน: {s.version}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => toast.info(`ดูตัวอย่าง: ${s.name}`)} className="rounded p-1.5 hover:bg-muted"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={() => toast.info(`แก้ไข: ${s.name}`)} className="rounded p-1.5 hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">กฎการแจ้งเตือนอัตโนมัติ</h2>
              <div className="space-y-3">
                {[
                  { trigger: 'ผู้ป่วยได้ Risk Red', action: 'แจ้งพยาบาล + แพทย์ทันที', channel: 'LINE + ระบบ', active: true },
                  { trigger: 'ไม่รับสาย 3 ครั้ง', action: 'แจ้ง Call Center + ส่งญาติ', channel: 'LINE + SMS', active: true },
                  { trigger: 'หยุดยาเอง', action: 'แจ้งเภสัชกร + พยาบาล', channel: 'ระบบ', active: true },
                  { trigger: 'น้ำหนักเพิ่ม ≥ 2 kg', action: 'แจ้งแพทย์ + นัด Teleconsult', channel: 'ระบบ + LINE', active: false },
                  { trigger: 'ขาดนัดพบแพทย์', action: 'แจ้งพยาบาล + โทรตาม', channel: 'ระบบ + SMS', active: true },
                ].map((r, i) => (
                  <div key={i} className={`flex items-center justify-between rounded-lg border p-4 ${!r.active ? 'opacity-50' : ''}`}>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{r.trigger}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">→ {r.action}</p>
                      <p className="text-xs text-muted-foreground">ช่องทาง: {r.channel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.active ? 'bg-risk-green-bg text-risk-green' : 'bg-muted text-muted-foreground'}`}>
                        {r.active ? 'เปิดใช้' : 'ปิด'}
                      </span>
                      <button className="rounded p-1.5 hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold mb-4">การเชื่อมต่อระบบภายนอก</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  { name: 'LINE OA', desc: 'ส่งข้อความ/แจ้งเตือนผ่าน LINE', status: 'connected', icon: '💚' },
                  { name: 'AI Voicebot API', desc: 'เชื่อมต่อระบบโทรอัตโนมัติ', status: 'connected', icon: '🤖' },
                  { name: 'HIS (Hospital Information System)', desc: 'ดึงข้อมูลผู้ป่วยจาก HIS', status: 'pending', icon: '🏥' },
                  { name: 'SMS Gateway', desc: 'ส่ง SMS แจ้งเตือน', status: 'disconnected', icon: '📱' },
                  { name: 'Teleconsult Platform', desc: 'Video call กับผู้ป่วย', status: 'coming_soon', icon: '📹' },
                ].map((int, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{int.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{int.name}</p>
                        <p className="text-xs text-muted-foreground">{int.desc}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      int.status === 'connected' ? 'bg-risk-green-bg text-risk-green' :
                      int.status === 'pending' ? 'bg-risk-yellow-bg text-risk-yellow' :
                      int.status === 'coming_soon' ? 'bg-muted text-muted-foreground' :
                      'bg-risk-red-bg text-risk-red'
                    }`}>
                      {int.status === 'connected' ? 'เชื่อมต่อแล้ว' : int.status === 'pending' ? 'รอตั้งค่า' : int.status === 'coming_soon' ? 'เร็วๆ นี้' : 'ไม่ได้เชื่อมต่อ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="rounded-xl border bg-card">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-sm font-semibold">Audit Log — กิจกรรมระบบ</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input type="text" placeholder="ค้นหา..." value={auditSearch} onChange={e => setAuditSearch(e.target.value)}
                    className="rounded-lg border bg-background py-1.5 pl-9 pr-3 text-xs w-48" />
                </div>
              </div>
              <div className="divide-y">
                {auditLogs.filter(l => !auditSearch || l.action.includes(auditSearch) || l.user.includes(auditSearch)).map((log, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30">
                    <span className="text-xs text-muted-foreground font-mono w-10 shrink-0 mt-0.5">{log.time}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 mt-0.5 ${typeColors[log.type]}`}>{log.type}</span>
                    <div className="min-w-0">
                      <p className="text-sm"><span className="font-medium">{log.user}</span> — {log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
