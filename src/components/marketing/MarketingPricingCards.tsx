import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import type { MascotVariant } from "@/components/MascotIcon";
import { subscriptionPlans, type SubscriptionPlan } from "@/lib/voicemed-data";

type PlanVisual = {
  label: string;
  mascot: MascotVariant;
  tone: string;
};

const planDescriptions: Record<string, string> = {
  basic: "เริ่มดูแลเป็นประจำด้วยสายถามไถ่รายวันและสรุปให้ครอบครัวผ่าน LINE",
  standard: "แพ็กเกจแนะนำสำหรับครอบครัวที่ต้องการสรุปต่อเนื่องและปรับชุดคำถามได้",
  family: "เหมาะกับบ้านที่ดูแลหลายคนและต้องการให้ทีมช่วยประสานการตั้งค่าแบบใกล้ชิด",
};

const planVisuals: Record<string, PlanVisual> = {
  basic: {
    label: "Daily check-in",
    mascot: "phone",
    tone: "bg-[#eaf7ef]",
  },
  standard: {
    label: "Family summary",
    mascot: "chat",
    tone: "bg-[#e7f3f6]",
  },
  family: {
    label: "Care setup",
    mascot: "heart",
    tone: "bg-[#eef3ef]",
  },
};

export function MarketingPricingCards({
  className = "",
  limit,
}: {
  className?: string;
  limit?: number;
}) {
  const plans = typeof limit === "number" ? subscriptionPlans.slice(0, limit) : subscriptionPlans;

  return (
    <div className={`grid gap-5 md:grid-cols-3 ${className}`}>
      {plans.map((plan) => (
        <MarketingPricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function MarketingPricingCard({ plan }: { plan: SubscriptionPlan }) {
  const visual = planVisuals[plan.id] ?? planVisuals.basic;

  return (
    <article className="vm-pricing-card">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${visual.tone}`}>
          <MascotIcon variant={visual.mascot} size="2.5rem" />
        </div>
        <div className="flex items-center gap-2">
          {plan.highlighted && <span className="vm-recommend-badge">แนะนำ</span>}
          <span className="rounded-full border border-[#dce6de] bg-white px-3 py-1 text-xs font-bold text-[#52625a]">
            {visual.label}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-extrabold text-[#223a2e]">{plan.name}</h3>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-5xl font-extrabold leading-none text-[#17221c]">
            ฿{plan.priceThb}
          </span>
          <span className="pb-1 text-sm font-semibold text-[#52625a]">/ เดือน</span>
        </div>
        <p className="mt-4 min-h-16 text-sm leading-7 text-[#52625a]">
          {planDescriptions[plan.id] ?? plan.callQuotaLabel}
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-[#223a2e]">
            <MascotIcon variant="check" size="1.2rem" className="mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link to="/checkout" search={{ plan: plan.id }} className="vm-secondary-btn mt-7 w-full">
        เริ่มแพ็กเกจนี้
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
