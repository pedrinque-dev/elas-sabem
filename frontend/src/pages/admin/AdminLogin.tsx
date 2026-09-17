import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AdminLogin() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container admin-login-shell">
        <form className="card" onSubmit={handleSubmit}>
          <h1 style={{ fontSize: "1.6rem" }}>Painel administrativo</h1>
          <p style={{ color: "var(--ink-soft)" }}>Acesso restrito à equipe do Elas Sabem.</p>

          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}
