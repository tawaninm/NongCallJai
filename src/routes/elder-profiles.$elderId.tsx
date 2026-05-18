import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { voiceMedStore, getAlertTone } from "@/lib/voicemed-store";

export const Route = createFileRoute("/elder-profiles/$elderId")({
  component: ElderProfileDetailPage,
});

function ElderProfileDetailPage() {
  const { elderId } = Route.useParams();
  const elder = voiceMedStore.getElderProfile(elderId);
  const bot = voiceMedStore.getBotConfigForElder(elderId);
  const calls = voiceMedStore.getCallLogsForElder(elderId);
  const alerts = voiceMedStore
    .getFamilyAlerts()
    .filter((alert) => alert.elderProfileId === elderId);
  const templates = voiceMedStore.getCareTemplates();

  if (!elder) {
    return (
      <div className="vm-page">
        <div className="rounded-[2rem] vm-glass p-8 text-center">
          <h1 className="text-2xl font-extrabold">ไม่พบโปรไฟล์</h1>
          <Link to="/elder-profiles" className="vm-primary-btn mt-5">
            กลับรายการ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vm-page">
      <Link to="/elder-profiles" className="vm-secondary-btn w-fit py-2">
        <ArrowLeft className="h-4 w-4" />
        กลับรายการ
      </Link>

      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] vm-orb text-3xl font-extrabold text-white">
              {elder.nickname?.slice(0, 1) ?? elder.name.slice(0, 1)}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">{elder.nickname ?? elder.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {elder.name} · {elder.relationship} · {elder.age} ปี · {elder.phone}
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/70 p-4">
            <p className="text-xs font-bold text-muted-foreground">Consent</p>
            <p className="mt-1 text-lg font-extrabold text-teal">
              {elder.consentStatus === "granted" ? "ยินยอมแล้ว" : "รอดำเนินการ"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Panel title="ข้อมูลดูแล" mascot="heart">
            <p className="text-sm leading-7 text-muted-foreground">{elder.healthNotes}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoBox label="ที่อยู่/สถานะ" value={elder.livingSituation} />
              <InfoBox label="เวลาที่โทร" value={elder.preferredCallTime ?? "-"} />
            </div>
          </Panel>
          <Panel title="Bot configuration" mascot="bot">
            <div className="grid gap-3">
              <InfoBox label="สถานะ" value={bot?.status ?? "draft"} />
              <InfoBox label="ช่องทาง" value={bot?.channel ?? "voice"} />
              <InfoBox label="โทน" value={bot?.tone ?? "warm"} />
            </div>
            <Link to="/bot-settings" className="vm-secondary-btn mt-4 w-full py-2">
              แก้ไข Bot Settings
            </Link>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="แผนดูแลที่เปิดใช้" mascot="shield">
            <div className="grid gap-3 md:grid-cols-2">
              {(bot?.enabledCarePlans ?? []).map((planId) => {
                const plan = templates.find((template) => template.id === planId);
                return (
                  <div key={planId} className="rounded-2xl border bg-white/70 p-4">
                    <p className="font-bold">{plan?.name ?? planId}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {plan?.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Call / Chat logs ล่าสุด" mascot="phone">
            <div className="space-y-3">
              {calls.map((call) => (
                <div key={call.id} className="rounded-2xl border bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">{call.startedAt}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{call.summary}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                      {call.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Alerts" mascot="bell">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="rounded-2xl border bg-white/70 p-4">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getAlertTone(alert)}`}
                  >
                    {alert.severity}
                  </span>
                  <p className="mt-2 font-bold">{alert.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{alert.summary}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function Panel({
  title,
  mascot,
  children,
}: {
  title: string;
  mascot: MascotVariant;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] vm-glass p-5">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
        <MascotIcon variant={mascot} size="1.8rem" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}
