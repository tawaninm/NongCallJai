import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { mockStore } from "@/lib/mock-store";
import { BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

const COLORS_RISK = ["#4CAF50", "#FFC107", "#F44336"];
const COLORS_DISEASE = ["#00897B", "#42A5F5", "#AB47BC", "#FF7043", "#66BB6A"];

function ReportsPage() {
  const patients = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getPatients,
    mockStore.getPatients,
  );

  // Risk distribution
  const riskData = [
    { name: "เขียว · ปกติ", value: patients.filter((p) => p.riskLevel === "green").length },
    { name: "เหลือง · ติดตาม", value: patients.filter((p) => p.riskLevel === "yellow").length },
    { name: "แดง · เร่งด่วน", value: patients.filter((p) => p.riskLevel === "red").length },
  ];

  // Disease distribution
  const diseaseData = [
    { name: "ความดัน", count: patients.filter((p) => p.carePlanType === "hypertension").length },
    { name: "เบาหวาน", count: patients.filter((p) => p.carePlanType === "diabetes").length },
    { name: "หัวใจ", count: patients.filter((p) => p.carePlanType === "heart_failure").length },
    { name: "หลังผ่าตัด", count: patients.filter((p) => p.carePlanType === "post_op").length },
    { name: "ยา", count: patients.filter((p) => p.carePlanType === "medication_adherence").length },
  ];

  // Case status
  const statusData = [
    { name: "รอติดตาม", count: patients.filter((p) => p.caseStatus === "pending").length },
    { name: "ติดต่อแล้ว", count: patients.filter((p) => p.caseStatus === "contacted").length },
    { name: "รอโทรกลับ", count: patients.filter((p) => p.caseStatus === "callback").length },
    {
      name: "ส่งแพทย์",
      count: patients.filter(
        (p) => p.caseStatus === "referred_doctor" || p.caseStatus === "escalated",
      ).length,
    },
    { name: "ปิดเคส", count: patients.filter((p) => p.caseStatus === "closed").length },
  ];

  // AI call success trend (mock weekly)
  const aiTrend = [
    { week: "สัปดาห์ 1", success: 18, failed: 3 },
    { week: "สัปดาห์ 2", success: 22, failed: 2 },
    { week: "สัปดาห์ 3", success: 20, failed: 4 },
    { week: "สัปดาห์ 4", success: 25, failed: 1 },
  ];

  // Medication issues
  const medData = [
    { name: "ทานยาครบ", count: patients.filter((p) => p.medicationStatus === "ทานยาครบ").length },
    {
      name: "ลืมบางมื้อ",
      count: patients.filter((p) => p.medicationStatus === "ลืมยาบางมื้อ").length,
    },
    { name: "หยุดยาเอง", count: patients.filter((p) => p.medicationStatus === "หยุดยาเอง").length },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> รายงาน
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => toast.info("กำลังสร้างไฟล์ PDF...")}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button
            onClick={() => toast.info("กำลังสร้างไฟล์ CSV...")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Risk Distribution */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">การกระจายระดับความเสี่ยง</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskData.map((_, i) => (
                  <Cell key={i} fill={COLORS_RISK[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Disease Distribution */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">การกระจายตามโรค</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={diseaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#00897B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Case Status */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">สถานะเคส</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#42A5F5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Call Success Trend */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">แนวโน้ม AI โทรสำเร็จ</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#4CAF50"
                strokeWidth={2}
                name="สำเร็จ"
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="#F44336"
                strokeWidth={2}
                name="ไม่สำเร็จ"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Medication Issues */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">ปัญหาการใช้ยา</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={medData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#FFC107" />
                <Cell fill="#F44336" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Staff Workload */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="section-title">ภาระงานพยาบาล</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[...new Set(patients.map((p) => p.assignedNurse))].map((n) => ({
                name: n,
                cases: patients.filter((p) => p.assignedNurse === n).length,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cases" fill="#AB47BC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
