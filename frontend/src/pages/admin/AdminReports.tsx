import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Loading } from "../../components/StateBlock";

interface Report {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  createdAt: string;
}

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api.get<Report[]>("/admin/reports", true).then(setReports).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function moderate(id: string, status: "APROVADO" | "REJEITADO") {
    await api.patch(`/admin/reports/${id}/moderate`, { status }, true);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Relatos</h1>
      </div>

      {loading ? (
        <Loading label="Carregando relatos" />
      ) : reports.length === 0 ? (
        <p>Nenhum relato pendente de moderação no momento.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Conteúdo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.type}</td>
                <td style={{ maxWidth: "360px" }}>{JSON.stringify(r.payload)}</td>
                <td><span className={`badge-status badge-status--${r.status.toLowerCase()}`}>{r.status}</span></td>
                <td className="admin-table__actions">
                  <button className="btn btn--sm btn--teal" onClick={() => moderate(r.id, "APROVADO")}>Aprovar</button>
                  <button className="btn btn--sm btn--secondary" onClick={() => moderate(r.id, "REJEITADO")}>Rejeitar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
