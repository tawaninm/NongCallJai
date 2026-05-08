import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { patients, carePlanTemplates } from '@/lib/mock-data';
import type { RiskLevel, CaseStatus, CarePlanType } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { CaseStatusBadge } from '@/components/CaseStatusBadge';
import { Search, Eye, Phone, UserPlus, Pill, Heart, XCircle, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useActionModals } from '@/components/ActionModals';

export const Route = createFileRoute('/patients')({
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { open: openModal, Modals } = useActionModals();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'all'>('all');
  const [diseaseFilter, setDiseaseFilter] = useState<CarePlanType | 'all'>('all');

  const departments = [...new Set(patients.map(p => p.department))];

  let filteredPatients = patients;

  // Doctor default filter: Red/Yellow/Referred
  if (role === 'doctor') {
    filteredPatients = filteredPatients.filter(p =>
      p.riskLevel === 'red' || p.riskLevel === 'yellow' ||
      p.caseStatus === 'referred_doctor' || p.caseStatus === 'escalated'
    );
  }

  const filtered = filteredPatients.filter(p => {
    if (search && !p.name.includes(search) && !p.hn.includes(search) && !p.phone.includes(search) && !p.symptomSummary.includes(search)) return false;
    if (riskFilter !== 'all' && p.riskLevel !== riskFilter) return false;
    if (deptFilter !== 'all' && p.department !== deptFilter) return false;
    if (statusFilter !== 'all' && p.caseStatus !== statusFilter) return false;
    if (diseaseFilter !== 'all' && p.carePlanType !== diseaseFilter) return false;
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
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกระดับความเสี่ยง</option>
          <option value="green">🟢 เขียว</option>
          <option value="yellow">🟡 เหลือง</option>
          <option value="red">🔴 แดง</option>
        </select>
        <select value={diseaseFilter} onChange={e => setDiseaseFilter(e.target.value as CarePlanType | 'all')} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกโรค</option>
          <option value="hypertension">🫀 ความดันโลหิตสูง</option>
          <option value="diabetes">🩸 เบาหวานชนิดที่ 2</option>
          <option value="heart_failure">❤️‍🩹 ภาวะหัวใจล้มเหลว</option>
          <option value="post_op">🩹 หลังผ่าตัด</option>
        </select>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกแผนก</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as CaseStatus | 'all')} className="rounded-lg border bg-background px-3 py-2 text-sm">
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอติดตาม</option>
          <option value="contacted">ติดต่อแล้ว</option>
          <option value="callback">รอโทรกลับ</option>
          <option value="nurse_review">รอพยาบาลตรวจ</option>
          <option value="referred_doctor">ส่งแพทย์</option>
          <option value="referred_pharmacist">ส่งเภสัชกร</option>
          <option value="closed">ปิดเคส</option>
        </select>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ผู้ป่วย</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">อายุ</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">โรค / Care Plan</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">อาการล่าสุด</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ค่าล่าสุด</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สถานะยา</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ความเสี่ยง</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สถานะเคส</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ผู้ดูแล</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const diseaseIcon = p.carePlanType === 'hypertension' ? '🫀' : p.carePlanType === 'diabetes' ? '🩸' : p.carePlanType === 'heart_failure' ? '❤️‍🩹' : p.carePlanType === 'post_op' ? '🩹' : '💊';
                const vitalValue = p.carePlanType === 'hypertension' ? `BP ${p.latestBP}` : p.carePlanType === 'diabetes' ? `FBS ${p.latestBloodSugar}` : p.carePlanType === 'heart_failure' ? `Wt ${p.latestWeightChange}` : p.latestBP;
                return (
                  <tr key={p.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer border-l-4 ${p.riskLevel === 'red' ? 'border-l-risk-red' : p.riskLevel === 'yellow' ? 'border-l-risk-yellow' : 'border-l-risk-green'}`}
                    onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{p.hn}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.age}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="mr-1">{diseaseIcon}</span>{p.carePlan}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[180px] truncate">{p.symptomSummary}</td>
                    <td className="px-4 py-3 text-xs font-mono">{vitalValue}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.medicationStatus === 'ทานยาครบ' ? 'bg-risk-green-bg text-risk-green' : 'bg-risk-yellow-bg text-risk-yellow'}`}>
                        {p.medicationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                    <td className="px-4 py-3"><CaseStatusBadge status={p.caseStatus} /></td>
                    <td className="px-4 py-3 text-xs">{p.assignedNurse}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="rounded p-1.5 hover:bg-muted" title="ดูเคส"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => openModal('call', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="โทรกลับ"><Phone className="h-4 w-4" /></button>
                        <button onClick={() => openModal('referDoctor', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="ส่งแพทย์"><Stethoscope className="h-4 w-4" /></button>
                        <button onClick={() => openModal('referPharmacist', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="ส่งเภสัชกร"><Pill className="h-4 w-4" /></button>
                        <button onClick={() => openModal('family', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="แจ้งญาติ"><Heart className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Modals />
    </div>
  );
}
