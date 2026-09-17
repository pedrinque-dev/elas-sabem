import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import type { SearchResults } from "../types";
import { Loading, EmptyState } from "../components/StateBlock";

export function Busca() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.get<SearchResults>(`/search?q=${encodeURIComponent(q)}`).then(setResults).finally(() => setLoading(false));
  }, [q]);

  const totalResults =
    (results?.contents.length ?? 0) +
    (results?.stories.length ?? 0) +
    (results?.services.length ?? 0) +
    (results?.materials.length ?? 0);

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Busca</p>
        <h1>Resultados para "{q}"</h1>

        {loading ? (
          <Loading label="Buscando" />
        ) : !results || totalResults === 0 ? (
          <EmptyState title="Nenhum resultado encontrado" description="Tente outros termos, ou converse com a Nina para uma busca em linguagem natural." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {results.contents.length > 0 && (
              <div>
                <h3>Conteúdos</h3>
                <div className="grid grid--3">
                  {results.contents.map((c) => (
                    <Link key={c.id} to={`/conteudo/${c.slug}`} className="content-card">
                      <span className="tag">{c.area}</span>
                      <h3>{c.title}</h3>
                      <p>{c.summary}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.stories.length > 0 && (
              <div>
                <h3>Histórias</h3>
                <div className="grid grid--3">
                  {results.stories.map((s) => (
                    <Link key={s.id} to={`/vozes/${s.id}`} className="story-card">
                      <span className="tag tag--teal">{s.theme}</span>
                      <h3>{s.title}</h3>
                      <p>{s.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.services.length > 0 && (
              <div>
                <h3>Serviços</h3>
                <ul>
                  {results.services.map((s) => (
                    <li key={s.id}><Link to="/buscar-ajuda">{s.name} — {s.city}/{s.state}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            {results.materials.length > 0 && (
              <div>
                <h3>Materiais educativos</h3>
                <ul>
                  {results.materials.map((m) => (
                    <li key={m.id}><Link to="/educacao">{m.title} ({m.type})</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
