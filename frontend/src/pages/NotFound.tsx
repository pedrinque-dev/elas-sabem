import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="section state-block">
      <h1>Página não encontrada</h1>
      <p>O conteúdo que você procura não existe ou foi movido.</p>
      <Link to="/" className="btn btn--primary">Voltar para o início</Link>
    </section>
  );
}
