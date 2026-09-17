import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import type { NinaMessage } from "../types";

export function Nina() {
  const [messages, setMessages] = useState<NinaMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || sending) return;

    const nextMessages: NinaMessage[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    setError("");

    try {
      const history = messages.slice(-8);
      const result = await api.post<{ reply: string }>("/ai/chat", { message, history });
      setMessages([...nextMessages, { role: "assistant", content: result.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível falar com a Nina agora.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section">
      <div className="container chat-shell">
        <div>
          <p className="eyebrow">Assistente Nina</p>
          <h1>Converse com a Nina</h1>
          <p className="chat-disclaimer">
            A Nina identifica temas em situações ou perguntas e indica conteúdos do Elas Sabem.
            Ela não diagnostica, não substitui profissionais e não guarda o histórico desta
            conversa no servidor.
          </p>
        </div>

        <div className="chat-log" ref={logRef} aria-live="polite">
          {messages.length === 0 && (
            <div className="chat-bubble chat-bubble--assistant">
              Oi, eu sou a Nina. Pode escrever uma situação ou pergunta com suas próprias
              palavras — por exemplo: "Meu namorado controla com quem eu saio e quer olhar meu
              celular."
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble chat-bubble--${m.role === "user" ? "user" : "assistant"}`}>
              {m.content}
            </div>
          ))}
          {sending && <div className="chat-bubble chat-bubble--assistant loading-dots">Pensando</div>}
        </div>

        {error && <p className="field-error">{error}</p>}

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="nina-input" className="sr-only">Escreva sua mensagem para a Nina</label>
          <textarea
            id="nina-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva aqui…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button type="submit" className="btn btn--primary" disabled={sending || !input.trim()}>
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
