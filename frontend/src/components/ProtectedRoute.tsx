import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./StateBlock";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { admin, loading } = useAuth();
  if (loading) return <Loading label="Verificando sessão" />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
