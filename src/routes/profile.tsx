import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MascotIcon } from "@/components/MascotIcon";
import { mvpApi, type Customer } from "@/lib/mvp-api";
import { toast } from "sonner";
import { User, Package, Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [customer, setCustomer] = useState(() => mvpApi.getStoredCustomer());
  const [lineProfile, setLineProfile] = useState<{
    displayName: string;
    pictureUrl?: string;
  } | null>(null);

  // Form states
  const [name, setName] = useState(customer?.payerName || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadLineProfile = async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID || "2010346605-YNruenVb";
        const { default: liff } = await import("@line/liff");
        await liff.init({ liffId });
        if (liff.isLoggedIn() && mounted) {
          const p = await liff.getProfile();
          setLineProfile(p);
        }
      } catch (e) {
        console.error("LIFF error", e);
      }
    };
    loadLineProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("กรุณากรอกชื่อและเบอร์โทร");
      return;
    }
    setSaving(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));

    // In a real app we'd call an update API, but here we just update local storage manually
    const updatedCustomer = { ...customer, payerName: name, phone } as Customer;
    if (updatedCustomer.id) {
      localStorage.setItem("vm_customer", JSON.stringify(updatedCustomer));
      setCustomer(updatedCustomer);
      toast.success("บันทึกข้อมูลสำเร็จ");
    } else {
      toast.error("ไม่พบข้อมูลลูกค้า");
    }
    setSaving(false);
  };

  return (
    <main className="vm-public-shell min-h-screen px-5 py-8 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#52625a] hover:text-[#223a2e] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <h1 className="text-2xl font-extrabold text-[#223a2e]">โปรไฟล์ของฉัน</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
          {/* ข้อมูลส่วนตัว */}
          <section className="rounded-[24px] border border-[#dce6de] bg-white/80 p-6 shadow-[0_18px_50px_rgba(35,65,48,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf7ef] text-[#4fa66a]">
                <User className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold text-[#223a2e]">ข้อมูลส่วนตัว</h2>
            </div>

            {lineProfile && (
              <div className="mb-6 flex items-center gap-4 rounded-2xl bg-[#f4fbf6] p-4 border border-[#eaf7ef]">
                {lineProfile.pictureUrl ? (
                  <img src={lineProfile.pictureUrl} alt="LINE" className="h-12 w-12 rounded-full" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#dce6de]" />
                )}
                <div>
                  <p className="text-xs font-bold text-[#52625a]">เชื่อมต่อ LINE แล้ว</p>
                  <p className="font-extrabold text-[#223a2e]">{lineProfile.displayName}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-[#52625a]">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#dce6de] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4fa66a] focus:ring-2 focus:ring-[#4fa66a]/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-[#52625a]">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#dce6de] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#4fa66a] focus:ring-2 focus:ring-[#4fa66a]/20"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="vm-primary-btn w-full justify-center mt-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </section>

          {/* ข้อมูลแพ็กเกจ */}
          <section className="rounded-[24px] border border-[#dce6de] bg-white/80 p-6 shadow-[0_18px_50px_rgba(35,65,48,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7f3] text-[#f2b8a2]">
                <Package className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold text-[#223a2e]">แพ็กเกจของฉัน</h2>
            </div>

            {customer?.planId ? (
              <div className="rounded-2xl border-2 border-[#4fa66a]/30 bg-white p-5 text-center">
                <MascotIcon variant="star" size="3rem" />
                <h3 className="mt-4 text-lg font-extrabold text-[#223a2e] uppercase tracking-wide">
                  {customer.planId} Plan
                </h3>
                <p className="mt-2 text-sm text-[#52625a]">โปรโมชั่นที่สมัครใช้งานอยู่ปัจจุบัน</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#eaf7ef] px-4 py-1.5 text-xs font-bold text-[#4fa66a]">
                  <CheckCircle2 className="h-4 w-4" />
                  สถานะ: ใช้งานได้
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#dce6de] bg-white/50 p-6 text-center">
                <MascotIcon variant="clipboard" size="2.5rem" />
                <p className="mt-3 text-sm font-bold text-[#52625a]">
                  คุณยังไม่มีแพ็กเกจที่เปิดใช้งาน
                </p>
                <Link to="/pricing" className="vm-secondary-btn mt-4 inline-flex">
                  ดูแพ็กเกจทั้งหมด
                </Link>
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-[#f0f9f2] p-4 text-sm text-[#3f8e58]">
              <p className="font-bold mb-1">สิทธิประโยชน์ของคุณ:</p>
              <ul className="list-inside list-disc space-y-1 ml-1 opacity-90">
                <li>NongCallJai โทรถามไถ่คุณตาคุณยาย</li>
                <li>สรุปผลส่งตรงเข้า LINE ให้ครอบครัว</li>
                <li>ตั้งเวลาโทรได้อย่างอิสระ</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Simple icon for inline usage
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
