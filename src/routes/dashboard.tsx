import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ComponentType } from "react";
import { useSyncExternalStore } from "react";
import { useAuth } from "@/lib/auth-context";
import { mockStore } from "@/lib/mock-store";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { APP_VERSION } from "@/lib/patch-log";
import { activityTimeline, carePlanTemplates } from "@/lib/mock-data";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle,
  HeartPulse,
  MessageSquare,
  PhoneCall,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const roleHeadlines = {
  admin: "ภาพรวมระบบ AI Care Follow-up",
  nurse: "คิวติดตามผู้ป่วยวันนี้",
  doctor: "เคสเร่งด่วนและเคสส่งต่อแพทย์",
  pharmacist: "คิวตรวจสอบปัญหาการใช้ยา",
  callcenter: "คิวโทรติดตามและนัดหมาย",
};

function DashboardPage() {
  const { userName, role } = useAuth();
  const navigate = useNavigate();
  const patients = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getPatients,
    mockStore.getPatients,
  );
  const alerts = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getAlerts,
    mockStore.getAlerts,
  );
  const followUps = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getFollowUps,
    mockStore.getFollowUps,
  );

  const total = patients.length;
  const green = patients.filter((p) => p.riskLevel === "green").length;
  const yellow = patients.filter((p) => p.riskLevel === "yellow").length;
  const red = patients.filter((p) => p.riskLevel === "red").length;
  const callback = patients.filter((p) => p.caseStatus === "callback").length;
  const noAnswer = followUps.filter((f) => f.callStatus === "no_answer").length;
  const doctorQueue = patients.filter((p) => p.caseStatus === "referred_doctor").length;
  const pharmacistQueue = patients.filter((p) => p.caseStatus === "referred_pharmacist").length;
  const aiSuccessToday = followUps.filter((f) => f.callStatus === "completed").length;

  const priorityQueue = [...patients]
    .filter((p) => {
      if (role === "doctor") return p.riskLevel === "red" || p.caseStatus === "referred_doctor";
      if (role === "pharmacist") {
        return p.caseStatus === "referred_pharmacist" || p.pharmacistStatus.includes("รอ");
      }
      if (role === "callcenter")
        return p.caseStatus === "callback" || p.appointmentStatus !== "ไม่มีนัด";
      return p.riskLevel === "red" || p.riskLevel === "yellow";
    })
    .sort((a, b) => riskWeight(b.riskLevel) - riskWeight(a.riskLevel))
    .slice(0, 6);

  const activeAlerts = alerts.filter((alert) => !alert.acknowledged).slice(0, 4);
  const activePlans = carePlanTemplates.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary px-3 py-1 text-xs font-bold text-primary">
              <Activity className="h-3.5 w-3.5" />
              CareGo Command Center {APP_VERSION}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {roleHeadlines[role]}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                ศูนย์บัญชาการสำหรับติดตามผู้ป่วยหลังจำหน่ายและโรคเรื้อรัง จัดลำดับความเสี่ยงจาก AI
                และส่งต่อให้ทีมโรงพยาบาลดำเนินการ
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-secondary/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground">
                AI Call Success
              </p>
              <p className="mt-2 text-3xl font-bold text-primary">92%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                สำเร็จ {aiSuccessToday} รายการวันนี้
              </p>
            </div>
            <div className="rounded-lg border bg-[#1e333c] p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.05em] text-white/60">
                Avg Response
              </p>
              <p className="mt-2 text-3xl font-bold text-inverse-primary">18 นาที</p>
              <p className="mt-1 text-xs text-white/60">เป้าหมาย Red ภายใน 30 นาที</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="ผู้ป่วยทั้งหมด"
          value={total}
          trend="กำลังติดตาม"
          icon={Users}
          variant="teal"
          onClick={() => navigate({ to: "/patients" })}
        />
        <StatCard
          title="เขียว · ปกติ"
          value={green}
          trend="ติดตามตามรอบ"
          icon={ShieldCheck}
          variant="green"
          onClick={() => navigate({ to: "/patients" })}
        />
        <StatCard
          title="เหลือง · ต้องติดตาม"
          value={yellow}
          trend="เข้าคิวพยาบาล"
          icon={AlertTriangle}
          variant="yellow"
          onClick={() => navigate({ to: "/patients" })}
        />
        <StatCard
          title="แดง · เร่งด่วน"
          value={red}
          trend="ต้อง human review"
          icon={ShieldAlert}
          variant="red"
          onClick={() => navigate({ to: "/patients" })}
        />
        <StatCard
          title="รอโทรกลับ"
          value={callback + noAnswer}
          trend="Callback / no answer"
          icon={PhoneCall}
          variant="default"
          onClick={() => navigate({ to: "/ai-followup" })}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-lg font-semibold">Priority Risk Queue</h2>
              <p className="text-sm text-muted-foreground">เคสที่ควรเห็นก่อนตามบทบาทปัจจุบัน</p>
            </div>
            <button onClick={() => navigate({ to: "/patients" })} className="action-btn">
              ดูทั้งหมด
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y">
            {priorityQueue.map((patient) => (
              <button
                key={patient.id}
                onClick={() =>
                  navigate({ to: "/patients/$patientId", params: { patientId: patient.id } })
                }
                className={`grid w-full gap-4 border-l-4 p-5 text-left transition-colors hover:bg-secondary/40 md:grid-cols-[1fr_160px_140px] ${riskBorder(patient.riskLevel)}`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{patient.name}</p>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-primary">
                      {patient.hn}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {patient.carePlan} · {patient.department}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6">
                    {patient.redFlagReason || patient.yellowFlagReason || patient.riskReason}
                  </p>
                </div>
                <div className="space-y-2">
                  <RiskBadge level={patient.riskLevel} />
                  <div className="text-xs text-muted-foreground">
                    BP {patient.latestBP} · ยา {patient.medicationAdherence}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 md:block md:text-right">
                  <CaseStatusBadge status={patient.caseStatus} />
                  <p className="mt-2 text-xs text-muted-foreground">{patient.assignedNurse}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-risk-red/30 bg-risk-red-bg">
            <div className="flex items-center justify-between border-b border-risk-red/20 p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-risk-red">
                <AlertTriangle className="h-5 w-5" />
                Red / Human Review
              </h2>
              <span className="rounded-full bg-risk-red px-2.5 py-1 text-xs font-bold text-white">
                {activeAlerts.length} ใหม่
              </span>
            </div>
            <div className="space-y-3 p-4">
              {activeAlerts.length === 0 ? (
                <div className="rounded-lg bg-card p-4 text-center text-sm text-muted-foreground">
                  ไม่มีการแจ้งเตือนเร่งด่วน
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-risk-red">{alert.patientName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                      <button
                        onClick={() =>
                          navigate({
                            to: "/patients/$patientId",
                            params: { patientId: alert.patientId },
                          })
                        }
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                      >
                        เปิดเคส
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        mockStore.acknowledgeAlert(alert.id, userName);
                        toast.success("รับทราบการแจ้งเตือนแล้ว");
                      }}
                      className="mt-3 text-xs font-semibold text-primary hover:underline"
                    >
                      รับทราบการแจ้งเตือน
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="text-lg font-semibold">Role Focus</h2>
            <div className="mt-4 grid gap-3">
              <MiniMetric icon={Stethoscope} label="รอแพทย์ตรวจ" value={doctorQueue} />
              <MiniMetric icon={Pill} label="รอเภสัชกรตรวจ" value={pharmacistQueue} />
              <MiniMetric
                icon={CalendarClock}
                label="นัดหมายที่ต้องตาม"
                value={patients.filter((p) => p.appointmentStatus.includes("ขาด")).length}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border bg-card xl:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-lg font-semibold">AI Follow-up Activity</h2>
            <button
              onClick={() => navigate({ to: "/ai-followup" })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              ดูผลติดตาม AI
            </button>
          </div>
          <div className="divide-y">
            {activityTimeline.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  navigate({ to: "/patients/$patientId", params: { patientId: item.patientId } })
                }
                className="grid w-full gap-4 p-4 text-left transition-colors hover:bg-secondary/40 md:grid-cols-[72px_1fr_120px]"
              >
                <span className="text-sm font-semibold text-primary">{item.time}</span>
                <div className="min-w-0">
                  <p className="font-semibold">{item.patientName}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.action}</p>
                </div>
                <div className="flex items-center gap-2 md:justify-end">
                  <RiskBadge level={item.riskLevel} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI Agent Status</h2>
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 space-y-3">
            <AgentRow icon={PhoneCall} label="Voicebot" value="Online" detail="42 active calls" />
            <AgentRow
              icon={MessageSquare}
              label="LINE/Web Chat"
              value="Online"
              detail="156 active chats"
            />
            <AgentRow
              icon={HeartPulse}
              label="Risk Classifier"
              value="Review-safe"
              detail="Red requires human review"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">Care Plan Summary</h2>
          <p className="text-sm text-muted-foreground">
            เทมเพลตติดตามที่ใช้ใน prototype และพร้อมต่อยอด API
          </p>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
          {activePlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => navigate({ to: "/care-plans" })}
              className="rounded-lg border bg-secondary/30 p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="mt-2 text-2xl font-bold text-primary">{plan.activePatients}</p>
              <p className="text-xs text-muted-foreground">ผู้ป่วยที่ใช้งาน</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-risk-green" />
                {plan.followUpSchedule}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function riskWeight(level: string) {
  return level === "red" ? 3 : level === "yellow" ? 2 : 1;
}

function riskBorder(level: string) {
  if (level === "red") return "border-l-risk-red";
  if (level === "yellow") return "border-l-risk-yellow";
  return "border-l-risk-green";
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-secondary/40 p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold text-primary">{value}</span>
    </div>
  );
}

function AgentRow({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
      <span className="rounded-full bg-risk-green-bg px-2 py-1 text-xs font-bold text-risk-green">
        {value}
      </span>
    </div>
  );
}
