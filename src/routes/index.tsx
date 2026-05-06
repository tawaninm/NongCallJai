import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/mock-data';
import { roleLabels } from '@/lib/mock-data';
import { useState } from 'react';
import { Activity, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: LoginPage,
});

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
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CareGo Hospital</h1>
            <p className="mt-1 text-sm text-muted-foreground">ระบบติดตามดูแลผู้ป่วยอัจฉริยะ</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">ชื่อผู้ใช้</label>
              <input type="text" value="demo@carego.hospital" readOnly className="w-full rounded-lg border bg-muted px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">รหัสผ่าน</label>
              <input type="password" value="••••••••" readOnly className="w-full rounded-lg border bg-muted px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">เลือกบทบาท (Demo)</label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${selectedRole === role ? 'border-primary bg-teal-light text-primary font-medium' : 'hover:bg-muted'}`}
                  >
                    {roleLabels[role]}
                    {selectedRole === role && <ChevronRight className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="mt-2 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              เข้าสู่ระบบ
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            CareGo Hospital Platform v1.0 — AI Care Follow-up System
          </p>
        </div>
      </div>
    </div>
  );
}
