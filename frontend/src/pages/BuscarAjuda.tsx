import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { api } from "../services/api";
import type { Service, ServiceCategory } from "../types";
import { Loading, EmptyState } from "../components/StateBlock";

// Ícone padrão do Leaflet (o CDN de assets precisa ser configurado manualmente em bundlers)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253];

export function BuscarAjuda() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<ServiceCategory[]>("/services/categories").then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    api
      .get<Service[]>(`/services?${params.toString()}`)
      .then(setServices)
      .finally(() => setLoading(false));
  }, [categoryId, state, city]);

  return (
    <>
      <section className="area-page-hero">
        <div className="container">
          <p className="eyebrow">Buscar ajuda</p>
          <h1>Encontre serviços de apoio perto de você</h1>
          <p className="hero__lead">
            Diretório e mapa de serviços de saúde, assistência social, atendimento jurídico,
            segurança pública e atendimento especializado.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container help-layout">
          <aside className="help-filters">
            <div className="field">
              <label htmlFor="filter-category">Categoria</label>
              <select id="filter-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="filter-state">Estado (UF)</label>
              <input
                id="filter-state"
                placeholder="Ex: SP"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
              />
            </div>
            <div className="field">
              <label htmlFor="filter-city">Cidade</label>
              <input id="filter-city" placeholder="Ex: Guararema" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
              Os serviços listados aqui são cadastrados e mantidos por administradores da
              plataforma.
            </p>
          </aside>

          <div>
            <div className="map-container">
              <MapContainer center={BRAZIL_CENTER} zoom={4} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {services.map((s) => (
                  <Marker key={s.id} position={[s.latitude, s.longitude]} icon={markerIcon}>
                    <Popup>
                      <strong>{s.name}</strong>
                      <br />
                      {s.address}, {s.city} - {s.state}
                      {s.phone && <><br />{s.phone}</>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {loading ? (
              <Loading label="Carregando serviços" />
            ) : services.length === 0 ? (
              <EmptyState title="Nenhum serviço encontrado" description="Tente ajustar os filtros de busca." />
            ) : (
              <div className="service-list">
                {services.map((s) => (
                  <div key={s.id} className="service-item">
                    <span className="tag">{s.category?.name}</span>
                    <h3 style={{ margin: "0.4rem 0" }}>{s.name}</h3>
                    <p style={{ margin: 0 }}>{s.address}, {s.city} - {s.state}</p>
                    {s.hours && <p style={{ margin: 0, color: "var(--ink-soft)" }}>{s.hours}</p>}
                    {s.phone && <p style={{ margin: 0 }}>{s.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
