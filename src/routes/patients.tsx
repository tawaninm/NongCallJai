import { createFileRoute, useNavigate, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { patients } from '@/lib/mock-data';
import type { RiskLevel, CaseStatus } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';
import { Search, Filter, Eye, Phone, UserPlus, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/patients')({
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');

  const departments = [...new Set(patients.map(p => p.department))];

  const filtered = patients.filter(p => {
    if (search && !p.name.includes(search) && !p.hn.includes(search) && !p.phone.includes(search) && !p.symptomSummary.includes(search)) return false;
    if (riskFilter !== 'all' && p.riskLevel !== riskFilter) return false;
    if (deptFilter !== 'all' && p.department !== deptFilter) return false;
    if (statusFilter !== 'all' && p.caseStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">คิวผู้ป่วย</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} รายการ</span>
      </div>

      <div className="filter-bar">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="ค้นหา HN / ชื่อ / เบอร์โทร / อาการ..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as any)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกระดับความเสี่ยง</option>
          <option value="green">🟢 เขียว</option>
          <option value="yellow">🟡 เหลือง</option>
          <option value="red">🔴 แดง</option>
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกแผนก</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอติดตาม</option>
          <option value="contacted">ติดต่อแล้ว</option>
          <option value="callback">รอโทรกลับ</option>
          <option value="referred_doctor">ส่งแพทย์</option>
          <option value="closed">ปิดเคส</option>
        </select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ชื่อผู้ป่วย</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">อายุ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">แผนดูแล</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ติดต่อล่าสุด</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สรุปอาการ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ยา</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ความเสี่ยง</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">พยาบาล</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{p.hn}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.age}</td>
                  <td className="px-4 py-3 text-xs">{p.carePlan}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.lastContact}</td>
                  <td className="px-4 py-3 text-xs max-w-[200px] truncate">{p.symptomSummary}</td>
                  <td className="px-4 py-3 text-xs">{p.medicationStatus}</td>
                  <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                  <td className="px-4 py-3 text-xs">{p.assignedNurse}</td>
                  <td className="px-4 py-3"><CaseStatusBadge status={p.caseStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="rounded p-1.5 hover:bg-muted" title="ดูเคส"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => toast.success(`กำลังโทรกลับ ${p.name}`)} className="rounded p-1.5 hover:bg-muted" title="โทรกลับ"><Phone className="h-4 w-4" /></button>
                      <button onClick={() => toast.info(`ส่งต่อแพทย์: ${p.name}`)} className="rounded p-1.5 hover:bg-muted" title="ส่งแพทย์"><UserPlus className="h-4 w-4" /></button>
                      <button onClick={() => toast.success(`ปิดเคส: ${p.name}`)} className="rounded p-1.5 hover:bg-muted" title="ปิดเคส"><XCircle className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
