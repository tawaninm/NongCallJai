import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, Columns3, Bot, ClipboardList, Pill,
  CalendarCheck, Heart, BarChart3, Settings, BrainCircuit, LogOut, Activity,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { title: 'แดชบอร์ด', url: '/dashboard', icon: LayoutDashboard },
  { title: 'คิวผู้ป่วย', url: '/patients', icon: Users },
  { title: 'จัดการเคส', url: '/cases', icon: Columns3 },
  { title: 'ผลติดตาม AI', url: '/ai-followup', icon: Bot },
  { title: 'แผนการดูแล', url: '/care-plans', icon: ClipboardList },
  { title: 'การใช้ยา', url: '/medication', icon: Pill },
  { title: 'นัดหมาย', url: '/appointments', icon: CalendarCheck },
  { title: 'แจ้งญาติ', url: '/family', icon: Heart },
  { title: 'รายงาน', url: '/reports', icon: BarChart3 },
  { title: 'AI Agent Center', url: '/ai-agents', icon: BrainCircuit },
  { title: 'ตั้งค่า', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const { userName, role, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-bold">CareGo Hospital</p>
          <p className="text-xs text-sidebar-foreground/60">AI Care Platform</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = currentPath === item.url || currentPath.startsWith(item.url + '/');
          return (
            <Link key={item.url} to={item.url} className={`sidebar-nav-item ${active ? 'sidebar-nav-item-active' : ''}`}>
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">{role === 'admin' ? 'ผู้ดูแลระบบ' : role === 'nurse' ? 'พยาบาล' : role === 'doctor' ? 'แพทย์' : role === 'pharmacist' ? 'เภสัชกร' : 'Call Center'}</p>
          </div>
          <button onClick={logout} className="rounded-lg p-2 hover:bg-sidebar-accent" title="ออกจากระบบ">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
