import { createFileRoute } from '@tanstack/react-router';
import { carePlanTemplates } from '@/lib/mock-data';
import { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export const Route = createFileRoute('/care-plans')({
  component: CarePlansPage,
});

function CarePlansPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">แผนการดูแล</h1>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> สร้างแผนใหม่
        </button>
      </div>

      <div className="space-y-4">
        {carePlanTemplates.map(cp => {
          const expanded = expandedId === cp.id;
          return (
            <div key={cp.id} className="rounded-xl border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedId(expanded ? null : cp.id)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <div>
                  <h3 className="text-base font-semibold">{cp.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{cp.patientGroup} — ติดตาม {cp.followUpSchedule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded p-1.5 hover:bg-muted" onClick={e => e.stopPropagation()}><Edit className="h-4 w-4 text-muted-foreground" /></button>
                  <button className="rounded p-1.5 hover:bg-muted" onClick={e => e.stopPropagation()}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
                  {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </button>
              {expanded && (
                <div className="border-t p-5 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-risk-red mb-1">🔴 สัญญาณอันตราย (Red Flag)</h4>
                        <ul className="space-y-0.5">
                          {cp.redFlags.map((f, i) => <li key={i} className="text-sm text-muted-foreground">• {f}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-risk-yellow mb-1">🟡 สัญญาณเตือน (Yellow Flag)</h4>
                        <ul className="space-y-0.5">
                          {cp.yellowFlags.map((f, i) => <li key={i} className="text-sm text-muted-foreground">• {f}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
                    <div><span className="text-muted-foreground">การแจ้งญาติ:</span> <span className="font-medium">{cp.familyNotification}</span></div>
                    <div><span className="text-muted-foreground">กฎส่งต่อมนุษย์:</span> <span className="font-medium">{cp.handoffRule}</span></div>
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
