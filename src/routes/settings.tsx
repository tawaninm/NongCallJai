import { createFileRoute } from '@tanstack/react-router';
import { Users, Shield, Building2, ClipboardList, AlertTriangle, Bot, Bell, Link2, FileText } from 'lucide-react';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

const sections = [
  { icon: Users, title: 'จัดการผู้ใช้', desc: 'เพิ่ม ลบ แก้ไขผู้ใช้งานระบบ' },
  { icon: Shield, title: 'สิทธิ์การใช้งาน', desc: 'กำหนดบทบาทและสิทธิ์' },
  { icon: Building2, title: 'จัดการแผนก', desc: 'เพิ่ม แก้ไขแผนกในโรงพยาบาล' },
  { icon: ClipboardList, title: 'แผนการดูแล', desc: 'จัดการเทมเพลตแผนดูแล' },
  { icon: AlertTriangle, title: 'ระดับความเสี่ยง', desc: 'ปรับเกณฑ์ระดับความเสี่ยง' },
  { icon: Bot, title: 'สคริปต์ AI', desc: 'แก้ไขสคริปต์ AI Voicebot/Chatbot' },
  { icon: Bell, title: 'กฎการแจ้งเตือน', desc: 'ตั้งค่าเงื่อนไขการแจ้งเตือน' },
  { icon: Link2, title: 'เชื่อมต่อระบบ', desc: 'LINE OA / Voicebot / Web App (Placeholder)' },
  { icon: FileText, title: 'Audit Log', desc: 'ดูบันทึกกิจกรรมระบบ' },
];

function SettingsPage() {
  return (
    <div>
      <div className="page-header"><h1 className="page-title">ตั้งค่าระบบ</h1></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <button key={i} className="flex items-start gap-4 rounded-xl border bg-card p-5 text-left hover:bg-muted/30 transition-colors">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-light text-teal">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
