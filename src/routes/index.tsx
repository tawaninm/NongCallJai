import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/mock-data';
import { roleLabels } from '@/lib/mock-data';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Activity, ChevronRight, Shield, Users, Stethoscope, Pill,
  Headphones, Lock, BadgeCheck, Info,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LoginPage,
});

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  nurse: Users,
  doctor: Stethoscope,
  pharmacist: Pill,
  callcenter: Headphones,
};

const roleDescriptions: Record<UserRole, string> = {
  admin: 'จัดการระบบ ผู้ใช้ สิทธิ์ และ AI Agent',
  nurse: 'ติดตามเคส ดูแลผู้ป่วย จัดการแผนการดูแล',
  doctor: 'ตรวจสอบเคส Red/Yellow ให้คำแนะนำทางคลินิก',
  pharmacist: 'ตรวจสอบปัญหาการใช้ยา ให้คำปรึกษา',
  callcenter: 'จัดการคิวโทร ผลติดตาม AI ติดตามนัด',
};

// Where each role lands after login
const roleLandingRoutes: Record<UserRole, string> = {
  admin: '/dashboard',
  nurse: '/dashboard',
  doctor: '/dashboard',
  pharmacist: '/medication',
  callcenter: '/ai-followup',
};

const roleBgActive: Record<UserRole, string> = {
  admin: 'border-slate-500 bg-slate-50',
  nurse: 'border-teal-500 bg-teal-50',
  doctor: 'border-blue-500 bg-blue-50',
  pharmacist: 'border-purple-500 bg-purple-50',
  callcenter: 'border-orange-500 bg-orange-50',
};

const roleIconActive: Record<UserRole, string> = {
  admin: 'bg-slate-600 text-white',
  nurse: 'bg-teal-600 text-white',
  doctor: 'bg-blue-600 text-white',
  pharmacist: 'bg-purple-600 text-white',
  callcenter: 'bg-orange-600 text-white',
};

const roleIconInactive = 'bg-muted text-muted-foreground';

const roleColors: Record<UserRole, string> = {
  admin: 'from-slate-600 to-slate-800',
  nurse: 'from-teal-500 to-teal-700',
  doctor: 'from-blue-500 to-blue-700',
  pharmacist: 'from-purple-500 to-purple-700',
  callcenter: 'from-orange-500 to-orange-700',
};

function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('nurse');

  // If already logged in, redirect to dashboard immediately
  useEffect(() => {
    if (isLoggedIn) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = () => {
    try {
      login(selectedRole);
      const landingRoute = roleLandingRoutes[selectedRole];
      navigate({ to: landingRoute });
      toast.success(`เข้าสู่ระบบสำเร็จ — ${roleLabels[selectedRole]}`);
    } catch {
      toast.error('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    }
  };

  const roles: UserRole[] = ['admin', 'nurse', 'doctor', 'pharmacist', 'callcenter'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-teal-light to-background">
      <div className="w-full max-w-lg px-4">
        <div className="rounded-2xl border bg-card p-8 shadow-xl">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CareGo Hospital Platform</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              ระบบติดตามดูแลผู้ป่วยอัจฉริยะ — AI Care Follow-up
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BadgeCheck className="h-3.5 w-3.5" />
              Ver 2.1 — Demo Mode
            </div>
          </div>

          <div className="space-y-4">
            {/* Credentials (demo, read-only) */}
            <div className="rounded-xl bg-muted/50 px-4 py-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Demo credentials — read only
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">ชื่อผู้ใช้</p>
                  <p className="text-sm font-medium">demo@carego.hospital</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">รหัสผ่าน</p>
                  <p className="text-sm font-medium">••••••••</p>
                </div>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <p className="mb-2 text-sm font-semibold">
                เลือกบทบาท
                <span className="ml-2 text-xs font-normal text-muted-foreground">— Demo Mode</span>
              </p>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => {
                  const Icon = roleIcons[role];
                  const isActive = selectedRole === role;
                  return (
                    <button
                      key={role}
                      id={`role-btn-${role}`}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all
                        ${isActive ? roleBgActive[role] : 'border-transparent hover:bg-muted/50'}`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all
                        ${isActive ? roleIconActive[role] : roleIconInactive}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{roleLabels[role]}</p>
                        <p className="text-xs text-muted-foreground truncate">{roleDescriptions[role]}</p>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role info banner */}
            <div className={`rounded-xl bg-gradient-to-r ${roleColors[selectedRole]} p-4 text-white transition-all`}>
              <div className="flex items-start gap-3">
                <Info className="h-4 w-4 mt-0.5 shrink-0 opacity-80" />
                <p className="text-xs leading-relaxed opacity-90">
                  <span className="font-semibold">{roleLabels[selectedRole]}</span>
                  {' '}— คุณจะเข้าสู่ Dashboard เฉพาะบทบาทนี้ และเห็นเมนูที่สอดคล้องกับสิทธิ์ที่กำหนด
                </p>
              </div>
            </div>

            {/* Login button */}
            <button
              id="login-submit-btn"
              onClick={handleLogin}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl flex items-center justify-center gap-2"
            >
              เข้าสู่ระบบ
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            CareGo Hospital Platform v2.1 — AI Care Follow-up System
          </p>
        </div>
      </div>
    </div>
  );
}
