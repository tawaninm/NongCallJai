import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ChevronRight, Menu } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { MarketingPricingCards } from "@/components/marketing/MarketingPricingCards";
import { NongCallJaiMascot } from "@/components/NongCallJaiMascot";
import { APP_VERSION } from "@/lib/patch-log";
import { motion } from "framer-motion";

import type { MascotVariant } from "@/components/MascotIcon";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { token?: string; "liff.state"?: string } => {
    return {
      token: search.token as string | undefined,
      "liff.state": search["liff.state"] as string | undefined,
    };
  },
  component: LandingPage,
});

const careSteps: { number: string; title: string; text: string; mascot: MascotVariant }[] = [
  {
    number: "01",
    title: "เลือกแพ็กเกจ",
    text: "เริ่มจากแผนรายเดือนที่เหมาะกับจำนวนผู้สูงอายุและรูปแบบการแจ้งเตือน",
    mascot: "check",
  },
  {
    number: "02",
    title: "เก็บข้อมูลและความยินยอม",
    text: "กรอกข้อมูลที่จำเป็น เช่น เบอร์โทร คำเรียก เวลาที่สะดวก และขอบเขตการดูแล",
    mascot: "clipboard",
  },
  {
    number: "03",
    title: "NongCallJai โทรถามไถ่",
    text: "เสียงที่อ่อนโยนโทรเช็กอินตามเวลาที่ตั้งไว้ และถามเฉพาะคำถามที่ผ่านการอนุมัติ",
    mascot: "phone",
  },
  {
    number: "04",
    title: "ครอบครัวรับสรุปผ่าน LINE",
    text: "ส่งสรุปและสิ่งที่ควรตรวจสอบต่อ โดยไม่แทนการตัดสินใจของแพทย์หรือผู้ดูแล",
    mascot: "chat",
  },
];

const trustItems: { title: string; text: string; mascot: MascotVariant }[] = [
  {
    title: "มีคนจริงช่วยตั้งค่า",
    text: "ทีมช่วยประสาน Botnoi, LINE OA และข้อมูลเริ่มต้นก่อนเริ่มใช้งาน",
    mascot: "heart",
  },
  {
    title: "ออกแบบเพื่อครอบครัว",
    text: "ผู้สูงอายุไม่จำเป็นต้องใช้แอป ครอบครัวรับสรุปผ่านช่องทางที่คุ้นเคย",
    mascot: "people",
  },
  {
    title: "ปลอดภัยต่อคำแนะนำสุขภาพ",
    text: "ระบบถามไถ่และแจ้งให้ตรวจสอบต่อ ไม่วินิจฉัย ไม่สั่งยา และไม่ปรับยา",
    mascot: "shield",
  },
];

const featureMoments: { label: string; title: string; text: string; mascot: MascotVariant }[] = [
  {
    label: "Call schedule",
    title: "ตั้งช่วงเวลาโทรที่ไม่รบกวน",
    text: "ระบุเวลาที่คุณตาคุณยายสะดวก เช่น หลังอาหารเช้าหรือช่วงเย็น",
    mascot: "calendar",
  },
  {
    label: "LINE summary",
    title: "สรุปสั้น อ่านจบไว",
    text: "ครอบครัวเห็นประเด็นสำคัญและสิ่งที่ควรติดตามต่อโดยไม่ต้องเข้าเว็บบ่อย",
    mascot: "chat",
  },
  {
    label: "Family alert",
    title: "แจ้งเตือนเมื่อควรตรวจสอบ",
    text: "หากมีคำตอบที่ควรให้คนดูแลดูต่อ ระบบส่งสัญญาณอย่างระมัดระวัง",
    mascot: "warning",
  },
];

const faqs = [
  {
    question: "ผู้สูงอายุต้องใช้ LINE ไหม",
    answer:
      "ไม่จำเป็น NongCallJai โทรผ่านเบอร์โทรศัพท์ ส่วน LINE ใช้สำหรับครอบครัวรับสรุปและแจ้งเตือน",
  },
  {
    question: "ระบบให้คำแนะนำทางการแพทย์หรือไม่",
    answer: "ไม่ให้คำวินิจฉัย ไม่สั่งยา และไม่แนะนำให้เริ่ม หยุด เพิ่ม หรือลดขนาดยา",
  },
  {
    question: "หลังสมัครแล้วเกิดอะไรขึ้น",
    answer:
      "ระบบเก็บคำขอบริการ เชื่อม LINE และส่งต่อให้ทีมตั้งค่า Botnoi schedule/script ตามขอบเขต MVP",
  },
] as const;

function LandingPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      let token = searchParams.get("token");

      const liffState = searchParams.get("liff.state");
      if (liffState) {
        const stateParams = new URLSearchParams(
          liffState.startsWith("?") ? liffState : `?${liffState}`,
        );
        if (!token) token = stateParams.get("token");
      }

      if (token) {
        window.location.replace(`/line-connect?token=${token}`);
      }
    }
  }, []);

  return (
    <main className="vm-public-shell text-[#17221c]">
      <TopNav />
      <div className="vm-marketing-container">
        <HeroSection />
        <TrustStrip />
        <CareFlowSection />
        <FeaturePreviewSection />
        <SafetySection />
        <PricingPreviewSection />
        <FaqSection />
        <FooterCta />
      </div>
    </main>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#dce6de] bg-[#fafbf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 md:h-20 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf7ef] shadow-[0_12px_30px_rgba(35,65,48,0.10)]">
            <MascotIcon variant="call" size="2.2rem" />
          </div>
          <div>
            <p className="text-lg font-extrabold leading-5 text-[#223a2e]">NongCallJai</p>
            <p className="mt-1 text-[11px] font-bold text-[#52625a]">by VoiceMed</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-bold text-[#52625a] lg:flex">
          <a className="transition hover:text-[#223a2e]" href="#flow">
            How it works
          </a>
          <a className="transition hover:text-[#223a2e]" href="#safety">
            Safety
          </a>
          <a className="transition hover:text-[#223a2e]" href="#packages">
            Packages
          </a>
          <a className="transition hover:text-[#223a2e]" href="#faq">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/pricing" className="vm-primary-btn hidden sm:inline-flex">
            เริ่มใช้ฟรี 14 วัน
          </Link>
          <details className="relative lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-2xl border border-[#dce6de] bg-white text-[#223a2e]">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="absolute right-0 top-[52px] w-52 rounded-3xl border border-[#dce6de] bg-white p-3 shadow-[0_18px_50px_rgba(35,65,48,0.14)]">
              {[
                ["How it works", "#flow"],
                ["Safety", "#safety"],
                ["Packages", "#packages"],
                ["FAQ", "#faq"],
              ].map(([label, href]) => (
                
                <a
                  className="block rounded-2xl px-4 py-3 text-sm font-bold text-[#52625a] hover:bg-[#eaf7ef] hover:text-[#223a2e]"
                  href={href}
                >
                  {label}
                </a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="grid gap-10 py-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.82fr)] lg:items-center lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="vm-pill">
          <MascotIcon variant="star" size="1.1rem" />
          NongCallJai {APP_VERSION} for family care
        </span>
        <h1 className="mt-6 max-w-3xl text-[40px] font-extrabold leading-[1.18] text-[#223a2e] sm:text-[48px] lg:text-[56px]">
          โทรถามไถ่แทนคุณ แล้วส่งสรุปให้ครอบครัวทาง LINE
        </h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#52625a] md:text-lg md:leading-9">
          AI Voice Companion สำหรับครอบครัวที่ดูแลผู้สูงอายุจากระยะไกล โทรเช็กอินอย่างอ่อนโยน
          เก็บข้อมูลที่เล่าเอง และแจ้งให้ครอบครัวตรวจสอบต่อเมื่อควรใส่ใจ
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/pricing" className="vm-primary-btn h-12 px-6">
            เริ่มทดลองใช้ฟรี 14 วัน
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#flow" className="vm-secondary-btn h-12 px-6">
            ดูวิธีทำงาน
          </a>
        </div>
        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
          <MetricCard value="14 วัน" label="ทดลองใช้งาน" />
          <MetricCard value="LINE" label="รับสรุปครอบครัว" />
          <MetricCard value="Human setup" label="ทีมช่วยตั้งค่า" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <HeroProductPreview />
      </motion.div>
    </section>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-[#dce6de] bg-white/80 p-5 shadow-[0_18px_50px_rgba(35,65,48,0.08)] backdrop-blur-xl">
      <p className="text-2xl font-extrabold text-[#223a2e]">{value}</p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#52625a]">{label}</p>
    </div>
  );
}

function HeroProductPreview() {
  return (
    <aside className="relative mx-auto w-full max-w-[520px] rounded-[32px] border border-[#c8d8cc] bg-white/75 p-4 shadow-[0_28px_80px_rgba(35,65,48,0.14)] backdrop-blur-2xl sm:p-6">
      <div className="rounded-[28px] bg-[#223a2e] p-4 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#b9e6c6]">Voice call in progress</p>
            <h2 className="mt-2 text-2xl font-extrabold">คุณตาชัย</h2>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#d8f3df]">
            08:30
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
          <div className="rounded-3xl bg-[#eaf7ef] p-2">
            <NongCallJaiMascot compact variant="call" />
          </div>
          <div className="space-y-3">
            <PreviewBubble text="สวัสดีค่ะ วันนี้ทานข้าวเช้าแล้วหรือยังคะ" />
            <PreviewBubble text="มีเรื่องไหนอยากฝากบอกลูกหลานไหมคะ" muted />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_0.74fr]">
        <div className="rounded-3xl border border-[#dce6de] bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#223a2e]">
            <MascotIcon variant="chat" size="1.4rem" />
            LINE summary
          </div>
          <p className="mt-3 text-sm leading-7 text-[#52625a]">
            ทานข้าวแล้ว อารมณ์ดี และฝากบอกว่าคิดถึงหลาน
          </p>
          <span className="mt-4 inline-flex rounded-full bg-[#eaf7ef] px-3 py-1 text-xs font-bold text-[#4fa66a]">
            ส่งให้ครอบครัวแล้ว
          </span>
        </div>
        <div className="rounded-3xl border border-[#f0d4c8] bg-[#fff7f3] p-5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#7b4c3f]">
            <MascotIcon variant="shield" size="1.4rem" />
            Consent
          </div>
          <p className="mt-3 text-sm leading-7 text-[#7b4c3f]">
            โทรเฉพาะข้อมูลที่ได้รับอนุญาตและสรุปอย่างปลอดภัย
          </p>
        </div>
      </div>
    </aside>
  );
}

function PreviewBubble({ text, muted = false }: { text: string; muted?: boolean }) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
        muted ? "bg-white/10 text-white/70" : "bg-white text-[#223a2e]"
      }`}
    >
      {text}
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {trustItems.map(({ mascot, title, text }, i) => (
        <motion.article
          key={title}
          className="vm-story-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <MascotIcon variant={mascot} size="2.5rem" />
          <h2 className="mt-4 text-xl font-extrabold text-[#223a2e]">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-[#52625a]">{text}</p>
        </motion.article>
      ))}
    </section>
  );
}

function CareFlowSection() {
  return (
    <section id="flow" className="vm-section">
      <SectionHeader
        eyebrow="How it works"
        title="เส้นทางการดูแลที่เรียบง่าย ตั้งแต่สมัครจนถึงครอบครัวได้รับสรุป"
        text="ใช้ care thread เดียวกันทั้งประสบการณ์: โทรถามไถ่ รับฟัง สรุป และส่งต่อให้ครอบครัวตรวจสอบ"
      />
      <div className="vm-care-thread mt-10 grid gap-4 lg:grid-cols-4">
        {careSteps.map(({ mascot, number, title, text }, i) => (
          <motion.article
            key={number}
            className="vm-step-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#4fa66a]">{number}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf7ef]">
                <MascotIcon variant={mascot} size="2.5rem" />
              </div>
            </div>
            <h3 className="mt-5 text-xl font-extrabold text-[#223a2e]">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#52625a]">{text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function FeaturePreviewSection() {
  return (
    <section className="vm-section grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <div className="lg:sticky lg:top-28">
        <SectionHeader
          eyebrow="Product moments"
          title="แสดงภาพจริงของงานที่ครอบครัวต้องทำ ไม่ใช่แค่การ์ดฟีเจอร์ทั่วไป"
          text="หน้าเว็บควรเล่าให้เห็นว่า NongCallJai ช่วยลดช่องว่างระหว่างการโทรถามไถ่และการตัดสินใจของครอบครัวอย่างไร"
        />
        <Link to="/checkout" className="vm-secondary-btn mt-6">
          สมัครและส่งข้อมูลตั้งค่า
          <ChevronRight className="h-4 w-4" />
        </Link>
        {/* Mascot decoration under the section header */}
        <div className="mt-6 flex justify-center lg:justify-start">
          <NongCallJaiMascot compact variant="heart" />
        </div>
      </div>

      <div className="grid gap-4">
        {featureMoments.map(({ mascot, label, title, text }) => (
          <article key={title} className="vm-feature-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(35,65,48,0.08)]">
              <MascotIcon variant={mascot} size="2.8rem" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#75b6c8]">
                {label}
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-[#223a2e]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#52625a]">{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section id="safety" className="vm-section">
      <div className="grid gap-5 rounded-[32px] border border-[#c8d8cc] bg-white/80 p-5 shadow-[0_18px_50px_rgba(35,65,48,0.08)] backdrop-blur-xl md:grid-cols-2 md:p-8">
        <div>
          <span className="vm-pill">Trust and safety</span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-[#223a2e] md:text-4xl">
            ชัดเจนตั้งแต่หน้าแรกว่า NongCallJai ทำอะไร และไม่ทำอะไร
          </h2>
          <p className="mt-4 text-base leading-8 text-[#52625a]">
            ความน่าเชื่อถือของบริการดูแลสุขภาพไม่ได้มาจากคำว่า AI
            แต่จากขอบเขตที่ปลอดภัยและเข้าใจง่าย
          </p>
        </div>
        <div className="grid gap-4">
          <SafetyList
            title="ทำได้"
            items={[
              "โทรถามคำถามเช็กอินที่ได้รับอนุมัติ",
              "รับฟังและสรุปข้อมูลที่ผู้สูงอายุเล่าเอง",
              "แจ้งครอบครัวเมื่อมีสิ่งที่ควรตรวจสอบต่อ",
            ]}
          />
          <SafetyList
            title="ไม่ทำ"
            items={["ไม่วินิจฉัยโรค", "ไม่สั่งยา หรือปรับขนาดยา", "ไม่แทนแพทย์ พยาบาล หรือผู้ดูแล"]}
            warning
          />
        </div>
      </div>
    </section>
  );
}

function SafetyList({
  title,
  items,
  warning = false,
}: {
  title: string;
  items: string[];
  warning?: boolean;
}) {
  return (
    <div className={warning ? "vm-safety-card-warning" : "vm-safety-card"}>
      <h3 className="text-lg font-extrabold text-[#223a2e]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[#52625a]">
            <MascotIcon variant={warning ? "warning" : "check"} size="1.4rem" className="mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingPreviewSection() {
  return (
    <section id="packages" className="vm-section">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Packages"
          title="เลือกแพ็กเกจที่เหมาะกับครอบครัว"
          text="ใช้ HTML pricing card ที่ responsive จริง แทนภาพ package banner เพื่อให้โหลดไว อ่านง่าย และปรับต่อได้"
        />
        <Link to="/pricing" className="vm-secondary-btn self-start md:self-auto">
          ดูรายละเอียดทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <MarketingPricingCards />
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="vm-section">
      <SectionHeader
        eyebrow="FAQ"
        title="คำถามที่ช่วยให้ครอบครัวตัดสินใจได้เร็วขึ้น"
        text="ตอบข้อกังวลหลักก่อนพาผู้ใช้ไป checkout หรือ onboarding"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {faqs.map((item) => (
          <article key={item.question} className="vm-story-card">
            <h3 className="text-lg font-extrabold text-[#223a2e]">{item.question}</h3>
            <p className="mt-3 text-sm leading-7 text-[#52625a]">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FooterCta() {
  return (
    <footer className="mb-10 overflow-hidden rounded-[32px] bg-[#223a2e] p-6 text-white shadow-[0_28px_80px_rgba(35,65,48,0.18)] md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-center">
        <div>
          <p className="text-sm font-bold text-[#b9e6c6]">เพราะความห่วงใยไม่ควรรอให้ว่างก่อน</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
            ให้ NongCallJai ช่วยโทรแทนคุณในวันที่งานยุ่ง
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            เริ่มจากแพ็กเกจทดลอง เก็บข้อมูลอย่างปลอดภัย แล้วให้ทีมช่วยเตรียม Botnoi และ LINE OA
            สำหรับครอบครัวของคุณ
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/pricing" className="vm-primary-btn">
              เริ่มทดลองใช้ฟรี 14 วัน
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/patch-log"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              ดูอัปเดต
            </Link>
          </div>
        </div>
        {/* Mascot decorative illustration */}
        <div className="hidden lg:flex lg:justify-center">
          <img
            src="/Mascot Icon Logo/2.png"
            alt="NongCallJai waving"
            className="h-72 w-auto object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.35)] animate-[float_4s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#4fa66a]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#223a2e] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#52625a]">{text}</p>
    </div>
  );
}
