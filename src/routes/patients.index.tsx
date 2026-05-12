import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useSyncExternalStore } from "react";
import { mockStore } from "@/lib/mock-store";
import { carePlanTemplates } from "@/lib/mock-data";
import type { RiskLevel, CaseStatus, CarePlanType, Patient } from "@/lib/mock-data";
import { RiskBadge } from "@/components/RiskBadge";
import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { Search, Eye, Phone, UserPlus, Pill, Heart, Stethoscope, Filter } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useActionModals } from "@/components/ActionModals";
import { CallPatientModal } from "@/components/prototype/CallPatientModal";

export const Route = createFileRoute("/patients/")({
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { open: openModal, Modals } = useActionModals();
  const patients = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getPatients,
    mockStore.getPatients,
  );

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [diseaseFilter, setDiseaseFilter] = useState<CarePlanType | "all">("all");

  const [callModalData, setCallModalData] = useState<Patient | null>(null);

  const departments = [...new Set(patients.map((p) => p.department))];

  let filteredPatients = patients;
  if (role === "doctor") {
    filteredPatients = filteredPatients.filter(
      (p) =>
        p.riskLevel === "red" ||
        p.riskLevel === "yellow" ||
        p.caseStatus === "referred_doctor" ||
        p.caseStatus === "escalated",
    );
  }

  const filtered = filteredPatients.filter((p) => {
    if (
      search &&
      !p.name.includes(search) &&
      !p.hn.includes(search) &&
      !p.phone.includes(search) &&
      !p.symptomSummary.includes(search)
    )
      return false;
    if (riskFilter !== "all" && p.riskLevel !== riskFilter) return false;
    if (deptFilter !== "all" && p.department !== deptFilter) return false;
    if (statusFilter !== "all" && p.caseStatus !== statusFilter) return false;
    if (diseaseFilter !== "all" && p.carePlanType !== diseaseFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">คิวผู้ป่วย</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} รายการ จากทั้งหมด {patients.length} รายการ
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/register" })}
          className="action-btn action-btn-primary whitespace-nowrap self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" /> เพิ่มผู้ป่วยใหม่
        </button>
      </div>

      <div className="filter-bar">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหา HN / ชื่อ / เบอร์โทร / อาการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 border-l-0 sm:border-l pl-0 sm:pl-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "all")}
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none flex-1 min-w-[140px]"
          >
            <option value="all">ทุกระดับความเสี่ยง</option>
            <option value="green">🟢 ปกติ (Green)</option>
            <option value="yellow">🟡 ต้องติดตาม (Yellow)</option>
            <option value="red">🔴 เร่งด่วน (Red)</option>
          </select>
          <select
            value={diseaseFilter}
            onChange={(e) => setDiseaseFilter(e.target.value as CarePlanType | "all")}
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none flex-1 min-w-[140px]"
          >
            <option value="all">ทุกโรค</option>
            <option value="hypertension">🫀 ความดันโลหิตสูง</option>
            <option value="diabetes">🩸 เบาหวานชนิดที่ 2</option>
            <option value="heart_failure">❤️‍🩹 ภาวะหัวใจล้มเหลว</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "all")}
            className="rounded-lg border bg-background px-3 py-2 text-sm outline-none flex-1 min-w-[140px]"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รอติดตาม</option>
            <option value="callback">รอโทรกลับ</option>
            <option value="nurse_review">รอพยาบาลตรวจ</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 font-semibold text-muted-foreground">HN / ผู้ป่วย</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">อายุ/เพศ</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">โรค / Care Plan</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground max-w-[200px]">
                  อาการล่าสุด
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">ความเสี่ยง</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 font-semibold text-muted-foreground text-right">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    navigate({ to: "/patients/$patientId", params: { patientId: p.id } })
                  }
                  className={`hover:bg-muted/30 transition-colors cursor-pointer border-l-4 ${p.riskLevel === "red" ? "border-l-risk-red" : p.riskLevel === "yellow" ? "border-l-risk-yellow" : "border-l-risk-green"}`}
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.hn} • {p.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    {p.age} / {p.gender.charAt(0)}
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <span className="rounded bg-muted px-2 py-1">{p.carePlan}</span>
                  </td>
                  <td className="px-4 py-4 text-xs max-w-[200px] truncate" title={p.symptomSummary}>
                    {p.symptomSummary}
                  </td>
                  <td className="px-4 py-4">
                    <RiskBadge level={p.riskLevel} />
                  </td>
                  <td className="px-4 py-4">
                    <CaseStatusBadge status={p.caseStatus} />
                  </td>
                  <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          navigate({ to: "/patients/$patientId", params: { patientId: p.id } })
                        }
                        className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                        title="ดูเคส"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCallModalData(p)}
                        className="rounded-lg p-2 hover:bg-teal-light/50 text-teal transition-colors"
                        title="โทรกลับ"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal("referDoctor", p.id, p.name)}
                        className="rounded-lg p-2 hover:bg-blue-50 text-blue-600 transition-colors"
                        title="ส่งแพทย์"
                      >
                        <Stethoscope className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal("family", p.id, p.name)}
                        className="rounded-lg p-2 hover:bg-pink-50 text-pink-600 transition-colors"
                        title="แจ้งญาติ"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    ไม่พบผู้ป่วยที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modals />
      {callModalData && (
        <CallPatientModal
          open={true}
          onClose={() => setCallModalData(null)}
          patientId={callModalData.id}
          patientName={callModalData.name}
          hn={callModalData.hn}
          age={callModalData.age}
          riskLevel={callModalData.riskLevel}
          appointment={callModalData.appointmentStatus}
        />
      )}
    </div>
  );
}
