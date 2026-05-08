import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { carePlanTemplates } from '@/lib/mock-data';
import { useSyncExternalStore, useState } from 'react';
import { mockStore } from '@/lib/mock-store';
import { toast } from 'sonner';
import { Plus, Edit, Copy, Eye, ChevronDown, ChevronUp, Mic } from 'lucide-react';

export const Route = createFileRoute('/care-plans')({
  component: CarePlansPage,
});

function CarePlansPage() {
  const navigate = useNavigate();
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients, mockStore.getPatients);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แผนการดูแล</h1>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> สร้างแผนใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {carePlanTemplates.map(cp => {
          const cpPatients = patients.filter(p => p.carePlanType === cp.type);
          const expanded = expandedId === cp.id;
          return (
            <div key={cp.id} className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{cp.icon}</span>
                  <div>
                    <h3 className="text-base font-semibold">{cp.name}</h3>
                    <p className="text-xs text-muted-foreground">{cp.nameEn}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold">{cpPatients.length}</p>
                    <p className="text-muted-foreground">ผู้ป่วย</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold">{cp.questions.length}</p>
                    <p className="text-muted-foreground">คำถาม</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-lg font-bold text-risk-red">{cp.redFlags.length}</p>
                    <p className="text-muted-foreground">Red Flag</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2 text-center">
                    <p className="text-muted-foreground">{cp.followUpSchedule}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExpandedId(expanded ? null : cp.id)} className="flex-1 rounded-lg border px-3 py-1.5 text-xs hover:bg-muted flex items-center justify-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {expanded ? 'ซ่อน' : 'ดูรายละเอียด'}
                  </button>
                  <button onClick={() => toast.info('แก้ไขแผน')} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                  <button onClick={() => toast.info('คัดลอกแผน')} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-muted"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {expanded && (
                <div className="border-t p-5 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">คำถามที่ถาม</h4>
                    <ul className="space-y-1">
                      {cp.questions.map((q, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-light text-xs font-medium text-teal">{i + 1}</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div>
                      <h4 className="text-sm font-semibold text-risk-red mb-1">🔴 Red Flag</h4>
                      <ul className="space-y-0.5">{cp.redFlags.map((f, i) => <li key={i} className="text-xs text-muted-foreground">• {f}</li>)}</ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-risk-yellow mb-1">🟡 Yellow Flag</h4>
                      <ul className="space-y-0.5">{cp.yellowFlags.map((f, i) => <li key={i} className="text-xs text-muted-foreground">• {f}</li>)}</ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-risk-green mb-1">🟢 Green Criteria</h4>
                      <ul className="space-y-0.5">{cp.greenCriteria.map((f, i) => <li key={i} className="text-xs text-muted-foreground">• {f}</li>)}</ul>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">การแจ้งญาติ:</span> {cp.familyNotification}</p>
                    <p><span className="text-muted-foreground">กฎส่งต่อ:</span> {cp.handoffRule}</p>
                  </div>
                  <div className="rounded-lg bg-teal-light p-3">
                    <p className="text-xs font-semibold flex items-center gap-1 mb-1"><Mic className="h-3.5 w-3.5" /> AI Voice Script Preview</p>
                    <p className="text-xs text-muted-foreground italic">{cp.voiceScript}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
