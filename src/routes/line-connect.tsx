import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Copy } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NongCallJaiMascot } from "@/components/NongCallJaiMascot";
import { type LineLink, mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/line-connect")({
  component: LineConnectPage,
});

function LineConnectPage() {
  const navigate = useNavigate();
  const customer = mvpApi.getStoredCustomer();
  const [lineLink, setLineLink] = useState<LineLink | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer || lineLink) return;
    setLoading(true);
    mvpApi
      .startLineLink(customer.id)
      .then(setLineLink)
      .finally(() => setLoading(false));
  }, [customer, lineLink]);

  if (!customer) {
    return (
      <main className="vm-public-shell flex min-h-screen items-center justify-center px-5">
        <div className="vm-glass max-w-md rounded-[2rem] p-8 text-center">
          <h1 className="text-3xl font-extrabold">ยังไม่มีข้อมูลสมัครบริการ</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            กรุณาเลือกแพ็กเกจและกรอกข้อมูลก่อนเชื่อม LINE
          </p>
          <Link to="/checkout" className="vm-primary-btn mt-6">
            ไปสมัครบริการ
          </Link>
        </div>
      </main>
    );
  }

  const copyLink = async () => {
    if (!lineLink?.liffUrl) return;
    await navigator.clipboard.writeText(lineLink.liffUrl);
    toast.success("คัดลอก LIFF link แล้ว");
  };

  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="link" size="1.1rem" />
            LINE OA connection
          </span>
          <h1 className="mt-5 text-4xl font-extrabold">เชื่อม LINE สำหรับรับสรุปหลังการโทร</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            ขั้นตอนนี้สำหรับคนในครอบครัว ไม่ใช่ผู้สูงอายุ เมื่อเชื่อมแล้วทีม LINE OA
            จะใช้ข้อมูลนี้ส่ง feedback การโทร สรุป และ alert ที่ควรตรวจสอบ
          </p>
          <NongCallJaiMascot compact variant="point" />
        </section>

        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <div className="rounded-[2rem] border bg-white/75 p-6 text-center">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-[#f0f9f2]">
              <MascotIcon variant="qr" size="6rem" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold">QR สำหรับเปิด LIFF</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              MVP แสดง QR placeholder และ LIFF link token ให้ทีม LINE ใช้ต่อ
            </p>
            <div className="mt-5 rounded-2xl bg-secondary/70 p-4 text-left text-xs text-muted-foreground">
              <p className="font-bold text-foreground">LIFF URL</p>
              <p className="mt-2 break-all">{loading ? "กำลังสร้าง link..." : lineLink?.liffUrl}</p>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={copyLink} className="vm-secondary-btn flex-1">
                <Copy className="h-4 w-4" />
                คัดลอก link
              </button>
              <button
                onClick={() => navigate({ to: "/waiting-setup" })}
                className="vm-primary-btn flex-1"
              >
                ไปหน้ารอสถานะ
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm text-muted-foreground">
            <MascotIcon variant="chat" size="1.5rem" className="mt-0.5" />
            LINE OA, Rich Menu, LIFF config และ push message จริงเป็นงานของทีม LINE
          </div>
        </section>
      </div>
    </main>
  );
}
