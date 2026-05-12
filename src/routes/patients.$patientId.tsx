import { createFileRoute } from "@tanstack/react-router";
import { useSyncExternalStore, useState } from "react";
import { mockStore } from "@/lib/mock-store";
import { useActionModals } from "@/components/ActionModals";
import { CallPatientModal } from "@/components/prototype/CallPatientModal";
import { VitalsMonitorCard } from "@/components/prototype/VitalsMonitorCard";
import { PatientTimeline } from "@/components/prototype/PatientTimeline";
import { RiskBadge } from "@/components/RiskBadge";
import { Phone, Stethoscope, Bell, CheckCircle, Bot } from "lucide-react";

export const Route = createFileRoute("/patients/$patientId")({
  component: PatientDetailPage,
});

type TimelineType = "red" | "teal" | "blue" | "muted";

function PatientDetailPage() {
  const { patientId } = Route.useParams();
  const patients = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getPatients,
    mockStore.getPatients,
  );
  const allActionLogs = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getActionLog,
    mockStore.getActionLog,
  );
  const actionLog = allActionLogs.filter((a) => a.patientId === patientId);
  const patient = patients.find((p) => p.id === patientId);
  const { open, Modals } = useActionModals();
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  if (!patient)
    return <div className="p-8 text-center text-muted-foreground">ไม่พบข้อมูลผู้ป่วย</div>;

  const timelineEntries = actionLog
    .map((a) => ({
      title: a.action,
      description: a.note || `ดำเนินการโดย: ${a.performedBy}`,
      timestamp: a.timestamp,
      type: (a.type === "call"
        ? "blue"
        : a.type === "medical"
          ? "red"
          : "teal") satisfies TimelineType,
    }))
    .concat([
      {
        title: "Initial Admission",
        description: "รับเข้าแผนกอายุรกรรม",
        timestamp: patient.admitDate || "N/A",
        type: "muted" satisfies TimelineType,
      },
    ]);

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      {/* Header matching 5.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
            <RiskBadge level={patient.riskLevel} />
          </div>
          <p className="text-sm text-muted-foreground">
            HN: {patient.hn} • อายุ: {patient.age} ปี • เพศ: {patient.gender}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button
            onClick={() => setCallModalOpen(true)}
            className="action-btn bg-teal-light/50 text-teal hover:bg-teal-light"
          >
            <Phone className="h-4 w-4" /> โทรกลับ
          </button>
          <button
            onClick={() => open("referDoctor", patient.id, patient.name)}
            className="action-btn bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Stethoscope className="h-4 w-4" /> ส่งต่อแพทย์
          </button>
          <button
            onClick={() => open("family", patient.id, patient.name)}
            className="action-btn bg-pink-50 text-pink-600 hover:bg-pink-100"
          >
            <Bell className="h-4 w-4" /> แจ้งครอบครัว
          </button>
          <button
            onClick={() => open("closeCase", patient.id, patient.name)}
            className="action-btn action-btn-primary"
          >
            <CheckCircle className="h-4 w-4" /> ปิดเคส
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-5 border-b flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-teal-light text-teal flex items-center justify-center text-xl font-bold shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold">ข้อมูลพื้นฐาน</h3>
                <p className="text-xs text-muted-foreground">
                  Admitted: {patient.admitDate || "N/A"}
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">น้ำหนัก / ส่วนสูง</p>
                  <p className="font-medium">72 kg / 170 cm</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">กรุ๊ปเลือด</p>
                  <p className="font-medium">O Positive</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">โรคประจำตัว</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs">{patient.carePlan}</span>
                  <span className="rounded-md bg-muted px-2 py-1 text-xs">เบาหวานชนิดที่ 2</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">ประวัติการแพ้</p>
                <p className="text-sm font-medium text-risk-red">Penicillin (ผื่นคันรุนแรง)</p>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <VitalsMonitorCard
            hr={115}
            hrAlert={true}
            bp={patient.latestBP !== "-" ? patient.latestBP : "160/95"}
            bpAlert={true}
            spo2={92}
            temp={37.8}
          />
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2">
          <div className="flex border-b mb-6 overflow-x-auto hide-scrollbar">
            {["Overview", "AI Summary", "Transcript", "Medication", "Appointment"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* AI Summary Card */}
              <div className="rounded-xl border bg-card overflow-hidden">
                <div className="bg-muted/30 px-5 py-3 border-b flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">AI-generated Summary</h3>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed mb-4">
                    ผู้ป่วยชายอายุ 65 ปี มีประวัติความดันโลหิตสูงและเบาหวาน
                    อาการล่าสุดรายงานว่ามีอาการวิงเวียนศีรษะและใจสั่นเมื่อเช้านี้ ผลการติดตาม Vitals
                    ล่าสุดพบความดันโลหิตสูง (
                    {patient.latestBP !== "-" ? patient.latestBP : "160/95"})
                    และอัตราการเต้นของหัวใจเร็วกว่าปกติ (115 bpm) AI ประเมินความเสี่ยงระดับ{" "}
                    <strong>Critical</strong>{" "}
                    แนะนำให้แพทย์พิจารณาปรับยาลดความดันและตรวจคลื่นไฟฟ้าหัวใจ (EKG) โดยด่วน
                  </p>
                  <div className="flex gap-2">
                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Confidence: 94%
                    </span>
                    <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                      Generated: 10 mins ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-bold mb-4">Follow-up Timeline</h3>
                <PatientTimeline entries={timelineEntries} />
              </div>
            </div>
          )}

          {activeTab !== "Overview" && (
            <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
              เนื้อหาส่วน {activeTab} อยู่ระหว่างการพัฒนา
            </div>
          )}
        </div>
      </div>

      <Modals />
      <CallPatientModal
        open={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        patientId={patient.id}
        patientName={patient.name}
        hn={patient.hn}
        age={patient.age}
        riskLevel={patient.riskLevel}
        appointment={patient.appointmentStatus}
      />
    </div>
  );
}
