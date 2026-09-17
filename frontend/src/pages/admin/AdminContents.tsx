import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Area, Category, Content } from "../../types";
import { AREA_LABELS } from "../../types";
import { Loading } from "../../components/StateBlock";

const AREAS = Object.keys(AREA_LABELS) as Area[];

const emptyForm = {
  slug: "",
  title: "",
  summary: "",
  body: "",
  area: "ENTENDER" as Area,
  status: "RASCUNHO" as "RASCUNHO" | "PUBLICADO" | "ARQUIVADO",
  categoryId: "",
  readTimeMin: 5,
  tags: "",
};

export function AdminContents() {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function loadContents() {
    setLoading(true);
    api.get<Content[]>("/contents", true).then(setContents).finally(() => setLoading(false));
  }

  useEffect(() => {
    loadContents();
    api.get<Category[]>("/categories").then(setCategories);
  }, []);

  const categoriesForArea = categories.filter((c) => c.area === form.area);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(content: Content) {
    setForm({
      slug: content.slug,
      title: content.title,
      summary: content.summary,
      body: content.body,
      area: content.area,
      status: content.status,
      categoryId: content.categoryId,
      readTimeMin: content.readTimeMin,
      tags: content.tags.join(", "),
    });
    setEditingId(content.id);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/contents/${editingId}`, payload, true);
      } else {
        await api.post("/contents", payload, true);
      }
      setShowForm(false);
      loadContents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o conteúdo.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este conteúdo?")) return;
    await api.delete(`/contents/${id}`, true);
    loadContents();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Conteúdos</h1>
        <button className="btn btn--primary" onClick={startCreate}>+ Novo conteúdo</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar conteúdo" : "Novo conteúdo"}</h3>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="c-title">Título</label>
              <input id="c-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="c-slug">Slug</label>
              <input id="c-slug" required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="c-area">Área</label>
              <select id="c-area" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value as Area, categoryId: "" })}>
                {AREAS.map((a) => <option key={a} value={a}>{AREA_LABELS[a]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="c-category">Categoria</label>
              <select id="c-category" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Selecione…</option>
                {categoriesForArea.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="c-summary">Resumo</label>
            <textarea id="c-summary" required minLength={10} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>

          <div className="field">
            <label htmlFor="c-body">Corpo (markdown simples)</label>
            <textarea id="c-body" required minLength={20} rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="c-status">Status</label>
              <select id="c-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}>
                <option value="RASCUNHO">Rascunho</option>
                <option value="PUBLICADO">Publicado</option>
                <option value="ARQUIVADO">Arquivado</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="c-readtime">Tempo de leitura (min)</label>
              <input id="c-readtime" type="number" min={1} value={form.readTimeMin} onChange={(e) => setForm({ ...form, readTimeMin: Number(e.target.value) })} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="c-tags">Tags (separadas por vírgula)</label>
            <input id="c-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>

          {error && <p className="field-error">{error}</p>}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn--primary" type="submit">Salvar</button>
            <button className="btn btn--ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading label="Carregando conteúdos" />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Área</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{AREA_LABELS[c.area]}</td>
                <td><span className={`badge-status badge-status--${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td className="admin-table__actions">
                  <button className="btn btn--sm btn--secondary" onClick={() => startEdit(c)}>Editar</button>
                  <button className="btn btn--sm btn--danger" onClick={() => handleDelete(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
