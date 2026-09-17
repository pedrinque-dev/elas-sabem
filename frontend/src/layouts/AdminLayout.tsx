import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LINKS = [
  { to: "/admin", label: "Visão geral", end: true },
  { to: "/admin/conteudos", label: "Conteúdos" },
  { to: "/admin/historias", label: "Histórias" },
  { to: "/admin/servicos", label: "Serviços" },
  { to: "/admin/relatos", label: "Relatos" },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-sidebar__brand">Elas Sabem — Admin</p>
        <nav aria-label="Navegação administrativa">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{admin?.name}</p>
          <button type="button" className="btn btn--sm btn--ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
