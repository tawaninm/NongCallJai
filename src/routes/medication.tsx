import { createFileRoute } from '@tanstack/react-router';
import { patients } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { toast } from 'sonner';
import { Pill, AlertTriangle, XCircle, Phone } from 'lucide-react';

export const Route = createFileRoute('/medication')({
  component: MedicationPage,
});

function MedicationPage() {
  const medIssues = patients.filter(p => p.medicationStatus !== 'ทานยาครบ');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ติดตามการใช้ยา</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-6">
        <div className="stat-card border-l-4 border-l-risk-yellow">
          <p className="text-sm text-muted-foreground">มีปัญหาการใช้ยา</p>
          <p className="text-3xl font-bold mt-1">{medIssues.length}</p>
        </div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">ลืมทานยา</p><p className="text-3xl font-bold mt-1">1</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">หยุดยาเอง</p><p className="text-3xl font-bold mt-1">1</p></div>
        <div className="stat-card"><p className="text-sm text-muted-foreground">รอเภสัชกรตรวจสอบ</p><p className="text-3xl font-bold mt-1">2</p></div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ชื่อ</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ปัญหา</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">ความเสี่ยง</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {medIssues.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{p.hn}</td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.medicationStatus}</td>
                <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toast.info(`โทรติดตาม ${p.name}`)} className="rounded p-1.5 hover:bg-muted"><Phone className="h-4 w-4" /></button>
                    <button onClick={() => toast.info(`ส่งเภสัชกร: ${p.name}`)} className="rounded p-1.5 hover:bg-muted"><Pill className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {medIssues.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">ไม่มีปัญหาการใช้ยา</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
