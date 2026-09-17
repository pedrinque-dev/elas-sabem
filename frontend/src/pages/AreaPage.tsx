import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Area, Category, Content } from "../types";
import { ContentCard } from "../components/ContentCard";
import { Loading, EmptyState } from "../components/StateBlock";

interface AreaPageProps {
  area: Area;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function AreaPage({ area, eyebrow, title, description, children }: AreaPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Category[]>(`/categories?area=${area}`).then(setCategories);
  }, [area]);

  useEffect(() => {
    setLoading(true);
    const query = activeCategory ? `&categoryId=${activeCategory}` : "";
    api
      .get<Content[]>(`/contents?area=${area}${query}`)
      .then(setContents)
      .finally(() => setLoading(false));
  }, [area, activeCategory]);

  return (
    <>
      <section className="area-page-hero">
        <div className="container">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero__lead">{description}</p>
        </div>
      </section>

      {children}

      <section className="section">
        <div className="container">
          <div className="category-filter-bar" role="group" aria-label="Filtrar por categoria">
            <button
              className={activeCategory === null ? "is-active" : ""}
              onClick={() => setActiveCategory(null)}
            >
              Todas
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={activeCategory === c.id ? "is-active" : ""}
                onClick={() => setActiveCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading label="Carregando conteúdos" />
          ) : contents.length === 0 ? (
            <EmptyState
              title="Nenhum conteúdo encontrado"
              description="Tente selecionar outra categoria ou volte em breve — novos conteúdos são adicionados regularmente."
            />
          ) : (
            <div className="grid grid--3">
              {contents.map((c) => (
                <ContentCard key={c.id} content={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
