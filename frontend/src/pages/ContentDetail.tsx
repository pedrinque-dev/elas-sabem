import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, ApiClientError } from "../services/api";
import type { Content } from "../types";
import { AREA_LABELS } from "../types";
import { Loading, ErrorState } from "../components/StateBlock";

export function ContentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<Content>(`/contents/${slug}`)
      .then(setContent)
      .catch((e: ApiClientError) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading label="Carregando conteúdo" />;
  if (error || !content) return <ErrorState message={error ?? "Conteúdo não encontrado."} />;

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: "760px" }}>
        <p className="eyebrow">
          <Link to={`/${content.area.toLowerCase().replace("_", "-")}`}>{AREA_LABELS[content.area]}</Link>
          {" · "}
          {content.category?.name}
        </p>
        <h1>{content.title}</h1>
        <p style={{ color: "var(--ink-soft)" }}>{content.readTimeMin} min de leitura</p>
        <div className="content-body">
          {content.body.split("\n").map((line, i) =>
            line.trim().length === 0 ? <br key={i} /> : <p key={i}>{line.replace(/^#+\s*/, "")}</p>
          )}
        </div>

        {content.related && content.related.length > 0 && (
          <section style={{ marginTop: "3rem" }}>
            <h3>Conteúdos relacionados</h3>
            <div className="grid grid--3">
              {content.related.map((r) => (
                <Link key={r.id} to={`/conteudo/${r.slug}`} className="content-card">
                  <h3>{r.title}</h3>
                  <p>{r.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
