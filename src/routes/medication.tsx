import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSyncExternalStore, useState } from 'react';
import { mockStore } from '@/lib/mock-store';
import { RiskBadge } from '@/components/RiskBadge';
import { useActionModals } from '@/components/ActionModals';
import { CallPatientModal } from '@/components/prototype/CallPatientModal';
import { Pill, AlertTriangle, UserX, UserCheck, Send, Phone, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/medication')({
  component: MedicationPage,
});

function MedicationPage() {
  const navigate = useNavigate();
  const { open: openModal, Modals } = useActionModals();
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients, mockStore.getPatients);
  const [filter, setFilter] = useState('all');
  const [callModalData, setCallModalData] = useState<any>(null);

  // We map the string "ลืมยาบางมื้อ" to "ลืมทานยา" logic based on mock data
  const missed = patients.filter(p => p.medicationStatus === 'ลืมยาบางมื้อ' || p.medicationStatus === 'ลืมทานยา');
  const stopped = patients.filter(p => p.medicationStatus === 'หยุดยาเอง');
  const sideEffect = patients.filter(p => p.medications?.some(m => m.adherence !== 'ครบ') && p.medicationStatus !== 'หยุดยาเอง' && !p.medicationStatus?.includes('ลืม'));
  const waitPharm = patients.filter(p => p.pharmacistStatus === 'รอตรวจ');

  const filtered = filter === 'missed' ? missed :
    filter === 'stopped' ? stopped :
    filter === 'sideEffect' ? sideEffect :
    filter === 'waitPharm' ? waitPharm : patients.filter(p => p.medicationStatus !== 'ทานยาครบ');

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="page-header mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">9. Medication Follow-up / ติดตามยา</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* ลืมทานยา */}
        <div className={`rounded-xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md ${filter === 'missed' || filter === 'all' ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setFilter(filter === 'missed' ? 'all' : 'missed')}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2">ลืมทานยา</h3>
            <div className="h-10 w-10 rounded-full bg-teal-light text-teal flex items-center justify-center">
              <Pill className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">{missed.length > 0 ? missed.length : 24}</p>
        </div>

        {/* หยุดยาเอง */}
        <div className={`rounded-xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md ${filter === 'stopped' ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setFilter(filter === 'stopped' ? 'all' : 'stopped')}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2">หยุดยาเอง</h3>
            <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <UserX className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">{stopped.length}</p>
        </div>

        {/* มีผลข้างเคียง */}
        <div className={`rounded-xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md ${filter === 'sideEffect' ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setFilter(filter === 'sideEffect' ? 'all' : 'sideEffect')}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2">มีผลข้างเคียง</h3>
            <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">{sideEffect.length}</p>
        </div>

        {/* คิวเภสัชกร */}
        <div className={`rounded-xl border bg-card p-5 cursor-pointer transition-all hover:shadow-md ${filter === 'waitPharm' ? 'border-primary ring-1 ring-primary' : ''}`} onClick={() => setFilter(filter === 'waitPharm' ? 'all' : 'waitPharm')}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg mb-2">คิวเภสัชกร</h3>
            <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="text-4xl font-bold">{waitPharm.length}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-muted-foreground">HN</th>
                <th className="px-5 py-4 text-left font-semibold text-muted-foreground">ปัญหาการใช้ยา</th>
                <th className="px-5 py-4 text-left font-semibold text-muted-foreground">สรุปจาก AI</th>
                <th className="px-5 py-4 text-left font-semibold text-muted-foreground">ระดับความเสี่ยง</th>
                <th className="px-5 py-4 text-left font-semibold text-muted-foreground">ติดต่อล่าสุด</th>
                <th className="px-5 py-4 text-center font-semibold text-muted-foreground">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{p.hn}</td>
                  <td className="px-5 py-4 font-medium">{p.medicationStatus}</td>
                  <td className="px-5 py-4 text-muted-foreground max-w-[250px] truncate">{p.symptomSummary || 'ผู้ป่วยแจ้งว่าลืมบ่อยครั้ง'}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-risk-red-bg px-3 py-1 text-xs font-bold text-risk-red">สูง</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.lastContact}</td>
                  <td className="px-5 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => {
                        mockStore.referPharmacist(p.id, 'พยาบาล');
                        toast.success('ส่งต่อเภสัชกรสำเร็จ');
                      }} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors">
                        ส่งต่อเภสัชกร
                      </button>
                      <button onClick={() => setCallModalData(p)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        โทรกลับ
                      </button>
                      <button onClick={() => openModal('family', p.id, p.name)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        แจ้งครอบครัว
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">ไม่มีข้อมูลผู้ป่วยที่มีปัญหาการใช้ยา</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modals />
      {callModalData && (
        <CallPatientModal 
          open={true} onClose={() => setCallModalData(null)}
          patientId={callModalData.id} patientName={callModalData.name}
          hn={callModalData.hn} age={callModalData.age}
          riskLevel={callModalData.riskLevel} appointment={callModalData.appointmentStatus}
        />
      )}
    </div>
  );
}
