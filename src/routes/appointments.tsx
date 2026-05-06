import { createFileRoute } from '@tanstack/react-router';
import { appointments } from '@/lib/mock-data';
import { toast } from 'sonner';
import { CalendarCheck, CalendarX, Car, Phone, Bell } from 'lucide-react';

export const Route = createFileRoute('/appointments')({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const missed = appointments.filter(a => a.status === 'missed');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">จัดการนัดหมาย</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
        <div className="stat-card border-l-4 border-l-teal"><p className="text-sm text-muted-foreground">นัดที่กำลังจะมาถึง</p><p className="text-3xl font-bold mt-1">{upcoming.length}</p></div>
        <div className="stat-card border-l-4 border-l-risk-red"><p className="text-sm text-muted-foreground">ขาดนัด</p><p className="text-3xl font-bold mt-1">{missed.length}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">ต้องการรถรับส่ง</p><p className="text-3xl font-bold mt-1">{appointments.filter(a => a.needsTransport).length}</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">ส่ง Reminder แล้ว</p><p className="text-3xl font-bold mt-1">{appointments.filter(a => a.reminderSent).length}</p></div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="section-title flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" /> นัดที่กำลังจะมาถึง</h2>
          <div className="rounded-xl border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ชื่อ</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">วันที่</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">เวลา</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">แผนก</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">แพทย์</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reminder</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">แจ้งญาติ</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">รถรับส่ง</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(a => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">{a.hn}</td>
                    <td className="px-4 py-3 font-medium">{a.patientName}</td>
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{a.time}</td>
                    <td className="px-4 py-3">{a.department}</td>
                    <td className="px-4 py-3">{a.doctor}</td>
                    <td className="px-4 py-3">{a.reminderSent ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{a.familyNotified ? '✅' : '❌'}</td>
                    <td className="px-4 py-3">{a.needsTransport ? '🚗 ต้องการ' : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {missed.length > 0 && (
          <div>
            <h2 className="section-title flex items-center gap-2"><CalendarX className="h-5 w-5 text-risk-red" /> ขาดนัด</h2>
            <div className="rounded-xl border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">ชื่อ</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">วันที่นัด</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">แผนก</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {missed.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{a.hn}</td>
                      <td className="px-4 py-3 font-medium">{a.patientName}</td>
                      <td className="px-4 py-3">{a.date}</td>
                      <td className="px-4 py-3">{a.department}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toast.info(`โทรนัดใหม่: ${a.patientName}`)} className="rounded p-1.5 hover:bg-muted"><Phone className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
