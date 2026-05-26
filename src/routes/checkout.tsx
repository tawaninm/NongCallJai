import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { mvpApi } from "@/lib/mvp-api";
import { subscriptionPlans } from "@/lib/voicemed-data";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>): { plan?: string } => {
    return {
      plan: search.plan as string | undefined,
    };
  },
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [payerName, setPayerName] = useState("คุณภัทร");
  const [phone, setPhone] = useState("089-111-2244");
  const [email, setEmail] = useState("family@example.com");
  const [loading, setLoading] = useState(false);
  const plan = subscriptionPlans.find((item) => item.id === selectedPlan) ?? subscriptionPlans[1];

  const startTrial = async () => {
    if (!payerName.trim() || !phone.trim() || !email.trim()) {
      toast.error("กรุณากรอกชื่อ เบอร์โทร และอีเมลสำหรับสมัครบริการ");
      return;
    }
    setLoading(true);
    try {
      await mvpApi.completeMockCheckout({ payerName, phone, email, planId: selectedPlan });
      login("owner");
      toast.success("สมัครแพ็กเกจเรียบร้อยแล้ว ไปกรอกข้อมูลสำหรับตั้งค่าบริการต่อได้เลย");
      navigate({ to: "/onboarding" });
    } catch {
      toast.error("ไม่สามารถสมัครบริการได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto max-w-[1100px] space-y-8">
        <Link to="/pricing" className="vm-secondary-btn py-2">
          <ArrowLeft className="h-4 w-4" />
          กลับไปเลือกแพ็กเกจ
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] vm-glass p-6 md:p-8">
            <span className="vm-pill">
              <MascotIcon variant="star" size="1.1rem" />
              Mock checkout
            </span>
            <h1 className="mt-5 text-4xl font-extrabold">สมัครบริการ NongCallJai</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              รอบ MVP นี้ยังไม่ตัดเงินจริง ระบบจะสร้าง customer record
              และส่งต่อไปยังขั้นตอนเก็บข้อมูลผู้สูงอายุ เพื่อให้ทีมตั้งค่า Botnoi และ LINE OA ต่อ
            </p>

            <div className="mt-8 space-y-5">
              <Field label="ชื่อผู้จ่าย / เจ้าของบัญชี" value={payerName} onChange={setPayerName} />
              <Field label="เบอร์โทร" value={phone} onChange={setPhone} />
              <Field label="อีเมล" value={email} onChange={setEmail} />
              <div>
                <p className="text-sm font-bold">เลือกแพ็กเกจ</p>
                <div className="mt-2 grid gap-3 md:grid-cols-3">
                  {subscriptionPlans.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPlan(item.id)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        item.id === selectedPlan
                          ? "border-primary bg-primary/10"
                          : "bg-white/70 hover:bg-white"
                      }`}
                    >
                      <p className="font-extrabold">{item.name}</p>
                      <p className="mt-2 text-2xl font-extrabold">฿{item.priceThb}</p>
                      <p className="text-xs text-muted-foreground">/ เดือน</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] nj-dark-panel p-6 text-white md:p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <MascotIcon variant="money" size="3rem" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold">สรุปรายการ</h2>
            <div className="mt-6 space-y-4 rounded-3xl bg-white/10 p-5">
              <div className="flex items-center justify-between">
                <span>{plan.name}</span>
                <strong>฿{plan.priceThb}</strong>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>Mock checkout</span>
                <span>฿0 วันนี้</span>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm text-white/70">
                  หลังสมัคร ระบบจะให้เชื่อม LINE OA และรอทีมตั้งค่า Botnoi Voicebot
                </p>
              </div>
            </div>
            <button onClick={startTrial} disabled={loading} className="vm-primary-btn mt-6 w-full">
              {loading ? "กำลังสมัคร..." : "สมัครและไปตั้งค่าบริการ"}
            </button>
            <div className="mt-5 flex items-start gap-3 text-xs leading-6 text-white/60">
              <MascotIcon variant="shield" size="1.2rem" className="mt-0.5" />
              ไม่มีการเก็บ payment credential จริงใน MVP และไม่แสดง secret ของ LINE หรือ Botnoi
              บนหน้าเว็บ
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border bg-white/80 px-4 py-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}
