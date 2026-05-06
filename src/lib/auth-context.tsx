import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from './mock-data';

interface AuthState {
  isLoggedIn: boolean;
  role: UserRole;
  userName: string;
}

interface AuthContextType extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const roleNames: Record<UserRole, string> = {
  admin: 'ผู้ดูแลระบบ',
  nurse: 'พว.สมหญิง',
  doctor: 'นพ.วิชัย',
  pharmacist: 'ภก.สมศรี',
  callcenter: 'คุณสมใจ',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, role: 'nurse', userName: '' });

  const login = (role: UserRole) => setAuth({ isLoggedIn: true, role, userName: roleNames[role] });
  const logout = () => setAuth({ isLoggedIn: false, role: 'nurse', userName: '' });

  return <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
