import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const account = voiceMedStore.getCurrentAccount();
  const consents = voiceMedStore.getConsentRecords();

  return (
    <div className="vm-page">
      <section className="rounded-[2rem] vm-glass p-6 md:p-8">
        <span className="vm-pill">
          <MascotIcon variant="settings" size="1.1rem" />
          Account Settings
        </span>
        <h1 className="mt-5 text-4xl font-extrabold">ตั้งค่าบัญชีและความเป็นส่วนตัว</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          จัดการข้อมูลเจ้าของบัญชี การยินยอม PDPA และขอบเขตการสื่อสารของ VoiceMed
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] vm-glass p-5">
          <h2 className="text-2xl font-extrabold">เจ้าของบัญชี</h2>
          <div className="mt-5 space-y-3">
            <Info label="ชื่อ" value={account.payerName} />
            <Info label="โทร" value={account.phone} />
            <Info label="อีเมล" value={account.email ?? "-"} />
            <Info label="สถานะ" value={account.subscriptionStatus} />
          </div>
        </div>

        <div className="rounded-[2rem] vm-glass p-5">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold">
            <MascotIcon variant="shield" size="1.8rem" />
            Consent / PDPA
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            ข้อมูลเสียงเป็นข้อมูลส่วนบุคคล และอาจเป็นข้อมูลอ่อนไหวหากใช้ยืนยันตัวตน MVP
            นี้ใช้เพื่อการสนทนาและสรุปผลเท่านั้น ไม่ใช้เพื่อ biometric identification
          </p>
          <div className="mt-5 space-y-3">
            {consents.map((consent) => (
              <div
                key={consent.id}
                className="grid gap-3 rounded-2xl border bg-white/70 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-bold">{consent.consentType}</p>
                  <p className="text-xs text-muted-foreground">profile: {consent.elderProfileId}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {consent.status}
                </span>
                <span className="text-xs text-muted-foreground">{consent.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}
