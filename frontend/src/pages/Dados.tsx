import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { api } from "../services/api";
import type { Statistic } from "../types";
import { Loading, EmptyState } from "../components/StateBlock";

export function Dados() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (region) params.set("region", region);
    api.get<Statistic[]>(`/statistics?${params.toString()}`).then(setStatistics).finally(() => setLoading(false));
  }, [category, region]);

  const categories = useMemo(() => Array.from(new Set(statistics.map((s) => s.category))), [statistics]);
  const regions = useMemo(() => Array.from(new Set(statistics.map((s) => s.region))), [statistics]);

  const groupedByIndicator = useMemo(() => {
    const map = new Map<string, Statistic[]>();
    for (const s of statistics) {
      const list = map.get(s.indicator) ?? [];
      list.push(s);
      map.set(s.indicator, list);
    }
    return Array.from(map.entries());
  }, [statistics]);

  const hasDemoData = statistics.some((s) => s.isDemo);

  return (
    <>
      <section className="area-page-hero">
        <div className="container">
          <p className="eyebrow">Dados</p>
          <h1>Dashboard público de indicadores</h1>
          <p className="hero__lead">
            Números organizados por período, região e categoria. Cada indicador apresenta fonte,
            período e descrição.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {hasDemoData && (
            <div className="card" style={{ background: "var(--gold-tint)", borderColor: "var(--gold)", marginBottom: "1.5rem" }}>
              <p style={{ margin: 0 }}>
                <strong>Aviso:</strong> alguns indicadores exibidos são dados fictícios de
                demonstração, usados apenas para ilustrar o funcionamento do dashboard, e não
                representam estatísticas reais.
              </p>
            </div>
          )}

          <div className="filter-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filtrar por categoria">
              <option value="">Todas as categorias</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Filtrar por região">
              <option value="">Todas as regiões</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {loading ? (
            <Loading label="Carregando indicadores" />
          ) : groupedByIndicator.length === 0 ? (
            <EmptyState title="Nenhum indicador encontrado" description="Ajuste os filtros ou volte em breve." />
          ) : (
            <div className="grid grid--2">
              {groupedByIndicator.map(([indicator, points]) => {
                const sorted = [...points].sort((a, b) => a.period.localeCompare(b.period));
                const chartData = sorted.map((p) => ({ period: p.period, valor: p.value }));
                const isTimeSeries = new Set(sorted.map((p) => p.period)).size > 1;
                return (
                  <div key={indicator} className="chart-card">
                    <h3>{indicator}</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      {isTimeSeries ? (
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5ded0" />
                          <XAxis dataKey="period" stroke="#3a4256" />
                          <YAxis stroke="#3a4256" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="valor" stroke="#7a3358" strokeWidth={2} name={sorted[0]?.unit} />
                        </LineChart>
                      ) : (
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5ded0" />
                          <XAxis dataKey="period" stroke="#3a4256" />
                          <YAxis stroke="#3a4256" />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#2c6b60" name={sorted[0]?.unit} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                    <p className="stat-source">
                      {sorted[0]?.description}
                      {sorted[0]?.isDemo && <span className="tag tag--demo" style={{ marginLeft: "0.5rem" }}>dado fictício</span>}
                    </p>
                    {sorted[0]?.source?.name && (
                      <p className="stat-source">Fonte: {sorted[0].source.name}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
