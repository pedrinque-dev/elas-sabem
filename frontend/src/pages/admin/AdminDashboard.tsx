import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { AdminOverview } from "../../types";
import { Loading } from "../../components/StateBlock";

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    api.get<AdminOverview>("/admin/overview", true).then(setOverview);
  }, []);

  if (!overview) return <Loading label="Carregando visão geral" />;

  const cards = [
    { label: "Conteúdos publicados", value: `${overview.publishedContents} / ${overview.totalContents}` },
    { label: "Histórias pendentes", value: overview.pendingStories },
    { label: "Histórias no total", value: overview.totalStories },
    { label: "Serviços cadastrados", value: overview.totalServices },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1>Visão geral</h1>
      </div>
      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="admin-stat-card">
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
      {overview.pendingReports > 0 && (
        <div className="card" style={{ background: "var(--gold-tint)" }}>
          <p style={{ margin: 0 }}>
            Há <strong>{overview.pendingReports}</strong> relato(s) pendente(s) de moderação.
          </p>
        </div>
      )}
    </div>
  );
}
