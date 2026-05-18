import { createFileRoute } from "@tanstack/react-router";
import { MascotIcon } from "@/components/MascotIcon";
import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { subscriptionPlans } from "@/lib/voicemed-data";
import { voiceMedStore } from "@/lib/voicemed-store";

export const Route = createFileRoute("/billing")({
  component: BillingPage,
});

function BillingPage() {
  const account = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getCurrentAccount,
    voiceMedStore.getCurrentAccount,
  );
  const records = voiceMedStore
    .getBillingRecords()
    .filter((record) => record.accountId === account.id);
  const currentPlan = subscriptionPlans.find((plan) => plan.id === account.planId);

  return (
    <div className="vm-page">
      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="money" size="1.1rem" />
            Billing
          </span>
          <h1 className="mt-5 text-4xl font-extrabold">Subscription และการชำระเงิน</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            หน้านี้เป็น mock billing สำหรับ prototype ยังไม่มีการชำระเงินจริง
          </p>
        </div>
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
          <p className="text-sm text-white/60">แพ็กเกจปัจจุบัน</p>
          <p className="mt-2 text-4xl font-extrabold">{currentPlan?.name}</p>
          <p className="mt-2 text-sm text-white/70">
            {account.subscriptionStatus === "trial"
              ? `ทดลองใช้ฟรีถึง ${account.trialEndsAt}`
              : "ใช้งานอยู่"}
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <article
            key={plan.id}
            className={`rounded-[2rem] vm-glass p-5 ${plan.id === account.planId ? "ring-2 ring-primary" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-extrabold">{plan.name}</p>
                <p className="mt-2 text-4xl font-extrabold">฿{plan.priceThb}</p>
              </div>
              {plan.id === account.planId && <MascotIcon variant="star" size="1.8rem" />}
            </div>
            <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">
              {plan.callQuotaLabel}
            </p>
            <button
              onClick={() => {
                voiceMedStore.switchPlan(plan.id);
                toast.success(`เปลี่ยนเป็น ${plan.name} แล้วใน mock data`);
              }}
              className={
                plan.id === account.planId
                  ? "vm-secondary-btn mt-5 w-full py-2"
                  : "vm-primary-btn mt-5 w-full py-2"
              }
            >
              {plan.id === account.planId ? "ใช้งานอยู่" : "เปลี่ยนแพ็กเกจ"}
            </button>
          </article>
        ))}
      </section>

      <section className="rounded-[2rem] vm-glass p-5">
        <h2 className="text-2xl font-extrabold">Billing history</h2>
        <div className="mt-4 space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="grid gap-3 rounded-2xl border bg-white/70 p-4 md:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <p className="font-bold">{record.description}</p>
                <p className="text-xs text-muted-foreground">{record.date}</p>
              </div>
              <p className="font-extrabold">฿{record.amountThb}</p>
              <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal">
                {record.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
