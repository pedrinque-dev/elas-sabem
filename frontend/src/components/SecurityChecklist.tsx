import { useEffect, useState } from "react";

const ITEMS = [
  { id: "senha-forte", label: "Usei uma senha forte e única para meu e-mail principal." },
  { id: "2fa", label: "Ativei a autenticação em duas etapas nas contas mais importantes." },
  { id: "localizacao", label: "Revisei quais apps têm acesso à minha localização." },
  { id: "redes-sociais", label: "Revisei quem pode ver minhas publicações e minha lista de contatos." },
  { id: "dispositivos", label: "Verifiquei quais dispositivos estão conectados às minhas contas." },
  { id: "backup-contatos", label: "Tenho uma pessoa de confiança avisada sobre minha rotina." },
];

const STORAGE_KEY = "elas-sabem:security-checklist";

/**
 * Checklist local. Os itens marcados ficam apenas no navegador da usuária
 * (localStorage) e nunca são enviados ao servidor.
 */
export function SecurityChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch {
      // ignora dados corrompidos
    }
  }, []);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const total = ITEMS.length;
  const done = ITEMS.filter((i) => checked[i.id]).length;
  const percent = Math.round((done / total) * 100);

  return (
    <div className="card">
      <h3>Checklist de segurança digital</h3>
      <p>
        Marque o que já faz parte da sua rotina. Essas marcações ficam salvas apenas neste
        navegador — nunca são enviadas para nenhum servidor.
      </p>
      <div className="checklist-progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="checklist-progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>{done} de {total} itens marcados</p>
      <div className="checklist">
        {ITEMS.map((item) => (
          <label key={item.id} className={`checklist-item ${checked[item.id] ? "is-checked" : ""}`}>
            <input
              type="checkbox"
              checked={Boolean(checked[item.id])}
              onChange={() => toggle(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
