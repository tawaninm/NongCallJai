import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { patients } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { toast } from 'sonner';
import { Pill, AlertTriangle, Phone, Eye, Stethoscope, Heart } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

export const Route = createFileRoute('/medication')({
  component: MedicationPage,
});

function MedicationPage() {
  const navigate = useNavigate();
  const medIssues = patients.filter(p => p.medicationStatus !== 'ทานยาครบ');
  const forgot = patients.filter(p => p.medicationStatus === 'ลืมทานยา').length;
  const stopped = patients.filter(p => p.medicationStatus === 'หยุดยาเอง').length;
  const waitPharm = patients.filter(p => p.pharmacistStatus === 'รอตรวจ').length;

  return (
    <div>
      <div className="page-header"><h1 className="page-title">ติดตามการใช้ยา</h1></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-6">
        <StatCard title="มีปัญหาการใช้ยา" value={medIssues.length} icon={Pill} variant="yellow" />
        <StatCard title="ลืมทานยา" value={forgot} icon={AlertTriangle} variant="yellow" />
        <StatCard title="หยุดยาเอง" value={stopped} icon={AlertTriangle} variant="red" />
        <StatCard title="รอเภสัชกรตรวจ" value={waitPharm} icon={Stethoscope} variant="teal" />
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ชื่อ</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">โรค</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ปัญหายา</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">AI สรุป</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ความเสี่ยง</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">เภสัชกร</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {medIssues.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}>
                <td className="px-4 py-3 font-mono text-xs">{p.hn}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-xs">{p.carePlan}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-risk-yellow-bg px-2 py-0.5 text-xs font-medium text-risk-yellow">{p.medicationStatus}</span></td>
                <td className="px-4 py-3 text-xs max-w-[200px] truncate">{p.symptomSummary}</td>
                <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${p.pharmacistStatus === 'รอตรวจ' ? 'text-risk-yellow' : 'text-muted-foreground'}`}>{p.pharmacistStatus}</span></td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1">
                    <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="rounded p-1.5 hover:bg-muted"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`ส่งเภสัชกร: ${p.name}`)} className="rounded p-1.5 hover:bg-muted"><Pill className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`โทรกลับ: ${p.name}`)} className="rounded p-1.5 hover:bg-muted"><Phone className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {medIssues.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">ไม่มีปัญหาการใช้ยา</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
