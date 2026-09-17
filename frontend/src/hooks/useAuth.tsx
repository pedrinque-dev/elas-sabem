import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { api, setToken } from "../services/api";
import type { Admin } from "../types";

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem("elas-sabem:admin-token"));
    if (!hasToken) {
      setLoading(false);
      return;
    }
    api
      .get<Admin>("/auth/me", true)
      .then(setAdmin)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.post<{ token: string; admin: Admin }>("/auth/login", {
      email,
      password,
    });
    setToken(result.token);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
  return ctx;
}
