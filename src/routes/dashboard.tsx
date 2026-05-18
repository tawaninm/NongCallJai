import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const customer = mvpApi.getStoredCustomer();

  return (
    <div className="vm-page">
      <section className="overflow-hidden rounded-[2rem] vm-glass p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="vm-pill">
              <MascotIcon variant="shield" size="1.1rem" />
              NongCallJai setup overview
            </span>
            <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">
              ติดตามสถานะสมัครบริการและการส่งต่อทีม
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              หน้านี้เป็น setup overview ของเว็บ ไม่ใช่หน้าดู feedback หลังการโทร
              ผลการโทรจริงจะถูกส่งให้ครอบครัวผ่าน LINE OA ตาม scope MVP
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link to="/onboarding" className="vm-primary-btn">
                กรอกข้อมูลบริการ
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/line-connect" className="vm-secondary-btn">
                เชื่อม LINE OA
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] nj-dark-panel p-6 text-white">
            <p className="text-sm font-bold text-white/60">Customer</p>
            <p className="mt-2 text-3xl font-extrabold">
              {customer?.payerName ?? "ยังไม่มีข้อมูล"}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {customer ? `Plan: ${customer.planId}` : "เริ่มจาก mock checkout เพื่อสร้าง customer"}
            </p>
            <span className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#bce1c4]">
              {customer?.setupStatus ?? "not_started"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardStatusCard
          mascot="check"
          title="Mock checkout"
          text="สร้าง customer และ subscription record"
          done={Boolean(customer)}
        />
        <DashboardStatusCard
          mascot="link"
          title="LINE connect"
          text="สร้าง token/LIFF link สำหรับทีม LINE OA"
          done={customer?.setupStatus !== "waiting_line"}
        />
        <DashboardStatusCard
          mascot="bot"
          title="Botnoi mapping"
          text="ทีมภายในกรอก bot/contact id ใน admin"
          done={customer?.setupStatus === "ready"}
        />
      </section>

      <section className="rounded-[2rem] vm-glass p-6">
        <h2 className="text-2xl font-extrabold">ขอบเขต MVP</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "เว็บใช้สำหรับสมัครบริการ เก็บข้อมูลลูกค้า และเตรียม mapping",
            "Botnoi dashboard เป็นที่ตั้ง schedule โทรและ script",
            "LINE OA เป็นที่แสดง feedback, transcript/audio link และ alert ให้ครอบครัว",
            "เว็บไม่แสดง call history, report หรือ transcript สำหรับครอบครัว",
          ].map((item) => (
            <div
              key={item}
              className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm text-muted-foreground"
            >
              <MascotIcon variant="calendar" size="1.2rem" className="mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardStatusCard({
  mascot,
  title,
  text,
  done,
}: {
  mascot: MascotVariant;
  title: string;
  text: string;
  done: boolean;
}) {
  return (
    <div className="rounded-[2rem] vm-glass-soft p-5">
      <MascotIcon variant={mascot} size="2.5rem" />
      <p className="mt-5 text-lg font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <span className="mt-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-primary">
        {done ? "done" : "pending"}
      </span>
    </div>
  );
}
