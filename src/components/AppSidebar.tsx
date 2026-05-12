import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Columns3,
  Bot,
  ClipboardList,
  Pill,
  CalendarCheck,
  Heart,
  BarChart3,
  Settings,
  BrainCircuit,
  LogOut,
  Activity,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  FileClock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { roleMenuConfig } from "@/lib/mock-data";
import type { AIFollowUp, Patient, UserRole } from "@/lib/mock-data";
import { useSyncExternalStore, useState } from "react";
import { mockStore } from "@/lib/mock-store";
import { APP_VERSION } from "@/lib/patch-log";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Columns3,
  Bot,
  ClipboardList,
  Pill,
  CalendarCheck,
  Heart,
  BarChart3,
  Settings,
  BrainCircuit,
  UserPlus,
  FileClock,
};

function getBadgeCount(
  url: string,
  patients: Patient[],
  aiFollowUps: AIFollowUp[],
): number | undefined {
  switch (url) {
    case "/patients":
      return patients.filter((p) => p.riskLevel === "red" || p.riskLevel === "yellow").length;
    case "/cases":
      return patients.filter(
        (p) =>
          p.caseStatus === "pending" ||
          p.caseStatus === "callback" ||
          p.caseStatus === "nurse_review",
      ).length;
    case "/ai-followup":
      return aiFollowUps.filter((f) => f.humanReviewRequired).length;
    default:
      return undefined;
  }
}

interface Props {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function AppSidebar({ mobileOpen = false, setMobileOpen }: Props) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { userName, role, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const patients = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getPatients,
    mockStore.getPatients,
  );
  const aiFollowUps = useSyncExternalStore(
    mockStore.subscribe,
    mockStore.getFollowUps,
    mockStore.getFollowUps,
  );

  const visibleItems = roleMenuConfig.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen ${isCollapsed ? "w-20" : "w-64"} flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:static md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} shrink-0`}
      >
        <div
          className={`flex items-center ${isCollapsed ? "justify-center px-2" : "justify-between px-5"} py-5 border-b border-sidebar-border relative`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
              <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-sm font-bold">CareGo Hospital</p>
                <p className="text-xs text-sidebar-foreground/60">AI Care Platform {APP_VERSION}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border bg-background text-foreground shadow-sm hover:bg-muted z-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden md:flex absolute -right-3 top-6 h-6 w-6 items-center justify-center rounded-full border bg-background text-foreground shadow-sm hover:bg-muted z-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const active = currentPath === item.url || currentPath.startsWith(item.url + "/");
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const badge = getBadgeCount(item.url, patients, aiFollowUps);
            return (
              <Link
                key={item.url}
                to={item.url}
                onClick={() => setMobileOpen?.(false)}
                className={`sidebar-nav-item ${active ? "sidebar-nav-item-active" : ""} ${isCollapsed ? "justify-center px-0" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="flex-1 whitespace-nowrap">{item.title}</span>}
                {badge !== undefined && badge > 0 && (
                  <span
                    className={`flex items-center justify-center rounded-full bg-risk-red font-bold text-white ${isCollapsed ? "absolute top-1 right-1 h-4 w-4 text-[9px]" : "h-5 min-w-5 text-[10px] px-1"}`}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div
          className={`border-t border-sidebar-border py-4 ${isCollapsed ? "px-2 flex flex-col items-center gap-4" : "px-4 flex items-center justify-between"}`}
        >
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {role === "admin"
                  ? "ผู้ดูแลระบบ"
                  : role === "nurse"
                    ? "พยาบาล"
                    : role === "doctor"
                      ? "แพทย์"
                      : role === "pharmacist"
                        ? "เภสัชกร"
                        : "Call Center"}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 hover:bg-sidebar-accent shrink-0"
            title="ออกจากระบบ"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
