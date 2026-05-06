import { createFileRoute } from '@tanstack/react-router';
import { familyContacts } from '@/lib/mock-data';
import { toast } from 'sonner';
import { Send, MessageSquare, Bell } from 'lucide-react';

export const Route = createFileRoute('/family')({
  component: FamilyNotificationPage,
});

function FamilyNotificationPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ศูนย์แจ้งเตือนญาติ</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {familyContacts.map(fc => (
          <div key={fc.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{fc.caregiverName}</h3>
                <p className="text-xs text-muted-foreground">{fc.relationship} ของ {fc.patientName}</p>
              </div>
              <span className="rounded-full bg-teal-light px-2 py-0.5 text-xs font-medium text-teal">{fc.consentLevel}</span>
            </div>

            <dl className="space-y-1 text-sm mb-4">
              <div className="flex justify-between"><dt className="text-muted-foreground">เบอร์โทร</dt><dd>{fc.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">LINE ID</dt><dd>{fc.lineId}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">แจ้งล่าสุด</dt><dd className="text-xs">{fc.lastNotification}</dd></div>
            </dl>

            <div className="space-y-1.5 mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground">ประวัติการแจ้ง</h4>
              {fc.notificationHistory.map((n, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span>{n.date} — {n.type}</span>
                  <span className="text-risk-green">{n.status}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => toast.success(`ส่ง LINE ถึง ${fc.caregiverName}`)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-risk-green px-3 py-2 text-xs font-medium text-white hover:opacity-90">
                <Send className="h-3.5 w-3.5" /> ส่ง LINE
              </button>
              <button onClick={() => toast.info(`โทรหา ${fc.caregiverName}`)} className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted">
                <MessageSquare className="h-3.5 w-3.5" /> โทร
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="section-title flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> สรุปรายสัปดาห์ (Placeholder)</h2>
        <div className="flex flex-col items-center py-8 text-muted-foreground">
          <Bell className="h-10 w-10 mb-2" />
          <p className="text-sm">ฟังก์ชันสรุปรายสัปดาห์จะเปิดใช้งานในเวอร์ชันถัดไป</p>
        </div>
      </div>
    </div>
  );
}
