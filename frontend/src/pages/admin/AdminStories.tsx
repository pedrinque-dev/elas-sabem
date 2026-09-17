import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Story, StoryStatus } from "../../types";
import { Loading } from "../../components/StateBlock";

export function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [statusFilter, setStatusFilter] = useState<StoryStatus | "">("PENDENTE");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : "";
    api.get<Story[]>(`/stories${query}`, true).then(setStories).finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  async function moderate(id: string, status: StoryStatus) {
    await api.patch(`/stories/${id}/moderate`, { status }, true);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta história definitivamente?")) return;
    await api.delete(`/stories/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Histórias</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StoryStatus | "")}>
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="REJEITADO">Rejeitado</option>
        </select>
      </div>

      {loading ? (
        <Loading label="Carregando histórias" />
      ) : stories.length === 0 ? (
        <p>Nenhuma história encontrada para este filtro.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autora</th>
              <th>Tema</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.authorName}</td>
                <td>{s.theme}</td>
                <td><span className={`badge-status badge-status--${s.status.toLowerCase()}`}>{s.status}</span></td>
                <td className="admin-table__actions">
                  {s.status !== "APROVADO" && (
                    <button className="btn btn--sm btn--teal" onClick={() => moderate(s.id, "APROVADO")}>Aprovar</button>
                  )}
                  {s.status !== "REJEITADO" && (
                    <button className="btn btn--sm btn--secondary" onClick={() => moderate(s.id, "REJEITADO")}>Rejeitar</button>
                  )}
                  <button className="btn btn--sm btn--danger" onClick={() => remove(s.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
