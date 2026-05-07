import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { appointments } from '@/lib/mock-data';
import { toast } from 'sonner';
import { CalendarCheck, CalendarX, Phone, Bell, Car, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

export const Route = createFileRoute('/appointments')({
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const navigate = useNavigate();
  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const missed = appointments.filter(a => a.status === 'missed');

  return (
    <div>
      <div className="page-header"><h1 className="page-title">จัดการนัดหมาย</h1></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-6">
        <StatCard title="นัดกำลังจะมา" value={upcoming.length} icon={CalendarCheck} variant="teal" />
        <StatCard title="ขาดนัด" value={missed.length} icon={CalendarX} variant="red" />
        <StatCard title="ต้องการรถรับส่ง" value={appointments.filter(a => a.needsTransport).length} icon={Car} />
        <StatCard title="ส่ง Reminder แล้ว" value={appointments.filter(a => a.reminderSent).length} icon={CheckCircle} variant="green" />
        <StatCard title="Reminder ล้มเหลว" value={appointments.filter(a => a.reminderFailed).length} icon={Bell} variant="yellow" />
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">โรค</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">วันที่</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">เวลา</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">แผนก</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">แพทย์</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reminder</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ญาติ</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">รถ</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(a => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: a.patientId } })}>
                    <td className="px-4 py-3 font-mono text-xs">{a.hn}</td>
                    <td className="px-4 py-3 font-medium">{a.patientName}</td>
                    <td className="px-4 py-3 text-xs">{a.disease}</td>
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{a.time}</td>
                    <td className="px-4 py-3">{a.department}</td>
                    <td className="px-4 py-3">{a.doctor}</td>
                    <td className="px-4 py-3">{a.reminderSent ? '✅' : a.reminderFailed ? '❌' : '⏳'}</td>
                    <td className="px-4 py-3">{a.familyNotified ? '✅' : '—'}</td>
                    <td className="px-4 py-3">{a.needsTransport ? '🚗' : '—'}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={() => toast.success(`ส่ง Reminder: ${a.patientName}`)} className="rounded p-1.5 hover:bg-muted"><Bell className="h-4 w-4" /></button>
                        <button onClick={() => toast.info(`โทร: ${a.patientName}`)} className="rounded p-1.5 hover:bg-muted"><Phone className="h-4 w-4" /></button>
                      </div>
                    </td>
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">โรค</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
                  </tr>
                </thead>
                <tbody>
                  {missed.map(a => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs">{a.hn}</td>
                      <td className="px-4 py-3 font-medium">{a.patientName}</td>
                      <td className="px-4 py-3">{a.date}</td>
                      <td className="px-4 py-3 text-xs">{a.disease}</td>
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
