import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { MarketingPricingCards } from "@/components/marketing/MarketingPricingCards";
import { NongCallJaiMascot } from "@/components/NongCallJaiMascot";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

const setupNotes = [
  "Mock checkout สำหรับ MVP นี้ ยังไม่มีการตัดเงินหรือเก็บ payment credential จริง",
  "หลังสมัคร ทีมจะช่วยเตรียม Botnoi schedule/script และ LINE OA handoff",
  "ผู้สูงอายุไม่จำเป็นต้องใช้ LINE ครอบครัวเป็นผู้รับสรุปและแจ้งเตือน",
];

function PricingPage() {
  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1180px] space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="vm-secondary-btn py-2">
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
          <span className="vm-pill">NongCallJai packages</span>
        </div>

        <section className="overflow-hidden rounded-[32px] border border-[#c8d8cc] bg-white/80 p-6 shadow-[0_28px_80px_rgba(35,65,48,0.12)] backdrop-blur-2xl md:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf7ef]">
                <MascotIcon variant="check" size="3rem" />
              </div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-[#223a2e] md:text-6xl">
                เลือกแพ็กเกจที่เหมาะกับจังหวะการดูแลของครอบครัว
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#52625a]">
                ทุกแพ็กเกจเริ่มจากการเก็บข้อมูลที่จำเป็น เชื่อม LINE สำหรับครอบครัว
                และส่งต่อให้ทีมช่วยตั้งค่าเสียงถามไถ่อย่างปลอดภัย
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {setupNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-[#dce6de] bg-[#fafbf8] p-4">
                    <MascotIcon variant="check" size="1.2rem" />
                    <p className="mt-3 text-sm leading-6 text-[#52625a]">{note}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-[#eaf7ef] p-3">
              <NongCallJaiMascot compact variant="wave" />
            </div>
          </div>
        </section>

        <MarketingPricingCards />

        <section className="grid gap-5 rounded-[32px] bg-[#223a2e] p-6 text-white shadow-[0_28px_80px_rgba(35,65,48,0.16)] md:grid-cols-[0.78fr_1fr] md:p-8">
          <div>
            <MascotIcon variant="shield" size="2.5rem" />
            <h2 className="mt-5 text-3xl font-extrabold">ขอบเขตความปลอดภัย</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              NongCallJai by VoiceMed เป็นบริการถามไถ่และส่งสรุปให้ครอบครัว ไม่ใช่บริการแพทย์
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SafetyPoint mascot="heart" text="ถามคำถามเช็กอินที่ได้รับอนุมัติ" />
            <SafetyPoint mascot="check" text="สรุปข้อมูลให้ครอบครัวตรวจสอบต่อ" />
            <SafetyPoint mascot="shield" text="ไม่วินิจฉัยโรค ไม่สั่งยา และไม่ปรับขนาดยา" />
            <SafetyPoint
              mascot="warning"
              text="หากอาการรุนแรง ควรติดต่อบุคลากรทางการแพทย์หรือช่องทางฉุกเฉินที่เหมาะสม"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function SafetyPoint({ mascot, text }: { mascot: MascotVariant; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <MascotIcon variant={mascot} size="1.8rem" />
      <p className="mt-3 text-sm leading-7 text-white/75">{text}</p>
    </div>
  );
}
