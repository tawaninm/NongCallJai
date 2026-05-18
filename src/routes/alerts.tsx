import { createFileRoute, Link } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { getAlertTone, getElderName, voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  const alerts = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getFamilyAlerts,
    voiceMedStore.getFamilyAlerts,
  );

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <span className="vm-pill">
          <MascotIcon variant="bell" size="1.1rem" />
          Family Alerts
        </span>
        <h1 className="mt-5 text-4xl font-extrabold">แจ้งเตือนและสิ่งที่ควรตรวจสอบ</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          VoiceMed สรุปเฉพาะสิ่งที่ครอบครัวควรดูต่อ ไม่วินิจฉัยหรือแนะนำการรักษา
        </p>
      </section>

      <section className="space-y-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-[2rem] vm-glass p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${getAlertTone(alert)}`}
                >
                  {alert.severity} · {alert.status}
                </span>
                <h2 className="mt-4 text-2xl font-extrabold">{alert.title}</h2>
                <p className="mt-2 text-sm font-bold text-primary">
                  {getElderName(alert.elderProfileId)}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {alert.summary}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{alert.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    voiceMedStore.markAlertReviewed(alert.id);
                    toast.success("บันทึกว่าอ่านแล้ว");
                  }}
                  className="vm-secondary-btn py-2"
                >
                  อ่านแล้ว
                </button>
                <button
                  onClick={() => {
                    voiceMedStore.resolveAlert(alert.id);
                    toast.success("ปิดแจ้งเตือนแล้ว");
                  }}
                  className="vm-primary-btn py-2"
                >
                  <MascotIcon variant="check" size="1.2rem" />
                  Resolve
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <h2 className="text-2xl font-extrabold">ข้อความปลอดภัย</h2>
        <p className="mt-3 text-sm leading-7 text-white/70">
          หากอาการรุนแรง ควรติดต่อบุคลากรทางการแพทย์หรือช่องทางฉุกเฉินที่เหมาะสม VoiceMed
          ไม่ให้คำวินิจฉัย ไม่สั่งยา และไม่เปลี่ยนแผนรักษา
        </p>
        <Link to="/call-history" className="vm-primary-btn mt-5">
          ดู call log ที่เกี่ยวข้อง
        </Link>
      </section>
    </div>
  );
}
