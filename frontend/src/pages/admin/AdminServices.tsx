import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import type { Service, ServiceCategory } from "../../types";
import { Loading } from "../../components/StateBlock";

const emptyForm = {
  name: "",
  description: "",
  categoryId: "",
  address: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  phone: "",
  website: "",
  hours: "",
  is24h: false,
  verified: false,
};

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api.get<Service[]>("/services", true).then(setServices).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    api.get<ServiceCategory[]>("/services/categories").then(setCategories);
  }, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  }

  function startEdit(s: Service) {
    setForm({
      name: s.name,
      description: s.description ?? "",
      categoryId: s.categoryId,
      address: s.address,
      city: s.city,
      state: s.state,
      latitude: String(s.latitude),
      longitude: String(s.longitude),
      phone: s.phone ?? "",
      website: s.website ?? "",
      hours: s.hours ?? "",
      is24h: s.is24h,
      verified: s.verified,
    });
    setEditingId(s.id);
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      description: form.description || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      hours: form.hours || undefined,
    };
    try {
      if (editingId) await api.put(`/services/${editingId}`, payload, true);
      else await api.post("/services", payload, true);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o serviço.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Excluir este serviço?")) return;
    await api.delete(`/services/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Serviços</h1>
        <button className="btn btn--primary" onClick={startCreate}>+ Novo serviço</button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar serviço" : "Novo serviço"}</h3>

          <div className="field">
            <label htmlFor="s-name">Nome</label>
            <input id="s-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="field">
            <label htmlFor="s-category">Categoria</label>
            <select id="s-category" required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Selecione…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="s-description">Descrição</label>
            <textarea id="s-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="field">
            <label htmlFor="s-address">Endereço</label>
            <input id="s-address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <div className="grid grid--3">
            <div className="field">
              <label htmlFor="s-city">Cidade</label>
              <input id="s-city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-state">UF</label>
              <input id="s-state" required maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
            </div>
            <div className="field">
              <label htmlFor="s-phone">Telefone</label>
              <input id="s-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="grid grid--2">
            <div className="field">
              <label htmlFor="s-lat">Latitude</label>
              <input id="s-lat" required type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="s-lng">Longitude</label>
              <input id="s-lng" required type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="s-hours">Horário de funcionamento</label>
            <input id="s-hours" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
          </div>

          <div className="field">
            <label htmlFor="s-website">Site</label>
            <input id="s-website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>

          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
            <input type="checkbox" checked={form.is24h} onChange={(e) => setForm({ ...form, is24h: e.target.checked })} />
            Funciona 24h
          </label>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}>
            <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
            Dados verificados por um administrador
          </label>

          {error && <p className="field-error">{error}</p>}

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn--primary" type="submit">Salvar</button>
            <button className="btn btn--ghost" type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {loading ? (
        <Loading label="Carregando serviços" />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade/UF</th>
              <th>Verificado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.city}/{s.state}</td>
                <td>{s.verified ? "Sim" : "Não"}</td>
                <td className="admin-table__actions">
                  <button className="btn btn--sm btn--secondary" onClick={() => startEdit(s)}>Editar</button>
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
