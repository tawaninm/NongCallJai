import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { familyContacts, familyMessageTemplates } from '@/lib/mock-data';
import { toast } from 'sonner';
import { Send, MessageSquare, Phone, Eye, Clock } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/family')({
  component: FamilyNotificationPage,
});

function FamilyNotificationPage() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState('');

  return (
    <div>
      <div className="page-header"><h1 className="page-title">ศูนย์แจ้งเตือนญาติ</h1></div>

      {/* Message Templates */}
      <div className="rounded-xl border bg-card p-5 mb-6">
        <h2 className="section-title flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> เทมเพลตข้อความ</h2>
        <div className="flex flex-wrap gap-2">
          {familyMessageTemplates.map(t => (
            <button key={t.id} onClick={() => { setSelectedTemplate(t.name); toast.info(`เลือกเทมเพลต: ${t.name}`); }}
              className={`rounded-lg border px-3 py-2 text-xs transition-all hover:bg-primary/5 hover:border-primary/40 ${selectedTemplate === t.name ? 'border-primary bg-primary/5' : ''}`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {familyContacts.map(fc => (
          <div key={fc.id} className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{fc.caregiverName}</h3>
                <p className="text-xs text-muted-foreground">{fc.relationship} ของ {fc.patientName}</p>
              </div>
              <span className="rounded-full bg-teal-light px-2 py-0.5 text-xs font-medium text-teal">{fc.consentLevel}</span>
            </div>

            <dl className="space-y-1 text-sm mb-3">
              <div className="flex justify-between"><dt className="text-muted-foreground">เบอร์โทร</dt><dd>{fc.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">LINE ID</dt><dd>{fc.lineId}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">แจ้งล่าสุด</dt><dd className="text-xs">{fc.lastNotification}</dd></div>
            </dl>

            <div className="space-y-1 mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> ประวัติการแจ้ง</h4>
              {fc.notificationHistory.map((n, i) => (
                <button key={i} onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: fc.patientId } })}
                  className="flex w-full items-center justify-between text-xs hover:bg-muted/50 rounded px-1 py-0.5 transition-colors">
                  <span>{n.date} — {n.type}</span>
                  <span className="text-risk-green">{n.status}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => toast.success(`ส่ง LINE ถึง ${fc.caregiverName}`)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-risk-green px-3 py-2 text-xs font-medium text-white hover:opacity-90">
                <Send className="h-3.5 w-3.5" /> ส่ง LINE
              </button>
              <button onClick={() => toast.info(`โทรหา ${fc.caregiverName}`)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                <Phone className="h-3.5 w-3.5" /> โทร
              </button>
              <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: fc.patientId } })} className="rounded-lg border px-2 py-2 text-xs hover:bg-muted">
                <Eye className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
