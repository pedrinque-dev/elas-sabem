# Elas Sabem

Plataforma de informação, prevenção, educação e acesso à rede de apoio para mulheres.
Projeto de extensão universitária de Análise e Desenvolvimento de Sistemas (ADS).

> **Aviso de escopo:** este repositório contém uma implementação completa e funcional da
> arquitetura, do banco de dados e das áreas centrais do produto (Home, Entender, Cuidar,
> Proteger, Buscar Ajuda, Vozes, Dados, Educação, Como Ajudar, assistente Nina, busca global,
> painel administrativo com CRUD de Conteúdos/Histórias/Serviços/Relatos). Não é software já
> testado em produção — antes de publicar, siga a seção **Checklist antes de publicar** ao final
> deste documento.

---

## 1. Stack

**Frontend:** React + Vite + TypeScript, React Router, CSS moderno (design system próprio),
Recharts, Leaflet + OpenStreetMap.

**Backend:** Node.js + Express + TypeScript, API REST, JWT, bcrypt.

**Banco:** PostgreSQL + Prisma ORM.

**IA:** Groq API, chamada exclusivamente pelo backend (`GROQ_API_KEY` nunca é exposta ao
frontend).

---

## 2. Estrutura do projeto

```
elas-sabem/
├── frontend/           # React + Vite + TypeScript
│   └── src/
│       ├── components/ # Header, Footer, QuickExit, ContentCard, SecurityChecklist...
│       ├── pages/       # Home, Entender, Cuidar, Proteger, Vozes, Dados, admin/...
│       ├── layouts/    # SiteLayout, AdminLayout
│       ├── services/   # cliente da API
│       ├── hooks/      # useAuth
│       ├── types/      # tipos compartilhados
│       └── styles/     # design tokens e estilos
│
├── backend/            # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/    # aiService.ts (Groq / Nina)
│   │   ├── middlewares/ # auth (JWT), errorHandler, rateLimit
│   │   ├── validators/  # schemas Zod
│   │   └── config/
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts
│
├── .env.example
└── README.md
```

---

## 3. Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior, instalado e rodando localmente
- Uma chave de API da [Groq](https://console.groq.com/) (opcional para rodar o site, obrigatória
  para a assistente Nina funcionar)

Docker **não** é um requisito deste projeto. Ele funciona normalmente com Node.js e PostgreSQL
instalados localmente.

---

## 4. Configuração do banco de dados

Crie um banco e um usuário no PostgreSQL, por exemplo:

```sql
CREATE DATABASE elas_sabem;
CREATE USER elas_sabem WITH ENCRYPTED PASSWORD 'senha_super_secreta';
GRANT ALL PRIVILEGES ON DATABASE elas_sabem TO elas_sabem;
```

---

## 5. Configuração das variáveis de ambiente

```bash
cp .env.example backend/.env
```

Edite `backend/.env` e preencha, no mínimo:

- `DATABASE_URL` — string de conexão do PostgreSQL que você criou no passo anterior
- `JWT_SECRET` — uma string longa e aleatória (`openssl rand -base64 48`)
- `GROQ_API_KEY` — sua chave da Groq (a Nina retorna erro amigável se esta variável não estiver
  configurada, mas o restante do site funciona normalmente)

Veja `.env.example` para a lista completa de variáveis, incluindo as credenciais de admin usadas
pelo seed.

---

## 6. Rodando o backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init   # cria as tabelas a partir do schema.prisma
npm run seed                          # popula o banco com categorias, conteúdos, serviços, etc.
npm run dev                           # inicia a API em http://localhost:3333
```

> `npx prisma migrate dev` é o comando que efetivamente gera os arquivos de migration SQL em
> `backend/prisma/migrations/`, a partir do `schema.prisma` já incluído neste repositório. Rodá-lo
> localmente garante que as migrations fiquem sempre em sincronia com o schema e com a versão do
> Prisma instalada na sua máquina.

Ao final do seed, o terminal exibe o e-mail e a senha do administrador de desenvolvimento
(também configuráveis via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` no `.env`).

Verifique se a API está no ar:

```bash
curl http://localhost:3333/api/health
```

---

## 7. Rodando o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev     # inicia em http://localhost:5173
```

O Vite já está configurado para redirecionar chamadas `/api/*` para `http://localhost:3333`
(veja `frontend/vite.config.ts`), então o frontend funciona sem configuração adicional de CORS
em desenvolvimento.

---

## 8. Acessando o painel administrativo

1. Acesse `http://localhost:5173/admin/login`
2. Entre com o e-mail e a senha exibidos pelo seed (ou definidos em `SEED_ADMIN_EMAIL` /
   `SEED_ADMIN_PASSWORD`)
3. No painel é possível: ver a visão geral, gerenciar conteúdos (criar/editar/excluir/publicar),
   moderar histórias enviadas (aprovar/rejeitar), gerenciar serviços de apoio (usados no mapa) e
   moderar relatos gerais.

**Importante:** troque a senha de administrador antes de qualquer uso além de desenvolvimento
local, e nunca reutilize a senha de exemplo em produção.

---

## 9. Endpoints principais da API

```
POST   /api/auth/login
GET    /api/auth/me                (autenticado)

GET    /api/categories
POST   /api/categories             (autenticado)
PUT    /api/categories/:id         (autenticado)
DELETE /api/categories/:id         (autenticado)

GET    /api/contents
GET    /api/contents/:slug
POST   /api/contents               (autenticado)
PUT    /api/contents/:id           (autenticado)
DELETE /api/contents/:id           (autenticado)

GET    /api/stories
GET    /api/stories/:id
POST   /api/stories                (público — envio entra como PENDENTE)
PATCH  /api/stories/:id/moderate   (autenticado)
DELETE /api/stories/:id            (autenticado)

GET    /api/services
GET    /api/services/:id
GET    /api/services/categories
POST   /api/services               (autenticado)
PUT    /api/services/:id           (autenticado)
DELETE /api/services/:id           (autenticado)

GET    /api/statistics
POST   /api/statistics             (autenticado)
PUT    /api/statistics/:id         (autenticado)
DELETE /api/statistics/:id         (autenticado)

GET    /api/quizzes
GET    /api/quizzes/:id

GET    /api/materials
POST   /api/materials              (autenticado)
PUT    /api/materials/:id          (autenticado)
DELETE /api/materials/:id          (autenticado)

GET    /api/search?q=...

POST   /api/ai/chat                (rate limit dedicado; não persiste conversas)

GET    /api/admin/overview         (autenticado)
GET    /api/admin/reports          (autenticado)
PATCH  /api/admin/reports/:id/moderate  (autenticado)
```

Todas as rotas administrativas exigem o header `Authorization: Bearer <token>`, obtido em
`POST /api/auth/login`.

---

## 10. Segurança e privacidade — decisões de projeto

- Senhas de administrador com **bcrypt**; sessões administrativas via **JWT** com expiração.
- **Helmet** (cabeçalhos HTTP), **CORS** restrito à origem do frontend, **rate limiting** geral e
  um limite mais restrito na rota de IA.
- Toda entrada é validada com **Zod** antes de tocar o banco.
- Conversas com a Nina **não são armazenadas no servidor** — o histórico existe apenas na memória
  do navegador durante a sessão de chat.
- O checklist de segurança digital (área Proteger) é salvo **apenas em `localStorage`**, no
  navegador da usuária, e nunca é enviado ao backend.
- Histórias enviadas pelo público **nunca são publicadas automaticamente** — entram como
  `PENDENTE` e exigem moderação manual no painel administrativo.
- Estatísticas de demonstração são marcadas com `isDemo: true` no banco e sinalizadas na
  interface com o rótulo "dado fictício" — não substitua esse padrão por dados reais sem revisar
  a flag.
- O botão "Sair rápido" apenas redireciona a aba para outro site; a interface não afirma (porque
  não seria verdade) que ele apaga histórico do navegador.

Para produção, considere adicionalmente: mover o token de admin de `localStorage` para um cookie
`httpOnly`/`secure`, configurar HTTPS, revisar os limites de rate limiting para o tráfego
esperado, e adicionar monitoramento/observabilidade.

---

## 11. Acessibilidade

- HTML semântico (`header`, `nav`, `main`, `footer`, `article`), link de "pular para o conteúdo".
- Navegação por teclado com foco visível em todos os elementos interativos.
- Labels associados a todos os campos de formulário; uso de `aria-label`/`aria-live` onde
  necessário (busca, chat da Nina, checklist de progresso).
- Estados de carregamento, vazio e erro explícitos em todas as páginas que consultam a API.
- Contraste de cores calculado para atender AA em texto sobre fundo (paleta em
  `frontend/src/styles/global.css`).
- Respeita `prefers-reduced-motion`.

---

## 12. Checklist antes de publicar

Este projeto foi desenvolvido e revisado como código, mas **não foi executado em um ambiente com
PostgreSQL e acesso à internet** durante sua geração. Antes de considerar o projeto pronto,
rode localmente e confirme:

- [ ] `npm install` sem erros em `backend/` e `frontend/`
- [ ] `npx prisma migrate dev` cria as tabelas sem erros
- [ ] `npm run seed` popula o banco sem erros
- [ ] `npm run dev` do backend sobe sem erros e `GET /api/health` responde
- [ ] `npm run dev` do frontend sobe e todas as páginas carregam sem erro no console
- [ ] Login administrativo funciona e o token protege as rotas de escrita
- [ ] CRUD de conteúdos, serviços e moderação de histórias funcionam de ponta a ponta
- [ ] Mapa (Leaflet) renderiza e os marcadores correspondem aos serviços cadastrados
- [ ] Gráficos (Recharts) renderizam com os dados de `/api/statistics`
- [ ] `POST /api/ai/chat` responde corretamente com uma `GROQ_API_KEY` válida configurada
- [ ] Nenhuma chave secreta aparece no bundle do frontend (`grep -r GROQ frontend/dist` deve
      retornar vazio após o build)
- [ ] Build de produção (`npm run build` em ambos os pacotes) conclui sem erros

---

## 13. Licença e uso

Projeto desenvolvido para fins educacionais e de extensão universitária. Adapte livremente para
a realidade da sua instituição, sempre revisando o conteúdo educativo com profissionais
especializados (saúde, psicologia, direito) antes de publicar para o público real.
