import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserRole } from "./mock-data";

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

const STORAGE_KEY = "carego_auth";

const roleNames: Record<UserRole, string> = {
  admin: "ผู้ดูแลระบบ",
  nurse: "พว.สมหญิง",
  doctor: "นพ.วิชัย",
  pharmacist: "ภก.สมศรี",
  callcenter: "คุณสมใจ",
};

const defaultAuth: AuthState = { isLoggedIn: false, role: "nurse", userName: "" };

function loadAuth(): AuthState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AuthState;
      if (parsed.isLoggedIn && parsed.role && parsed.userName) {
        return parsed;
      }
    }
  } catch {
    // ignore corrupted storage
  }
  return defaultAuth;
}

function saveAuth(state: AuthState) {
  try {
    if (state.isLoggedIn) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth);

  // Sync to localStorage whenever auth changes
  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const login = (role: UserRole) => {
    const newAuth: AuthState = { isLoggedIn: true, role, userName: roleNames[role] };
    setAuth(newAuth);
  };

  const logout = () => {
    setAuth(defaultAuth);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ ...auth, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
