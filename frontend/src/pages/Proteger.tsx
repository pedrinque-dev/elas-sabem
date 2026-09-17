import { AreaPage } from "./AreaPage";
import { SecurityChecklist } from "../components/SecurityChecklist";

export function Proteger() {
  return (
    <AreaPage
      area="PROTEGER"
      eyebrow="Proteger"
      title="Segurança digital e privacidade"
      description="Ferramentas práticas para proteger suas contas, sua localização e sua imagem online."
    >
      <section className="section section--tight">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: "flex-start" }}>
            <SecurityChecklist />
            <div className="card">
              <h3>Saída rápida</h3>
              <p>
                O botão <strong>"Sair rápido"</strong>, disponível em todas as páginas, te leva
                imediatamente para outro site. Use-o sempre que precisar sair da tela com rapidez.
              </p>
              <p style={{ marginBottom: 0 }}>
                Ele não apaga o histórico do navegador. Se você compartilha o dispositivo com
                alguém, considere também usar a navegação anônima do seu navegador.
              </p>
            </div>
          </div>
        </div>
      </section>
    </AreaPage>
  );
}
