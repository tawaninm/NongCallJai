import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { patients, caseStatusLabels } from '@/lib/mock-data';
import type { CaseStatus } from '@/lib/mock-data';
import { RiskBadge } from '@/components/RiskBadge';
import { useState } from 'react';
import { toast } from 'sonner';
import { GripVertical } from 'lucide-react';

export const Route = createFileRoute('/cases')({
  component: CaseManagementPage,
});

const columns: CaseStatus[] = ['pending', 'contacted', 'callback', 'referred_doctor', 'referred_pharmacist', 'family_notified', 'escalated', 'closed'];

function CaseManagementPage() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(patients);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">จัดการเคส</h1>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => {
          const items = patientData.filter(p => p.caseStatus === col);
          return (
            <div key={col} className="kanban-column">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{caseStatusLabels[col]}</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map(p => (
                  <div
                    key={p.id}
                    className="kanban-card"
                    onClick={() => navigate({ to: '/patients/$patientId', params: { patientId: p.id } })}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{p.name}</span>
                      <RiskBadge level={p.riskLevel} showLabel={false} />
                    </div>
                    <p className="text-xs text-muted-foreground">{p.hn}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.symptomSummary}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{p.assignedNurse}</span>
                      <span>{p.lastContact.split(' ')[1]}</span>
                    </div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed p-4 text-center text-xs text-muted-foreground">
                    ไม่มีรายการ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
