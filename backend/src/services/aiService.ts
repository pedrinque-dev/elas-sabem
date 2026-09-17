import Groq from "groq-sdk";
import { env, isAiConfigured } from "../config/env";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

let groqClient: Groq | null = null;
function getClient(): Groq {
  if (!isAiConfigured()) {
    throw ApiError.internal(
      "A assistente Nina não está configurada no momento (GROQ_API_KEY ausente)."
    );
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.groqApiKey });
  }
  return groqClient;
}

const SYSTEM_PROMPT = `
Você é a Nina, a assistente de orientação informacional da plataforma Elas Sabem.

Seu papel:
- Ajudar mulheres a identificar temas presentes no que elas escrevem (ex.: controle, isolamento,
  privacidade, violência psicológica, violência digital, saúde, direitos) e direcioná-las para
  conteúdos e serviços de apoio adequados.
- Responder com acolhimento, clareza e respeito, sem julgamentos.

Você NUNCA deve:
- Diagnosticar, rotular a pessoa ou afirmar de forma definitiva que alguém "é vítima" ou
  "é agressor".
- Substituir atendimento médico, psicológico ou jurídico.
- Dar aconselhamento jurídico personalizado (pode explicar conceitos gerais e indicar que ela
  procure orientação jurídica/serviço especializado).
- Incentivar confronto direto com a pessoa que causa a situação relatada.
- Tomar decisões pela usuária ("você deve terminar o relacionamento", "você deve denunciar agora").
  Em vez disso, apresente opções e informações para que ela decida.
- Inventar nomes de serviços, telefones, endereços, leis específicas ou estatísticas. Se não
  tiver certeza, diga isso claramente e sugira buscar na área "Buscar Ajuda" da plataforma.
- Armazenar ou pedir dados de identificação desnecessários.

Formato da resposta:
1. Uma frase curta de acolhimento (sem exageros nem dramatização).
2. Os temas identificados no relato (2 a 4 temas, em linguagem simples).
3. Uma orientação geral e educativa sobre esses temas.
4. Uma sugestão do que explorar dentro do Elas Sabem (áreas: Entender, Cuidar, Proteger,
   Buscar Ajuda, Vozes) — sem inventar links específicos.
5. Se houver qualquer sinal de risco imediato, oriente a buscar ajuda de emergência local e a
   área "Buscar Ajuda" da plataforma, sem alarmismo.

Seja breve (no máximo ~180 palavras) e escreva em português do Brasil.
`.trim();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Ponto de extensão para RAG/embeddings futuros: hoje faz um match simples por
 * palavras-chave contra títulos/resumos de conteúdos publicados. No futuro,
 * substituir por busca vetorial (ex.: pgvector) mantendo a mesma assinatura.
 */
async function retrieveRelevantContents(message: string, limit = 3) {
  const keywords = message
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .slice(0, 8);

  if (keywords.length === 0) return [];

  return prisma.content.findMany({
    where: {
      status: "PUBLICADO",
      OR: keywords.map((word) => ({
        OR: [
          { title: { contains: word, mode: "insensitive" as const } },
          { summary: { contains: word, mode: "insensitive" as const } },
          { tags: { has: word } },
        ],
      })),
    },
    take: limit,
    select: { title: true, summary: true, area: true, slug: true },
  });
}

export async function askNina(message: string, history: ChatMessage[] = []) {
  const client = getClient();
  const relatedContents = await retrieveRelevantContents(message);

  const contextNote =
    relatedContents.length > 0
      ? `Conteúdos do Elas Sabem possivelmente relacionados (use apenas como referência, não invente outros): ${relatedContents
          .map((c) => `"${c.title}" (área ${c.area})`)
          .join("; ")}.`
      : "Nenhum conteúdo específico do Elas Sabem foi automaticamente relacionado a esta mensagem.";

  const completion = await client.chat.completions.create({
    model: env.groqModel,
    temperature: 0.4,
    max_tokens: 500,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: contextNote },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ],
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  if (!reply) {
    throw ApiError.internal("Não foi possível obter uma resposta da Nina agora. Tente novamente.");
  }

  return { reply, relatedContents };
}
