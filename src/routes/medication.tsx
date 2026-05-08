import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { patients } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { StatCard } from '@/components/StatCard';
import { useActionModals } from '@/components/ActionModals';
import { Pill, AlertTriangle, Clock, Eye, Phone, Stethoscope } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/medication')({
  component: MedicationPage,
});

function MedicationPage() {
  const navigate = useNavigate();
  const { open: openModal, Modals } = useActionModals();
  const [filter, setFilter] = useState('all');

  const medPatients = patients.filter(p => p.medicationStatus !== 'ทานยาครบ' || p.pharmacistStatus === 'รอตรวจ');
  const missed = patients.filter(p => p.medicationStatus === 'ลืมยาบางมื้อ');
  const stopped = patients.filter(p => p.medicationStatus === 'หยุดยาเอง');
  const sideEffect = patients.filter(p => p.medications.some(m => m.adherence !== 'ครบ'));
  const waitPharm = patients.filter(p => p.pharmacistStatus === 'รอตรวจ');

  const filtered = filter === 'all' ? medPatients :
    filter === 'missed' ? missed :
    filter === 'stopped' ? stopped :
    filter === 'sideEffect' ? sideEffect :
    filter === 'waitPharm' ? waitPharm : medPatients;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><Pill className="h-7 w-7 text-purple-600" /> ติดตามการใช้ยา</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 mb-6">
        <div className="cursor-pointer" onClick={() => setFilter('all')}><StatCard title="มีปัญหาการใช้ยา" value={medPatients.length} icon={Pill} variant={filter === 'all' ? 'teal' : 'default'} /></div>
        <div className="cursor-pointer" onClick={() => setFilter('missed')}><StatCard title="ลืมยา" value={missed.length} icon={Clock} variant={filter === 'missed' ? 'yellow' : 'default'} /></div>
        <div className="cursor-pointer" onClick={() => setFilter('stopped')}><StatCard title="หยุดยาเอง" value={stopped.length} icon={AlertTriangle} variant={filter === 'stopped' ? 'red' : 'default'} /></div>
        <div className="cursor-pointer" onClick={() => setFilter('sideEffect')}><StatCard title="ผลข้างเคียง" value={sideEffect.length} icon={AlertTriangle} variant={filter === 'sideEffect' ? 'yellow' : 'default'} /></div>
        <div className="cursor-pointer" onClick={() => setFilter('waitPharm')}><StatCard title="รอเภสัชกรตรวจ" value={waitPharm.length} icon={Pill} variant={filter === 'waitPharm' ? 'teal' : 'default'} /></div>
      </div>

      {filter !== 'all' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">กรอง: {filter === 'missed' ? 'ลืมยา' : filter === 'stopped' ? 'หยุดยาเอง' : filter === 'sideEffect' ? 'ผลข้างเคียง' : 'รอเภสัชกร'}</span>
          <button onClick={() => setFilter('all')} className="text-xs text-muted-foreground hover:text-foreground">✕ ล้างตัวกรอง</button>
        </div>
      )}

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">HN</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ผู้ป่วย</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">โรค</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ปัญหาการใช้ยา</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ความเสี่ยง</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">สถานะเภสัชกร</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 cursor-pointer" onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}>
                  <td className="px-4 py-3 font-mono text-xs">{p.hn}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-xs">{p.carePlan}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.medicationStatus === 'ทานยาครบ' ? 'bg-risk-green-bg text-risk-green' : 'bg-risk-yellow-bg text-risk-yellow'}`}>{p.medicationStatus}</span>
                  </td>
                  <td className="px-4 py-3"><RiskBadge level={p.riskLevel} /></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.pharmacistStatus === 'รอตรวจ' ? 'text-risk-yellow' : 'text-risk-green'}`}>{p.pharmacistStatus}</span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1">
                      <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="rounded p-1.5 hover:bg-muted" title="ดูเคส"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => openModal('referPharmacist', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="ส่งเภสัชกร"><Pill className="h-4 w-4" /></button>
                      <button onClick={() => openModal('call', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="โทรกลับ"><Phone className="h-4 w-4" /></button>
                      <button onClick={() => openModal('family', p.id, p.name)} className="rounded p-1.5 hover:bg-muted" title="แจ้งญาติ"><Stethoscope className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modals />
    </div>
  );
}
