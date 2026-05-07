import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Shield } from "lucide-react";
import { roleLabels } from "@/lib/mock-data";

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
      { title: "CareGo Hospital Platform v2.0" },
      { name: "description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { property: "og:title", content: "CareGo Hospital Platform v2.0" },
      { name: "twitter:title", content: "CareGo Hospital Platform v2.0" },
      { property: "og:description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { name: "twitter:description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap" },
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
    </AuthProvider>
  );
}

function AppLayout() {
  const { isLoggedIn, role, userName } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  if (!isLoggedIn || currentPath === '/') {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-card px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">เข้าสู่ระบบในฐานะ:</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{roleLabels[role]}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userName}</span>
            <button className="relative rounded-lg p-2 hover:bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-risk-red text-[10px] font-bold text-white">3</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
