import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Content, Story } from "../types";
import { ContentCard } from "../components/ContentCard";
import { Loading } from "../components/StateBlock";

const AREAS = [
  {
    to: "/entender",
    title: "Entender",
    description: "Informação clara sobre os diferentes tipos de violência e sinais em relacionamentos.",
  },
  {
    to: "/cuidar",
    title: "Cuidar",
    description: "Saúde física, mental e sexual — em cada fase da vida.",
  },
  {
    to: "/proteger",
    title: "Proteger",
    description: "Segurança digital, privacidade e ferramentas práticas de autoproteção.",
  },
  {
    to: "/buscar-ajuda",
    title: "Buscar ajuda",
    description: "Diretório e mapa de serviços de apoio por categoria, estado e cidade.",
  },
  {
    to: "/vozes",
    title: "Vozes",
    description: "Histórias reais de superação, educação, saúde e conquistas.",
  },
  {
    to: "/educacao",
    title: "Educação",
    description: "Materiais para escolas, professores e projetos sociais.",
  },
];

export function Home() {
  const [contents, setContents] = useState<Content[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Content[]>("/contents"),
      api.get<Story[]>("/stories?featured=true"),
    ])
      .then(([c, s]) => {
        setContents(c.slice(0, 3));
        setStories(s.slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Elas Sabem</p>
            <h1>Informação. Prevenção. Autonomia. Rede.</h1>
            <p className="hero__lead">
              Uma plataforma que reúne informação sobre saúde, segurança digital, direitos,
              histórias reais e uma rede de apoio — para que cada mulher tenha mais autonomia
              nas próprias decisões.
            </p>
            <div className="hero__actions">
              <Link to="/buscar-ajuda" className="btn btn--primary">Buscar ajuda agora</Link>
              <Link to="/nina" className="btn btn--secondary">Conversar com a Nina</Link>
            </div>
          </div>
          <div className="hero__panel" aria-hidden="true">
            <div className="hero__panel-line" />
            <p className="hero__panel-quote">
              "Um espaço para se informar, se cuidar e se conectar com uma rede de apoio."
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Comece por aqui</p>
          <h2>Seis caminhos, um só propósito</h2>
          <div className="grid grid--3 area-grid">
            {AREAS.map((area) => (
              <Link key={area.to} to={area.to} className="area-card">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <span className="area-card__cta">Explorar →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight nina-band">
        <div className="container nina-band__inner">
          <div>
            <p className="eyebrow">Assistente Nina</p>
            <h2>Não sabe por onde começar? Converse com a Nina.</h2>
            <p>
              Descreva uma situação ou pergunta em suas próprias palavras. A Nina identifica temas
              relevantes e indica conteúdos do Elas Sabem — sem diagnosticar e sem substituir
              profissionais.
            </p>
          </div>
          <Link to="/nina" className="btn btn--primary">Falar com a Nina</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Conteúdos em destaque</p>
              <h2>Para se informar hoje</h2>
            </div>
            <Link to="/entender">Ver tudo em Entender →</Link>
          </div>
          {loading ? (
            <Loading label="Carregando conteúdos" />
          ) : (
            <div className="grid grid--3">
              {contents.map((c) => (
                <ContentCard key={c.id} content={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {stories.length > 0 && (
        <section className="section section--tight">
          <div className="container">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Vozes</p>
                <h2>Histórias que inspiram</h2>
              </div>
              <Link to="/vozes">Ver todas as histórias →</Link>
            </div>
            <div className="grid grid--2">
              {stories.map((s) => (
                <Link key={s.id} to={`/vozes/${s.id}`} className="story-card">
                  <span className="tag tag--teal">{s.theme}</span>
                  <h3>{s.title}</h3>
                  <p>{s.excerpt}</p>
                  <span className="story-card__author">— {s.authorName}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section data-teaser">
        <div className="container data-teaser__inner">
          <div>
            <p className="eyebrow">Dados</p>
            <h2>Números que sustentam o que fazemos</h2>
            <p>
              Um dashboard público, com indicadores organizados por período, região e categoria —
              todos com fonte e descrição indicadas.
            </p>
          </div>
          <Link to="/dados" className="btn btn--teal">Ver o dashboard</Link>
        </div>
      </section>
    </>
  );
}
