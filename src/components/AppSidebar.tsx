import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { MascotIcon } from "@/components/MascotIcon";
import { useAuth } from "@/lib/auth-context";
import { APP_VERSION } from "@/lib/patch-log";

import type { MascotVariant } from "@/components/MascotIcon";

const navItems: { title: string; url: string; mascot: MascotVariant }[] = [
  { title: "Setup overview", url: "/dashboard", mascot: "home" },
  { title: "Service request", url: "/onboarding", mascot: "heart" },
  { title: "LINE connect", url: "/line-connect", mascot: "link" },
  { title: "Admin customers", url: "/admin/customers", mascot: "people" },
  { title: "Billing", url: "/billing", mascot: "money" },
  { title: "Settings", url: "/settings", mascot: "settings" },
  { title: "Patch log", url: "/patch-log", mascot: "log" },
];

interface Props {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function AppSidebar({ mobileOpen = false, setMobileOpen }: Props) {
  const currentPath = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const { userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 shrink-0 flex-col border-r border-white/60 bg-white/72 text-sidebar-foreground shadow-[24px_0_80px_rgba(58,89,64,0.10)] backdrop-blur-2xl transition-transform duration-300 md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/60 px-5 py-5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf7ef] shadow-[0_8px_24px_rgba(35,65,48,0.12)]">
              <MascotIcon variant="call" size="2.2rem" />
            </div>
            <div>
              <p className="text-lg font-extrabold vm-gradient-text">NongCallJai</p>
              <p className="text-xs font-semibold text-muted-foreground">
                by VoiceMed {APP_VERSION}
              </p>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen?.(false)}
            className="rounded-xl p-2 hover:bg-muted md:hidden"
            aria-label="ปิดเมนู"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = currentPath === item.url || currentPath.startsWith(`${item.url}/`);
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setMobileOpen?.(false)}
                className={`sidebar-nav-item ${active ? "sidebar-nav-item-active" : ""}`}
              >
                <MascotIcon variant={item.mascot} size="1.5rem" />
                <span className="flex-1">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/60 p-4">
          <div className="rounded-2xl border bg-white/70 p-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <MascotIcon variant="user" size="1.6rem" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{userName || "Family owner"}</p>
                <p className="text-xs text-muted-foreground">Service setup account</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border bg-white/70 px-3 py-2 text-sm font-bold text-muted-foreground hover:bg-white hover:text-primary"
            >
              <MascotIcon variant="wave" size="1.1rem" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
