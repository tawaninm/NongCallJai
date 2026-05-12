import type { CaseStatus } from "@/lib/mock-data";
import { caseStatusLabels } from "@/lib/mock-data";

const styles: Record<CaseStatus, string> = {
  pending: "bg-muted text-muted-foreground",
  contacted: "bg-teal-light text-teal",
  callback: "bg-risk-yellow-bg text-risk-yellow",
  nurse_review: "bg-risk-yellow-bg text-risk-yellow",
  referred_doctor: "bg-risk-red-bg text-risk-red",
  referred_pharmacist: "bg-accent text-accent-foreground",
  family_notified: "bg-teal-light text-teal",
  escalated: "bg-risk-red-bg text-risk-red",
  closed: "bg-muted text-muted-foreground",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      {caseStatusLabels[status]}
    </span>
  );
}
