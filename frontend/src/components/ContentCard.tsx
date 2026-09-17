import { Link } from "react-router-dom";
import type { Content } from "../types";

export function ContentCard({ content }: { content: Content }) {
  return (
    <Link to={`/conteudo/${content.slug}`} className="content-card">
      <span className="tag">{content.category?.name ?? content.area}</span>
      <h3>{content.title}</h3>
      <p>{content.summary}</p>
      <span className="content-card__meta">{content.readTimeMin} min de leitura</span>
    </Link>
  );
}
