import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/mock-data';
import { roleLabels } from '@/lib/mock-data';
import { useState } from 'react';
import { Activity, ChevronRight, Shield, Users, Stethoscope, Pill, Headphones } from 'lucide-react';

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
  nurse: 'ติดตามเคส ดูแลผู้ป่วย จัดการแผน',
  doctor: 'ตรวจสอบเคส Red/Yellow ให้คำแนะนำ',
  pharmacist: 'ตรวจสอบปัญหายา ให้คำปรึกษา',
  callcenter: 'จัดการคิวโทร ผลติดตาม AI',
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('nurse');

  const handleLogin = () => {
    login(selectedRole);
    navigate({ to: '/dashboard' });
  };

  const roles: UserRole[] = ['admin', 'nurse', 'doctor', 'pharmacist', 'callcenter'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-teal-light to-background">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border bg-card p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CareGo Hospital Platform</h1>
            <p className="mt-1 text-sm text-muted-foreground">ระบบติดตามดูแลผู้ป่วยอัจฉริยะ — AI Care Follow-up</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">ชื่อผู้ใช้</label>
              <input type="text" value="demo@carego.hospital" readOnly className="w-full rounded-lg border bg-muted/50 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">รหัสผ่าน</label>
              <input type="password" value="••••••••" readOnly className="w-full rounded-lg border bg-muted/50 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">เลือกบทบาท (Demo Mode)</label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => {
                  const Icon = roleIcons[role];
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${selectedRole === role ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent hover:bg-muted/50'}`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${selectedRole === role ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{roleLabels[role]}</p>
                        <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
                      </div>
                      {selectedRole === role && <ChevronRight className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="mt-2 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              เข้าสู่ระบบ
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            CareGo Hospital Platform v2.0 — AI Care Follow-up System
          </p>
        </div>
      </div>
    </div>
  );
}
