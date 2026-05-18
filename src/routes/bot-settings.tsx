import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { BotTone } from "@/lib/voicemed-data";
import { getElderName, voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/bot-settings")({
  component: BotSettingsPage,
});

const toneLabels: Record<BotTone, string> = {
  warm: "อบอุ่น",
  gentle: "อ่อนโยน",
  cheerful: "สดใส",
  formal: "สุภาพ",
};

function BotSettingsPage() {
  const bots = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getBotConfigs,
    voiceMedStore.getBotConfigs,
  );
  const templates = voiceMedStore.getCareTemplates();

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <span className="vm-pill">
          <MascotIcon variant="bot" size="1.1rem" />
          Botnoi Voicebot + Chatbot
        </span>
        <h1 className="mt-5 text-4xl font-extrabold">จัดการ Voice bot และ Chatbot</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          ตั้งค่าโทนสนทนา ตารางโทร ชุดคำถาม และรายงานครอบครัว โดยไม่ต้องใช้ API key จริงใน prototype
          นี้
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <IntegrationCard
          mascot="phone"
          title="Voice bot"
          status="Connected"
          detail="โทรถามไถ่และเตือนเรื่องสำคัญผ่าน Botnoi Voice"
        />
        <IntegrationCard
          mascot="chat"
          title="Chatbot / LINE"
          status="Connected"
          detail="รองรับข้อความจากครอบครัวและรายงานสรุป"
        />
        <IntegrationCard
          mascot="slider"
          title="Safety layer"
          status="Active"
          detail="ไม่วินิจฉัย ไม่สั่งยา และแจ้งให้ครอบครัวตรวจสอบเมื่อจำเป็น"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {bots.map((bot) => (
          <article key={bot.id} className="rounded-[2rem] vm-glass p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-extrabold">{getElderName(bot.elderProfileId)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {bot.channel} · {bot.callTimeWindows.join(", ")}
                </p>
              </div>
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                {bot.status}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold">โทนสนทนา</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {(Object.keys(toneLabels) as BotTone[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => {
                      voiceMedStore.updateBotTone(bot.id, tone);
                      toast.success(`เปลี่ยนโทนเป็น ${toneLabels[tone]}`);
                    }}
                    className={`rounded-2xl border px-3 py-2 text-xs font-bold ${
                      bot.tone === tone
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-white/70"
                    }`}
                  >
                    {toneLabels[tone]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold">แผนการดูแลที่เปิดใช้</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bot.enabledCarePlans.map((planId) => {
                  const plan = templates.find((template) => template.id === planId);
                  return (
                    <span
                      key={planId}
                      className="rounded-full border bg-white/70 px-3 py-1 text-xs font-bold"
                    >
                      {plan?.name ?? planId}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/70 p-4">
              <p className="text-sm font-bold">ตัวอย่างคำถาม</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {templates
                  .filter((template) => bot.enabledCarePlans.includes(template.id))
                  .flatMap((template) => template.questions.slice(0, 1))
                  .slice(0, 4)
                  .map((question) => (
                    <li key={question}>• {question}</li>
                  ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function IntegrationCard({
  mascot,
  title,
  status,
  detail,
}: {
  mascot: MascotVariant;
  title: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="rounded-[2rem] vm-glass-soft p-5">
      <div className="flex items-center justify-between">
        <MascotIcon variant={mascot} size="2.5rem" />
        <span className="flex items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-xs font-bold text-teal">
          <MascotIcon variant="check" size="1rem" />
          {status}
        </span>
      </div>
      <p className="mt-5 text-xl font-extrabold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
    </div>
  );
}
