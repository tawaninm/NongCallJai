import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { useSyncExternalStore } from "react";
import { voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/elder-profiles")({
  component: ElderProfilesPage,
});

function ElderProfilesPage() {
  const navigate = useNavigate();
  const elders = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getElderProfiles,
    voiceMedStore.getElderProfiles,
  );

  return (
    <div className="vm-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="vm-pill">
            <MascotIcon variant="user" size="1.1rem" />
            Elder Profiles
          </span>
          <h1 className="mt-4 text-4xl font-extrabold">โปรไฟล์ผู้สูงอายุ</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            จัดการคนที่ VoiceMed โทรถามไถ่และส่งสรุปให้ครอบครัว
          </p>
        </div>
        <Link to="/onboarding" className="vm-primary-btn">
          <Plus className="h-4 w-4" />
          เพิ่มโปรไฟล์
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {elders.map((elder) => {
          const config = voiceMedStore.getBotConfigForElder(elder.id);
          const calls = voiceMedStore.getCallLogsForElder(elder.id);
          return (
            <button
              key={elder.id}
              onClick={() =>
                navigate({ to: "/elder-profiles/$elderId", params: { elderId: elder.id } })
              }
              className="rounded-[2rem] vm-glass p-5 text-left transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl vm-orb text-xl font-extrabold text-white">
                    {elder.nickname?.slice(0, 1) ?? elder.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-lg font-extrabold">{elder.nickname ?? elder.name}</p>
                    <p className="text-xs text-muted-foreground">{elder.name}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-primary">
                  {elder.consentStatus === "granted" ? "ยินยอมแล้ว" : "รอ consent"}
                </span>
              </div>
              <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MascotIcon variant="phone" size="1.2rem" />
                  {elder.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MascotIcon variant="home" size="1.2rem" />
                  {elder.livingSituation}
                </p>
                <p className="flex items-center gap-2">
                  <MascotIcon variant="bot" size="1.2rem" />
                  Bot {config?.status ?? "draft"} · โทร {elder.preferredCallTime}
                </p>
              </div>
              <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {elder.healthNotes}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/70 p-3">
                  <p className="text-2xl font-extrabold">{calls.length}</p>
                  <p className="text-xs text-muted-foreground">call/chat logs</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-3">
                  <p className="text-2xl font-extrabold">{config?.enabledCarePlans.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground">แผนดูแล</p>
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
