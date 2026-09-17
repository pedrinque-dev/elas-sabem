import { Link } from "react-router-dom";
import { AreaPage } from "./AreaPage";

export function Entender() {
  return (
    <AreaPage
      area="ENTENDER"
      eyebrow="Entender"
      title="Informação clara sobre violência contra a mulher"
      description="Conheça os diferentes tipos de violência, sinais de alerta e o que caracteriza um relacionamento saudável — para reconhecer padrões com mais clareza."
    >
      <section className="section section--tight">
        <div className="container">
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <div>
              <h3>Ferramenta interativa: Você reconhece os sinais?</h3>
              <p style={{ marginBottom: 0 }}>
                Situações do cotidiano, para observar e refletir — sem rótulos ou diagnósticos.
              </p>
            </div>
            <Link to="/quiz/voce-reconhece-os-sinais" className="btn btn--primary">Começar</Link>
          </div>
        </div>
      </section>
    </AreaPage>
  );
}
