import { useEffect, useCallback } from "react";

const NEUTRAL_URL = "https://www.google.com";

/**
 * Botão de saída rápida. Ao ser acionado, redireciona imediatamente para um site
 * neutro. Não apaga histórico ou rastros do navegador — isso não é afirmado em
 * nenhum texto da interface, para não gerar falsa sensação de segurança.
 */
export function QuickExit() {
  const exit = useCallback(() => {
    window.location.replace(NEUTRAL_URL);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && e.shiftKey) exit();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exit]);

  return (
    <button
      type="button"
      onClick={exit}
      className="quick-exit-btn"
      aria-label="Sair rapidamente desta página (atalho: Shift + Esc)"
      title="Sair rapidamente (Shift + Esc)"
    >
      Sair rápido
    </button>
  );
}
