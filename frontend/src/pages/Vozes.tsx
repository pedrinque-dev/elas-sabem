import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Story } from "../types";
import { Loading, EmptyState } from "../components/StateBlock";

const THEMES = ["superação", "educação", "empreendedorismo", "saúde", "violência", "reconstrução", "conquistas"];

export function Vozes() {
  const [stories, setStories] = useState<Story[]>([]);
  const [theme, setTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    const query = theme ? `?theme=${encodeURIComponent(theme)}` : "";
    api.get<Story[]>(`/stories${query}`).then(setStories).finally(() => setLoading(false));
  }, [theme]);

  return (
    <>
      <section className="area-page-hero">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow">Vozes</p>
            <h1>Histórias reais de mulheres</h1>
            <p className="hero__lead">
              Superação, educação, empreendedorismo, saúde e conquistas — sem abordagem sensacionalista.
            </p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Fechar formulário" : "Compartilhar minha história"}
          </button>
        </div>
      </section>

      {showForm && (
        <section className="section section--tight">
          <div className="container">
            <StorySubmitForm onSubmitted={() => setShowForm(false)} />
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="category-filter-bar">
            <button className={theme === null ? "is-active" : ""} onClick={() => setTheme(null)}>Todas</button>
            {THEMES.map((t) => (
              <button key={t} className={theme === t ? "is-active" : ""} onClick={() => setTheme(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <Loading label="Carregando histórias" />
          ) : stories.length === 0 ? (
            <EmptyState title="Nenhuma história encontrada" description="Seja a primeira a compartilhar uma história neste tema." />
          ) : (
            <div className="grid grid--3">
              {stories.map((s) => (
                <Link key={s.id} to={`/vozes/${s.id}`} className="story-card">
                  <span className="tag tag--teal">{s.theme}</span>
                  <h3>{s.title}</h3>
                  <p>{s.excerpt}</p>
                  <span className="story-card__author">— {s.authorName}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function StorySubmitForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({ authorName: "", title: "", excerpt: "", body: "", theme: "superação" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.post("/stories", form);
      setStatus("sent");
      setTimeout(onSubmitted, 1500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Não foi possível enviar sua história.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card">
        <h3>História recebida!</h3>
        <p style={{ marginBottom: 0 }}>
          Obrigado por compartilhar. Sua história passará por moderação antes de ser publicada.
        </p>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ maxWidth: "640px" }}>
      <h3>Compartilhar minha história</h3>
      <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>
        Você pode usar um nome fictício. Todas as histórias passam por moderação antes de serem
        publicadas — evite incluir dados pessoais identificáveis desnecessários.
      </p>
      <div className="field">
        <label htmlFor="story-author">Como quer ser identificada</label>
        <input id="story-author" required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="story-title">Título</label>
        <input id="story-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="story-theme">Tema</label>
        <select id="story-theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="story-excerpt">Resumo curto</label>
        <textarea id="story-excerpt" required minLength={10} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div className="field">
        <label htmlFor="story-body">Sua história completa</label>
        <textarea id="story-body" required minLength={30} rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </div>
      {status === "error" && <p className="field-error">{errorMsg}</p>}
      <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando…" : "Enviar história"}
      </button>
    </form>
  );
}
