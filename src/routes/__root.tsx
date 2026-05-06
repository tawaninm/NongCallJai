import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";

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
      { title: "CareGo Hospital" },
      { name: "description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { property: "og:title", content: "CareGo Hospital" },
      { name: "twitter:title", content: "CareGo Hospital" },
      { property: "og:description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { name: "twitter:description", content: "แพลตฟอร์มติดตามดูแลผู้ป่วยอัจฉริยะ สำหรับโรงพยาบาล" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1a118b2d-7a56-4b32-bd94-fb52b2a5f2b0/id-preview-154f4e2d--ad0a089c-3abf-4c7a-a615-47e77372a4a0.lovable.app-1778057841982.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1a118b2d-7a56-4b32-bd94-fb52b2a5f2b0/id-preview-154f4e2d--ad0a089c-3abf-4c7a-a615-47e77372a4a0.lovable.app-1778057841982.png" },
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
  const { isLoggedIn } = useAuth();
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  if (!isLoggedIn || currentPath === '/') {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-card px-6">
          <div />
          <div className="flex items-center gap-4">
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
