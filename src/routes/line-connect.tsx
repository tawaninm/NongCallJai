import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, Copy, RefreshCw, Smartphone } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { NongCallJaiMascot } from "@/components/NongCallJaiMascot";
import { type LineLink, type LineLinkStatus, mvpApi } from "@/lib/mvp-api";

export const Route = createFileRoute("/line-connect")({
  component: LineConnectPage,
});

function LineConnectPage() {
  const navigate = useNavigate();
  const customer = mvpApi.getStoredCustomer();
  const [lineLink, setLineLink] = useState<LineLink | null>(null);
  const [linkStatus, setLinkStatus] = useState<LineLinkStatus["status"]>("pending");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [liffStatus, setLiffStatus] = useState<"idle" | "linking" | "success" | "error">("idle");
  const [liffError, setLiffError] = useState("");
  const liffToken = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") ?? "";
  }, []);

  useEffect(() => {
    if (!liffToken || liffStatus !== "idle") return;
    let cancelled = false;

    const completeFromLiff = async () => {
      setLiffStatus("linking");
      setLiffError("");
      try {
        const liffId = import.meta.env.VITE_LIFF_ID || "2010122231-05nw3NWg";
        const { default: liff } = await import("@line/liff");
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }

        const profile = await liff.getProfile();
        await mvpApi.completeLineLink({
          token: liffToken,
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        });

        if (cancelled) return;
        setLiffStatus("success");
        toast.success("LINE connected");
        if (liff.isInClient()) {
          window.setTimeout(() => liff.closeWindow(), 1200);
        }
      } catch (error) {
        if (cancelled) return;
        setLiffStatus("error");
        setLiffError(error instanceof Error ? error.message : "LINE connection failed");
      }
    };

    completeFromLiff();

    return () => {
      cancelled = true;
    };
  }, [liffStatus, liffToken]);

  const startNewLink = useCallback(async () => {
    if (!customer) return;
    setLoading(true);
    setQrDataUrl("");
    try {
      const nextLink = await mvpApi.startLineLink(customer.id);
      setLineLink(nextLink);
      setLinkStatus(nextLink.status);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    if (!customer || lineLink) return;
    startNewLink();
  }, [customer, lineLink, startNewLink]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!lineLink?.liffUrl) return;
    let cancelled = false;
    import("qrcode")
      .then((QRCode) =>
        QRCode.toDataURL(lineLink.liffUrl || "", {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 320,
          color: {
            dark: "#17221c",
            light: "#ffffff",
          },
        }),
      )
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) toast.error("QR generation failed");
      });
    return () => {
      cancelled = true;
    };
  }, [lineLink?.liffUrl]);

  useEffect(() => {
    if (!lineLink || linkStatus !== "pending") return;
    const linkId = lineLink.linkId || lineLink.id;
    const interval = window.setInterval(async () => {
      try {
        const status = await mvpApi.getLineLinkStatus(linkId);
        setLinkStatus(status.status);
        if (status.status === "linked") {
          toast.success("LINE connected");
          window.setTimeout(() => navigate({ to: "/waiting-setup" }), 900);
        }
        if (status.status === "expired") {
          toast.info("QR expired. Creating a new one.");
          startNewLink();
        }
      } catch {
        // Keep the QR visible; a later poll can recover.
      }
    }, lineLink.pollIntervalMs ?? 2500);
    return () => window.clearInterval(interval);
  }, [lineLink, linkStatus, navigate, startNewLink]);

  const remainingSeconds = useMemo(() => {
    if (!lineLink?.expiresAt) return 0;
    return Math.max(0, Math.ceil((Date.parse(lineLink.expiresAt) - now) / 1000));
  }, [lineLink?.expiresAt, now]);

  const remainingLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = String(remainingSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingSeconds]);

  if (liffToken) {
    return (
      <main className="vm-public-shell flex min-h-screen items-center justify-center px-5">
        <section className="vm-glass w-full max-w-md rounded-[2rem] p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#06c755]/10">
            {liffStatus === "success" ? (
              <CheckCircle2 className="h-10 w-10 text-[#06c755]" />
            ) : (
              <Smartphone className="h-10 w-10 text-primary" />
            )}
          </div>
          <h1 className="mt-6 text-3xl font-extrabold">
            {liffStatus === "success"
              ? "LINE connected"
              : liffStatus === "error"
                ? "LINE connection needs retry"
                : "Connecting LINE"}
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {liffStatus === "success"
              ? "You can return to the website. The QR page will continue automatically."
              : liffStatus === "error"
                ? liffError || "Please reopen the QR link and try again."
                : "Please wait while NongCallJai links this LINE account for family summaries."}
          </p>
          {liffStatus === "error" && (
            <button onClick={() => setLiffStatus("idle")} className="vm-primary-btn mt-6 w-full">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
        </section>
      </main>
    );
  }

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

  const openLine = () => {
    if (!lineLink?.liffUrl) return;
    window.location.href = lineLink.liffUrl;
  };

  return (
    <main className="vm-public-shell px-5 py-8 md:px-10">
      <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <span className="vm-pill">
            <MascotIcon variant="link" size="1.1rem" />
            LINE OA connection
          </span>
          <h1 className="mt-5 text-4xl font-extrabold">
            เชื่อม LINE แบบสแกน QR แล้วไปต่ออัตโนมัติ
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            ขั้นตอนนี้สำหรับคนในครอบครัว ไม่ใช่ผู้สูงอายุ เมื่อผูก LINE สำเร็จ ระบบจะอัปเดตสถานะ
            setup และเตรียม automation ถัดไปให้ทีม Voicebot/Botnoi และ LINE OA
          </p>
          <NongCallJaiMascot compact variant="point" />
        </section>

        <section className="rounded-[2rem] vm-glass p-6 md:p-8">
          <div className="rounded-[2rem] border bg-white/75 p-6 text-center">
            <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-[1.75rem] border border-primary/15 bg-white p-4 shadow-sm">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="LINE LIFF QR code" className="h-full w-full" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-3xl border-2 border-dashed border-primary/30 bg-[#f0f9f2]">
                  <MascotIcon variant="qr" size="6rem" />
                </div>
              )}
            </div>
            <h2 className="mt-6 text-2xl font-extrabold">QR สำหรับเปิด LIFF</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              สแกนเพื่อผูก LINE สำหรับรับสรุปจาก NongCallJai หน้าเว็บจะเช็กสถานะให้อัตโนมัติ
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatusPill
                icon={<Clock className="h-4 w-4" />}
                label="Expires"
                value={loading ? "..." : remainingLabel}
              />
              <StatusPill
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Status"
                value={linkStatus}
              />
              <StatusPill
                icon={<RefreshCw className="h-4 w-4" />}
                label="Poll"
                value={`${Math.round((lineLink?.pollIntervalMs ?? 2500) / 1000)}s`}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-secondary/70 p-4 text-left text-xs text-muted-foreground">
              <p className="font-bold text-foreground">LIFF URL</p>
              <p className="mt-2 break-all">{loading ? "กำลังสร้าง link..." : lineLink?.liffUrl}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button onClick={copyLink} className="vm-secondary-btn">
                <Copy className="h-4 w-4" />
                คัดลอก link
              </button>
              <button onClick={openLine} className="vm-secondary-btn">
                <Smartphone className="h-4 w-4" />
                Open LINE
              </button>
              <button onClick={startNewLink} disabled={loading} className="vm-secondary-btn">
                <RefreshCw className="h-4 w-4" />
                Refresh QR
              </button>
            </div>

            <button
              onClick={() => navigate({ to: "/waiting-setup" })}
              className="vm-primary-btn mt-3 w-full"
            >
              ไปหน้ารอสถานะ
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#06c755]" />
              Seamless mode: auto-polling, auto-refresh, auto-continue after linked
            </div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm text-muted-foreground">
            <MascotIcon variant="chat" size="1.5rem" className="mt-0.5" />
            ขั้นต่อไปที่ต้องเตรียมจากทีมคุณ: LINE LIFF ID, Channel Secret, Channel Access Token และ
            Botnoi outbound/callback API ที่ใช้จริง
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusPill({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white/80 px-3 py-2 text-left">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-extrabold text-foreground">{value}</p>
    </div>
  );
}
