import { createFileRoute, Link } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { NongCallJaiMascot } from "@/components/NongCallJaiMascot";
import { mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/waiting-setup")({
  component: WaitingSetupPage,
});

function WaitingSetupPage() {
  const customer = mvpApi.getStoredCustomer();

  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <section className="rounded-[2rem] vm-glass p-6 md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <span className="vm-pill">
                <MascotIcon variant="calendar" size="1.1rem" />
                Waiting setup
              </span>
              <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">
                ทีมจะตั้งค่า Botnoi Voicebot ให้ต่อ
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                เราบันทึกคำขอบริการของ {customer?.payerName ?? "ครอบครัว"} แล้ว
                ขั้นตอนถัดไปคือทีมปฏิบัติการนำข้อมูลไปตั้งค่า Botnoi schedule/script
                และเชื่อมการแจ้งเตือน LINE OA
              </p>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <Step mascot="check" title="สมัครบริการ" text="Mock checkout สำเร็จ" />
                <Step mascot="chat" title="เชื่อม LINE" text="รอทีม LINE ตรวจ config" />
                <Step mascot="bot" title="ตั้งค่า Botnoi" text="รอ mapping bot/contact" />
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/admin/customers" className="vm-primary-btn">
                  เปิดหน้า admin setup
                </Link>
                <Link to="/" className="vm-secondary-btn">
                  กลับหน้าแรก
                </Link>
              </div>
            </div>
            <NongCallJaiMascot variant="dance" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ mascot, title, text }: { mascot: MascotVariant; title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-white/75 p-4">
      <MascotIcon variant={mascot} size="1.8rem" />
      <p className="mt-3 text-sm font-extrabold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}
