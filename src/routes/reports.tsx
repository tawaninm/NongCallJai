import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
});

const colors = ["#2563eb", "#7c3aed", "#ec5cff", "#00897b"];

function ReportsPage() {
  const calls = voiceMedStore.getCallLogs();
  const alerts = voiceMedStore.getFamilyAlerts();
  const elders = voiceMedStore.getElderProfiles();
  const completed = calls.filter((call) => call.status === "completed").length;
  const missed = calls.filter((call) => call.status === "missed").length;

  const callTrend = [
    { day: "จ.", calls: 4, success: 3 },
    { day: "อ.", calls: 5, success: 4 },
    { day: "พ.", calls: 5, success: 5 },
    { day: "พฤ.", calls: 6, success: 5 },
    { day: "ศ.", calls: 4, success: 3 },
  ];
  const moodData = [
    { name: "ดี", value: calls.filter((call) => call.mood === "good").length },
    { name: "ปกติ", value: calls.filter((call) => call.mood === "neutral").length },
    { name: "เหงา", value: calls.filter((call) => call.mood === "lonely").length },
    { name: "กังวล", value: calls.filter((call) => call.mood === "concerned").length },
  ];
  const alertData = [
    { name: "info", count: alerts.filter((alert) => alert.severity === "info").length },
    { name: "watch", count: alerts.filter((alert) => alert.severity === "watch").length },
    { name: "urgent", count: alerts.filter((alert) => alert.severity === "urgent").length },
  ];
  const elderActivity = elders.map((elder) => ({
    name: elder.nickname ?? elder.name,
    calls: calls.filter((call) => call.elderProfileId === elder.id).length,
  }));

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="vm-pill">
              <MascotIcon variant="report" size="1.1rem" />
              Family Reports
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">รายงานภาพรวมการดูแล</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
              แสดงแนวโน้มการโทร mood signal alert และการใช้งาน subscription จาก mock data
            </p>
          </div>
          <button onClick={() => toast.info("สร้างรายงาน PDF แบบ mock")} className="vm-primary-btn">
            <MascotIcon variant="download" size="1.2rem" />
            Export report
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="โทรสำเร็จ" value={completed} />
        <Stat label="โทรไม่รับ" value={missed} />
        <Stat label="แจ้งเตือนทั้งหมด" value={alerts.length} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="แนวโน้มการโทรสำเร็จ">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={callTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#7c3aed" strokeWidth={3} />
              <Line type="monotone" dataKey="success" stroke="#00897b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Mood signal">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={moodData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                label
              >
                {moodData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Alert breakdown">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={alertData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ec5cff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="กิจกรรมรายโปรไฟล์">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={elderActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={90} />
              <Tooltip />
              <Bar dataKey="calls" fill="#2563eb" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[2rem] vm-glass-soft p-5">
      <p className="text-4xl font-extrabold">{value}</p>
      <p className="mt-1 text-sm font-bold text-muted-foreground">{label}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] vm-glass p-5">
      <h2 className="mb-4 text-xl font-extrabold">{title}</h2>
      {children}
    </div>
  );
}
