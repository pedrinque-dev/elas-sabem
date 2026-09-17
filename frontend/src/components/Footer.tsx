import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__brand">Elas Sabem</p>
          <p className="site-footer__tagline">Informação. Prevenção. Autonomia. Rede.</p>
          <p className="site-footer__note">
            Projeto de extensão universitária. Este site oferece informação educativa e não
            substitui atendimento médico, psicológico ou jurídico.
          </p>
        </div>

        <nav aria-label="Explorar">
          <h3>Explorar</h3>
          <ul>
            <li><Link to="/entender">Entender</Link></li>
            <li><Link to="/cuidar">Cuidar</Link></li>
            <li><Link to="/proteger">Proteger</Link></li>
            <li><Link to="/buscar-ajuda">Buscar ajuda</Link></li>
            <li><Link to="/vozes">Vozes</Link></li>
          </ul>
        </nav>

        <nav aria-label="Mais">
          <h3>Mais</h3>
          <ul>
            <li><Link to="/dados">Dados</Link></li>
            <li><Link to="/educacao">Educação</Link></li>
            <li><Link to="/como-ajudar">Como posso ajudar</Link></li>
            <li><Link to="/nina">Assistente Nina</Link></li>
          </ul>
        </nav>

        <div>
          <h3>Em emergência</h3>
          <p className="site-footer__note">
            Em situação de risco imediato, procure a rede de emergência local. Consulte a área{" "}
            <Link to="/buscar-ajuda">Buscar ajuda</Link> para encontrar serviços de apoio.
          </p>
          <Link to="/admin/login" className="site-footer__admin">Painel administrativo</Link>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} Elas Sabem — projeto de extensão universitária (ADS).</p>
      </div>
    </footer>
  );
}
