import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { BotnoiChat } from "@/components/BotnoiChat";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { APP_VERSION } from "@/lib/patch-log";
import { roleLabels } from "@/lib/voicemed-data";
import { getAlertTone, getElderName, voiceMedStore } from "@/lib/voicemed-store";
import { motion, AnimatePresence } from "framer-motion";
import appCss from "../styles.css?url";

const PUBLIC_ROUTES = new Set([
  "/",
  "/pricing",
  "/checkout",
  "/onboarding",
  "/line-connect",
  "/waiting-setup",
  "/patch-log",
]);

function NotFoundComponent() {
  return (
    <div className="vm-public-shell flex items-center justify-center px-4">
      <div className="vm-glass max-w-md rounded-3xl p-8 text-center">
        <p className="text-7xl font-extrabold vm-gradient-text">404</p>
        <h1 className="mt-4 text-2xl font-bold">ไม่พบหน้าที่ต้องการ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          หน้านี้อาจถูกย้ายระหว่างการรีแบรนด์เป็น VoiceMed
        </p>
        <Link to="/" className="vm-primary-btn mt-6">
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `NongCallJai by VoiceMed ${APP_VERSION} · AI Voice Companion` },
      {
        name: "description",
        content:
          "NongCallJai by VoiceMed บริการ AI Voice Companion สำหรับครอบครัวที่ต้องการให้ระบบโทรถามไถ่ผู้สูงอายุ และส่งสรุปผ่าน LINE OA อย่างปลอดภัย",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <AppLayout />
      <Toaster position="top-right" richColors />
      <BotnoiChat />
    </AuthProvider>
  );
}

function AppLayout() {
  const { isLoggedIn, role, userName } = useAuth();
  const currentPath = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getUnreadCount,
    voiceMedStore.getUnreadCount,
  );

  const isPublic = PUBLIC_ROUTES.has(currentPath);

  useEffect(() => {
    if (!isLoggedIn && !isPublic) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn, isPublic, navigate]);

  if (isPublic || !isLoggedIn) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/60 bg-white/70 px-4 backdrop-blur-2xl md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="-ml-2 rounded-xl p-2 hover:bg-muted md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="เปิดเมนู"
            >
              <MascotIcon variant="menu" size="1.5rem" />
            </button>
            <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf7ef] md:flex">
              <MascotIcon variant="call" size="1.8rem" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold vm-gradient-text">
                VoiceMed Family Platform
              </p>
              <p className="hidden truncate text-xs text-muted-foreground md:block">
                จัดการ Voice bot, Chatbot, แผนดูแล และรายงานให้ครอบครัว
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-full border bg-white/70 px-3 py-2 backdrop-blur-xl lg:flex">
              <MascotIcon variant="search" size="1.2rem" />
              <input
                className="w-56 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="ค้นหาผู้สูงอายุ, log, alert..."
              />
            </div>
              <button
                onClick={() => setNotifOpen((open) => !open)}
                className="relative rounded-xl border bg-white/70 p-2 backdrop-blur-xl hover:bg-white"
                aria-label="เปิดการแจ้งเตือน"
              >
                <MascotIcon variant="bell" size="1.5rem" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            <div className="hidden items-center gap-2 rounded-full border bg-white/70 px-3 py-2 text-xs font-bold text-primary backdrop-blur-xl sm:flex">
              <MascotIcon variant="user" size="1.3rem" />
              <span>{userName || roleLabels[role]}</span>
            </div>
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <VoiceMedNotifications open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}

function VoiceMedNotifications({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const alerts = useSyncExternalStore(
    voiceMedStore.subscribe,
    voiceMedStore.getFamilyAlerts,
    voiceMedStore.getFamilyAlerts,
  ).filter((alert) => alert.status !== "resolved");

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed right-4 top-20 z-50 w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl vm-glass shadow-2xl md:right-6"
      >
        <div className="flex items-center justify-between border-b border-white/60 px-4 py-3 bg-white/40">
          <div>
            <p className="text-sm font-bold">การแจ้งเตือนครอบครัว</p>
            <p className="text-xs text-muted-foreground">สิ่งที่ VoiceMed แนะนำให้ครอบครัวดูต่อ</p>
          </div>
          <MascotIcon variant="star" size="1.2rem" />
        </div>
        <div className="max-h-80 divide-y overflow-auto">
          {alerts.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              ไม่มีการแจ้งเตือนใหม่
            </div>
          )}
          {alerts.map((alert) => (
            <button
              key={alert.id}
              onClick={() => {
                voiceMedStore.markAlertReviewed(alert.id);
                navigate({ to: "/alerts" });
                onClose();
              }}
              className="w-full p-4 text-left transition hover:bg-white/70"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getAlertTone(alert)}`}
                  >
                    {alert.severity}
                  </span>
                  <p className="mt-2 text-sm font-bold">{alert.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getElderName(alert.elderProfileId)} · {alert.summary}
                  </p>
                </div>
                {alert.status === "new" && (
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
