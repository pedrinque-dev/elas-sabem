export function ComoAjudar() {
  const topics = [
    { title: "Escute sem julgar", text: "Ofereça um espaço seguro para que a pessoa fale, sem interromper ou minimizar o que ela sente." },
    { title: "Evite culpabilizar", text: "Frases como \"por que você não sai logo\" podem afastar quem precisa de apoio. Valide os sentimentos, não questione as escolhas." },
    { title: "Respeite o tempo dela", text: "Decisões como buscar ajuda ou sair de uma situação levam tempo. Esteja presente sem pressionar." },
    { title: "Ajude a encontrar serviços adequados", text: "Use a área \"Buscar ajuda\" para conhecer serviços de saúde, assistência social, jurídicos e de segurança pública." },
  ];

  return (
    <>
      <section className="area-page-hero">
        <div className="container">
          <p className="eyebrow">Como posso ajudar?</p>
          <h1>Para quem quer apoiar alguém</h1>
          <p className="hero__lead">
            Orientações para familiares, amigos, professores e outras pessoas que quiserem apoiar
            uma mulher em situação difícil.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--2">
          {topics.map((t) => (
            <div key={t.title} className="card">
              <h3>{t.title}</h3>
              <p style={{ marginBottom: 0 }}>{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
