import type { FormEvent } from "react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { QuickExit } from "./QuickExit";

const NAV_LINKS = [
  { to: "/entender", label: "Entender" },
  { to: "/cuidar", label: "Cuidar" },
  { to: "/proteger", label: "Proteger" },
  { to: "/buscar-ajuda", label: "Buscar ajuda" },
  { to: "/vozes", label: "Vozes" },
  { to: "/dados", label: "Dados" },
  { to: "/educacao", label: "Educação" },
  { to: "/como-ajudar", label: "Como ajudar" },
];

export function Header() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <NavLink to="/" className="site-header__brand" aria-label="Elas Sabem, página inicial">
          <img src="/logo.png" alt="" className="site-header__logo" />
        </NavLink>

        <div className="site-header__mobile-actions">
          <button
            className="site-header__toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">Abrir menu de navegação</span>
            <span aria-hidden="true">{menuOpen ? "Fechar" : "Menu"}</span>
          </button>

          <div className="site-header__quick-exit-mobile">
            <QuickExit />
          </div>
        </div>

        <nav
          id="primary-navigation"
          className={`site-header__nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navegação principal"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "is-active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}

          <form className="site-header__search" role="search" onSubmit={handleSearch}>
            <label htmlFor="global-search" className="sr-only">
              Buscar no Elas Sabem
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Buscar conteúdos, histórias, serviços…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn--sm btn--secondary">
              Buscar
            </button>
          </form>

          <NavLink to="/nina" className="btn btn--sm btn--primary site-header__nina">
            Falar com a Nina
          </NavLink>
        </nav>

        <div className="site-header__desktop-exit">
          <QuickExit />
        </div>
      </div>
    </header>
  );
}
