import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useSyncExternalStore } from 'react';
import { mockStore } from '@/lib/mock-store';
import { caseStatusLabels, type CaseStatus } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { Columns3, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/cases')({
  component: CasesPage,
});

const kanbanColumns: { status: CaseStatus; color: string }[] = [
  { status: 'pending', color: 'border-t-muted-foreground' },
  { status: 'contacted', color: 'border-t-blue-400' },
  { status: 'callback', color: 'border-t-risk-yellow' },
  { status: 'nurse_review', color: 'border-t-teal' },
  { status: 'referred_doctor', color: 'border-t-blue-600' },
  { status: 'referred_pharmacist', color: 'border-t-purple-600' },
  { status: 'family_notified', color: 'border-t-pink-500' },
  { status: 'escalated', color: 'border-t-risk-red' },
  { status: 'closed', color: 'border-t-risk-green' },
];

function CasesPage() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const patients = useSyncExternalStore(mockStore.subscribe, mockStore.getPatients);

  const moveCase = (patientId: string, newStatus: CaseStatus) => {
    mockStore.updatePatientStatus(patientId, newStatus, userName, `ย้ายเป็น ${caseStatusLabels[newStatus]}`);
    toast.success(`ย้ายเป็น "${caseStatusLabels[newStatus]}" แล้ว`);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><Columns3 className="h-7 w-7 text-primary" /> Case Management</h1>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {kanbanColumns.map(col => {
          const cards = patients.filter(p => p.caseStatus === col.status);
          return (
            <div key={col.status} className={`kanban-column border-t-4 ${col.color}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider">{caseStatusLabels[col.status]}</h3>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold px-1">{cards.length}</span>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {cards.map(p => (
                  <div key={p.id} className="kanban-card" onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{p.hn}</span>
                      <RiskBadge level={p.riskLevel} showLabel={false} />
                    </div>
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.carePlan}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{p.symptomSummary}</p>
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <select
                        value={p.caseStatus}
                        onChange={e => moveCase(p.id, e.target.value as CaseStatus)}
                        className="w-full rounded border bg-background px-2 py-1 text-xs"
                      >
                        {kanbanColumns.map(c => <option key={c.status} value={c.status}>{caseStatusLabels[c.status]}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
