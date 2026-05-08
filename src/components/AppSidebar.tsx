import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, Columns3, Bot, ClipboardList, Pill,
  CalendarCheck, Heart, BarChart3, Settings, BrainCircuit, LogOut, Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { roleMenuConfig, patients, aiFollowUps } from '@/lib/mock-data';
import type { UserRole } from '@/lib/mock-data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Users, Columns3, Bot, ClipboardList, Pill,
  CalendarCheck, Heart, BarChart3, Settings, BrainCircuit,
};

function getBadgeCount(url: string): number | undefined {
  switch (url) {
    case '/patients': return patients.filter(p => p.riskLevel === 'red' || p.riskLevel === 'yellow').length;
    case '/cases': return patients.filter(p => p.caseStatus === 'pending' || p.caseStatus === 'callback' || p.caseStatus === 'nurse_review').length;
    case '/ai-followup': return aiFollowUps.filter(f => f.humanReviewRequired).length;
    default: return undefined;
  }
}

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { userName, role, logout } = useAuth();

  const visibleItems = roleMenuConfig.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold">CareGo Hospital</p>
          <p className="text-xs text-sidebar-foreground/60">AI Care Platform v2.0</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const active = currentPath === item.url || currentPath.startsWith(item.url + '/');
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const badge = getBadgeCount(item.url);
          return (
            <Link key={item.url} to={item.url} className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}>
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{item.title}</span>
              {badge !== undefined && badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-risk-red text-[10px] font-bold text-white px-1">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">
              {role === 'admin' ? 'ผู้ดูแลระบบ' : role === 'nurse' ? 'พยาบาล' : role === 'doctor' ? 'แพทย์' : role === 'pharmacist' ? 'เภสัชกร' : 'Call Center'}
            </p>
          </div>
          <button onClick={handleLogout} className="rounded-lg p-2 hover:bg-sidebar-accent" title="ออกจากระบบ">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
