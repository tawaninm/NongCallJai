import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState, useNavigate } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect, useState, useSyncExternalStore } from "react";
import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Shield, Stethoscope, Users, Pill, Headphones, Search } from "lucide-react";
import { roleLabels } from "@/lib/mock-data";
import type { UserRole } from "@/lib/mock-data";
import { BotnoiChat } from "@/components/BotnoiChat";
import { NotificationDropdown } from "@/components/prototype/NotificationDropdown";
import { mockStore } from "@/lib/mock-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">ไม่พบหน้าที่ต้องการ</h2>
        <p className="mt-2 text-sm text-muted-foreground">หน้าที่คุณค้นหาไม่มีอยู่ในระบบ</p>
        <div className="mt-6">
          <Link to="/dashboard" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            กลับแดชบอร์ด
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareGo Hospital Platform v2.1" },
      { name: "description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
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

const roleBadgeColors: Record<UserRole, string> = {
  admin: 'bg-slate-100 text-slate-700 border border-slate-300',
  nurse: 'bg-teal-light text-teal border border-teal/20',
  doctor: 'bg-blue-50 text-blue-700 border border-blue-200',
  pharmacist: 'bg-purple-50 text-purple-700 border border-purple-200',
  callcenter: 'bg-orange-50 text-orange-700 border border-orange-200',
};

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  nurse: Users,
  doctor: Stethoscope,
  pharmacist: Pill,
  callcenter: Headphones,
};

function AppLayout() {
  const { isLoggedIn, role, userName } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useSyncExternalStore(mockStore.subscribe, mockStore.getUnreadCount, mockStore.getUnreadCount);

  useEffect(() => {
    if (!isLoggedIn && currentPath !== '/') {
      navigate({ to: '/' });
    }
  }, [isLoggedIn, currentPath, navigate]);

  if (!isLoggedIn || currentPath === '/') {
    return <Outlet />;
  }

  const RoleIcon = roleIcons[role];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar matching reference screenshots */}
        <header className="flex h-14 items-center justify-between border-b bg-card px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-primary">CareGo Platform</span>
            <span className="hidden md:block text-sm text-muted-foreground">ศูนย์ติดตามผู้ป่วยแบบเรียลไทม์</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="ค้นหาผู้ป่วย, แผนการดูแล..." className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48" />
            </div>
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative rounded-lg p-2 hover:bg-muted transition-colors" title={`${unreadCount} การแจ้งเตือน`}>
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-risk-red text-[10px] font-bold text-white px-1 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
            </div>
            {/* User avatar */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadgeColors[role]}`}>
                <RoleIcon className="h-3.5 w-3.5" />
                {roleLabels[role]}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
