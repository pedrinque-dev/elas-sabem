import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { EducationalMaterial } from "../types";
import { Loading, EmptyState } from "../components/StateBlock";

const AUDIENCES = ["adolescentes", "professores", "projetos sociais"];

export function Educacao() {
  const [materials, setMaterials] = useState<EducationalMaterial[]>([]);
  const [audience, setAudience] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = audience ? `?audience=${encodeURIComponent(audience)}` : "";
    api.get<EducationalMaterial[]>(`/materials${query}`).then(setMaterials).finally(() => setLoading(false));
  }, [audience]);

  return (
    <>
      <section className="area-page-hero">
        <div className="container">
          <p className="eyebrow">Educação</p>
          <h1>Materiais para escolas, professores e projetos sociais</h1>
          <p className="hero__lead">
            Cartilhas, atividades e apresentações prontas para uso em sala de aula ou em oficinas.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-filter-bar">
            <button className={audience === null ? "is-active" : ""} onClick={() => setAudience(null)}>Todos</button>
            {AUDIENCES.map((a) => (
              <button key={a} className={audience === a ? "is-active" : ""} onClick={() => setAudience(a)}>
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading label="Carregando materiais" />
          ) : materials.length === 0 ? (
            <EmptyState title="Nenhum material encontrado" />
          ) : (
            <div className="grid grid--3">
              {materials.map((m) => (
                <div key={m.id} className="card">
                  <span className="tag">{m.type}</span>
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                  {m.fileUrl ? (
                    <a href={m.fileUrl} target="_blank" rel="noreferrer">Acessar material →</a>
                  ) : (
                    <span style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>Material em preparação</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
