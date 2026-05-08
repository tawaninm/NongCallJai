import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSyncExternalStore, useState } from 'react';
import { mockStore } from '@/lib/mock-store';
import { familyMessageTemplates } from '@/lib/mock-data';
import { toast } from 'sonner';
import { Send, MessageSquare, Phone, Eye, Clock, User, Heart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const Route = createFileRoute('/family')({
  component: FamilyNotificationPage,
});

function FamilyNotificationPage() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients);
  const notifications = useSyncExternalStore(mockStore.subscribe, mockStore.getNotificationLog);
  const [selectedTemplate, setSelectedTemplate] = useState(familyMessageTemplates[0]);

  // Patients with caregivers
  const caregivers = patients.filter(p => p.primaryCaregiver);

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="page-header mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" /> ศูนย์แจ้งเตือนญาติ (Family Notification)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">จัดการการแจ้งเตือนญาติและผู้ดูแลผู้ป่วย</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Templates */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4"><MessageSquare className="h-4 w-4 text-primary" /> เทมเพลตข้อความ (LINE)</h2>
            <div className="space-y-2 mb-4">
              {familyMessageTemplates.map(t => (
                <button 
                  key={t.id} onClick={() => setSelectedTemplate(t)}
                  className={`w-full text-left rounded-lg border p-3 text-sm transition-all ${selectedTemplate.id === t.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}`}
                >
                  <p className="font-semibold mb-1">{t.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.message}</p>
                </button>
              ))}
            </div>
            
            <div className="rounded-lg bg-[#00B900]/10 border border-[#00B900]/20 p-4 relative">
              <p className="text-[10px] font-bold text-[#00B900] mb-2 uppercase tracking-wider">LINE Preview</p>
              <p className="text-sm">{selectedTemplate.message}</p>
              <div className="absolute right-4 top-4 opacity-10">
                <MessageSquare className="h-12 w-12 text-[#00B900]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
             <h2 className="text-sm font-bold flex items-center gap-2 mb-4"><Clock className="h-4 w-4 text-primary" /> ประวัติการส่งล่าสุด</h2>
             <div className="space-y-3">
               {notifications.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">ไม่มีประวัติการส่ง</p>}
               {notifications.slice(0, 5).map(n => (
                 <div key={n.id} className="border-b last:border-0 pb-3 last:pb-0">
                   <div className="flex justify-between items-start mb-1">
                     <span className="text-sm font-semibold text-[#00B900]">{n.caregiverName}</span>
                     <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                   </div>
                   <p className="text-xs text-muted-foreground mb-1">ผู้ป่วย: {n.patientName}</p>
                   <p className="text-xs line-clamp-1 border-l-2 pl-2 text-muted-foreground">{n.message}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Caregivers */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caregivers.map(p => (
              <div key={p.id} className="rounded-xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {p.primaryCaregiver?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{p.primaryCaregiver}</h3>
                      <p className="text-xs text-muted-foreground">{p.caregiverPhone} • {p.familyConsentLevel}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="rounded-lg bg-muted/40 p-3 mb-4 text-sm flex gap-2">
                  <User className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.carePlan} • สิทธิ์: {p.consentStatus}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => {
                    mockStore.notifyFamily(p.id, selectedTemplate.message, selectedTemplate.name, userName);
                    toast.success(`ส่ง LINE ถึง ${p.primaryCaregiver} สำเร็จ`);
                  }} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#00B900] text-white py-2 text-sm font-medium hover:bg-[#00B900]/90">
                    <Send className="h-4 w-4" /> ส่ง LINE
                  </button>
                  <button onClick={() => {
                    toast.info(`กำลังโทรหา ${p.primaryCaregiver}`);
                  }} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border py-2 text-sm font-medium hover:bg-muted">
                    <Phone className="h-4 w-4" /> โทร
                  </button>
                </div>
              </div>
            ))}
            {caregivers.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground border rounded-xl border-dashed">
                ไม่มีรายชื่อผู้ดูแล
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
