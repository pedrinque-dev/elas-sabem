import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do Elas Sabem...");

  // ---------- ADMIN ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@elassabem.org";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "TrocarEssaSenha123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Equipe Elas Sabem",
      email: adminEmail,
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`👤 Admin criado/atualizado: ${admin.email}`);

  // ---------- CATEGORIAS ----------
  const categoriesData = [
    { slug: "violencia-fisica", name: "Violência física", area: "ENTENDER" as const, icon: "shield-alert", order: 1 },
    { slug: "violencia-psicologica", name: "Violência psicológica", area: "ENTENDER" as const, icon: "brain", order: 2 },
    { slug: "violencia-sexual", name: "Violência sexual", area: "ENTENDER" as const, icon: "shield", order: 3 },
    { slug: "violencia-patrimonial", name: "Violência patrimonial", area: "ENTENDER" as const, icon: "wallet", order: 4 },
    { slug: "violencia-moral", name: "Violência moral", area: "ENTENDER" as const, icon: "message-circle-warning", order: 5 },
    { slug: "violencia-digital", name: "Violência digital", area: "ENTENDER" as const, icon: "smartphone", order: 6 },
    { slug: "stalking", name: "Stalking e perseguição", area: "ENTENDER" as const, icon: "eye", order: 7 },
    { slug: "violencia-domestica", name: "Violência doméstica", area: "ENTENDER" as const, icon: "home", order: 8 },
    { slug: "feminicidio", name: "Feminicídio: entenda os sinais", area: "ENTENDER" as const, icon: "alert-triangle", order: 9 },
    { slug: "relacionamentos-saudaveis", name: "Relacionamentos saudáveis", area: "ENTENDER" as const, icon: "heart-handshake", order: 10 },

    { slug: "saude-fisica", name: "Saúde física", area: "CUIDAR" as const, icon: "activity", order: 1 },
    { slug: "saude-mental", name: "Saúde mental", area: "CUIDAR" as const, icon: "brain", order: 2 },
    { slug: "saude-sexual-reprodutiva", name: "Saúde sexual e reprodutiva", area: "CUIDAR" as const, icon: "flower", order: 3 },
    { slug: "autocuidado", name: "Autocuidado no dia a dia", area: "CUIDAR" as const, icon: "sparkles", order: 4 },
    { slug: "fases-da-vida", name: "Saúde em cada fase da vida", area: "CUIDAR" as const, icon: "calendar", order: 5 },

    { slug: "seguranca-digital", name: "Segurança digital", area: "PROTEGER" as const, icon: "lock", order: 1 },
    { slug: "senhas-autenticacao", name: "Senhas e autenticação", area: "PROTEGER" as const, icon: "key", order: 2 },
    { slug: "privacidade-redes", name: "Privacidade em redes sociais", area: "PROTEGER" as const, icon: "user-x", order: 3 },
    { slug: "localizacao", name: "Compartilhamento de localização", area: "PROTEGER" as const, icon: "map-pin", order: 4 },
    { slug: "exposicao-imagens", name: "Exposição de imagens e vídeos", area: "PROTEGER" as const, icon: "image-off", order: 5 },

    { slug: "materiais-adolescentes", name: "Materiais para adolescentes", area: "EDUCACAO" as const, icon: "book-open", order: 1 },
    { slug: "materiais-professores", name: "Materiais para professores", area: "EDUCACAO" as const, icon: "graduation-cap", order: 2 },

    { slug: "como-escutar", name: "Como escutar sem julgar", area: "COMO_AJUDAR" as const, icon: "ear", order: 1 },
    { slug: "como-buscar-servicos", name: "Como buscar serviços adequados", area: "COMO_AJUDAR" as const, icon: "compass", order: 2 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = category.id;
  }
  console.log(`📚 ${categoriesData.length} categorias criadas.`);

  // ---------- CONTEÚDOS ----------
  const now = new Date();
  const contentsData = [
    {
      slug: "o-que-e-violencia-psicologica",
      title: "O que é violência psicológica e como reconhecer",
      summary: "Entenda os principais sinais de controle emocional, humilhação e manipulação em relacionamentos.",
      body: "# Violência psicológica\n\nA violência psicológica pode se manifestar através de humilhações, ameaças, controle excessivo, isolamento social e desvalorização constante...\n\n## Sinais comuns\n\n- Controle sobre quem você pode ver ou onde pode ir\n- Críticas constantes à sua aparência ou capacidade\n- Ameaças veladas ou explícitas\n- Ciúmes excessivo apresentado como \"cuidado\"\n\nSe você reconhece esses sinais, saiba que não está sozinha e que buscar informação é um primeiro passo importante.",
      area: "ENTENDER" as const,
      categorySlug: "violencia-psicologica",
      tags: ["controle", "manipulação", "relacionamento"],
      readTimeMin: 5,
    },
    {
      slug: "violencia-digital-o-que-fazer",
      title: "Violência digital: o que é e o que fazer",
      summary: "Controle de celular, exposição não consentida de imagens e perseguição online são formas de violência digital.",
      body: "# Violência digital\n\nA violência digital inclui monitoramento não consentido de celular e redes sociais, compartilhamento não autorizado de imagens íntimas, ameaças por mensagens e perseguição online...\n\n## O que fazer\n\n1. Documente (prints, datas, horários)\n2. Não apague as evidências\n3. Busque orientação em um serviço especializado\n4. Revise as configurações de privacidade das suas contas",
      area: "ENTENDER" as const,
      categorySlug: "violencia-digital",
      tags: ["celular", "redes sociais", "privacidade"],
      readTimeMin: 4,
    },
    {
      slug: "sinais-de-relacionamento-saudavel",
      title: "Sinais de um relacionamento saudável",
      summary: "Respeito, autonomia e comunicação são a base de relações saudáveis. Veja o que observar.",
      body: "# Relacionamentos saudáveis\n\nUm relacionamento saudável é construído com respeito mútuo, liberdade para manter amizades e interesses próprios, comunicação aberta e apoio nos momentos difíceis...",
      area: "ENTENDER" as const,
      categorySlug: "relacionamentos-saudaveis",
      tags: ["respeito", "comunicação", "autonomia"],
      readTimeMin: 4,
    },
    {
      slug: "saude-mental-primeiros-passos",
      title: "Saúde mental: primeiros passos para se cuidar",
      summary: "Pequenas práticas diárias e quando buscar apoio profissional para a sua saúde emocional.",
      body: "# Saúde mental\n\nCuidar da saúde mental envolve reconhecer emoções, criar rotinas de autocuidado e, quando necessário, buscar apoio profissional. Este conteúdo é informativo e não substitui acompanhamento psicológico ou psiquiátrico.",
      area: "CUIDAR" as const,
      categorySlug: "saude-mental",
      tags: ["ansiedade", "bem-estar", "terapia"],
      readTimeMin: 6,
    },
    {
      slug: "saude-sexual-reprodutiva-informacoes",
      title: "Saúde sexual e reprodutiva: informações essenciais",
      summary: "Planejamento familiar, prevenção de ISTs e acompanhamento ginecológico regular.",
      body: "# Saúde sexual e reprodutiva\n\nO acompanhamento ginecológico regular, o uso de métodos contraceptivos adequados às suas necessidades e a prevenção de infecções sexualmente transmissíveis são pilares importantes do autocuidado.",
      area: "CUIDAR" as const,
      categorySlug: "saude-sexual-reprodutiva",
      tags: ["ginecologia", "prevenção", "planejamento familiar"],
      readTimeMin: 5,
    },
    {
      slug: "senhas-fortes-passo-a-passo",
      title: "Como criar senhas fortes e ativar a autenticação em duas etapas",
      summary: "Um guia prático para proteger suas contas de e-mail e redes sociais.",
      body: "# Segurança de contas\n\nUse senhas longas e únicas para cada serviço, ative a autenticação em duas etapas sempre que possível, e nunca compartilhe códigos de verificação recebidos por SMS ou e-mail...",
      area: "PROTEGER" as const,
      categorySlug: "senhas-autenticacao",
      tags: ["senhas", "2FA", "contas"],
      readTimeMin: 4,
    },
    {
      slug: "privacidade-em-redes-sociais",
      title: "Ajustando a privacidade das suas redes sociais",
      summary: "Quem pode ver suas postagens, sua localização e suas listas de amigos.",
      body: "# Privacidade em redes sociais\n\nRevise periodicamente quem pode ver seu perfil, desative o compartilhamento automático de localização em fotos e considere restringir sua lista de contatos a pessoas conhecidas.",
      area: "PROTEGER" as const,
      categorySlug: "privacidade-redes",
      tags: ["instagram", "facebook", "configurações"],
      readTimeMin: 3,
    },
    {
      slug: "como-escutar-sem-julgar",
      title: "Como escutar sem julgar quem está passando por uma situação difícil",
      summary: "Orientações para familiares e amigos que querem apoiar uma mulher em situação de violência.",
      body: "# Como escutar\n\nEscute sem interromper, evite frases como \"por que você não sai logo\", valide os sentimentos da pessoa e ofereça-se para acompanhá-la até um serviço de apoio, sem forçar decisões.",
      area: "COMO_AJUDAR" as const,
      categorySlug: "como-escutar",
      tags: ["apoio", "escuta ativa", "acolhimento"],
      readTimeMin: 4,
    },
  ];

  for (const c of contentsData) {
    const { categorySlug, ...data } = c;
    await prisma.content.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        ...data,
        categoryId: categories[categorySlug],
        status: "PUBLICADO",
        publishedAt: now,
        authorId: admin.id,
      },
    });
  }
  console.log(`📝 ${contentsData.length} conteúdos publicados.`);

  // ---------- QUIZ ----------
  const quiz = await prisma.quiz.upsert({
    where: { slug: "voce-reconhece-os-sinais" },
    update: {},
    create: {
      slug: "voce-reconhece-os-sinais",
      title: "Você reconhece os sinais?",
      description:
        "Um exercício reflexivo com situações do cotidiano. Não é um diagnóstico — é um convite para observar e se informar.",
    },
  });

  const existingQuestions = await prisma.question.count({ where: { quizId: quiz.id } });
  if (existingQuestions === 0) {
    const q1 = await prisma.question.create({
      data: {
        quizId: quiz.id,
        order: 1,
        prompt: "Seu parceiro pede para ver as mensagens do seu celular sempre que quer.",
        answers: {
          create: [
            {
              order: 1,
              isSignal: true,
              text: "Isso me incomoda, mas acho que é normal em um relacionamento.",
              explanation:
                "Pedir acesso constante ao celular do parceiro, mesmo apresentado como \"cuidado\", pode ser uma forma de controle. Relacionamentos saudáveis se baseiam em confiança, não em vigilância.",
            },
            {
              order: 2,
              isSignal: false,
              text: "Eu decido o que compartilho e sinto que isso é respeitado.",
              explanation:
                "Ótimo sinal: respeito pela sua privacidade e autonomia é uma base importante de relacionamentos saudáveis.",
            },
          ],
        },
      },
    });

    await prisma.question.create({
      data: {
        quizId: quiz.id,
        order: 2,
        prompt: "Você evita ver certas amigas porque seu parceiro não gosta delas.",
        answers: {
          create: [
            {
              order: 1,
              isSignal: true,
              text: "Sim, prefiro evitar conflitos.",
              explanation:
                "O isolamento social — mesmo gradual — é um padrão comum em relações abusivas. Manter vínculos com amigos e família é importante para sua rede de apoio.",
            },
            {
              order: 2,
              isSignal: false,
              text: "Não, mantenho minhas amizades normalmente.",
              explanation:
                "A liberdade de manter suas relações sociais é um sinal de respeito à sua autonomia.",
            },
          ],
        },
      },
    });
    console.log(`❓ Quiz "${quiz.title}" criado com 2 perguntas.`);
    void q1;
  }

  // ---------- SERVICE CATEGORIES ----------
  const serviceCategoriesData = [
    { slug: "saude", name: "Saúde" },
    { slug: "assistencia-social", name: "Assistência social" },
    { slug: "juridico", name: "Atendimento jurídico" },
    { slug: "seguranca-publica", name: "Segurança pública" },
    { slug: "especializado", name: "Atendimento especializado" },
  ];
  const serviceCategories: Record<string, string> = {};
  for (const sc of serviceCategoriesData) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: sc.slug },
      update: {},
      create: sc,
    });
    serviceCategories[sc.slug] = created.id;
  }

  // ---------- SERVICES (dados de demonstração fictícios) ----------
  const servicesData = [
    {
      name: "Centro de Referência da Mulher (demonstração)",
      categorySlug: "especializado",
      address: "Endereço de demonstração, 100",
      city: "São Paulo",
      state: "SP",
      latitude: -23.5505,
      longitude: -46.6333,
      hours: "Segunda a sexta, 8h às 17h",
      verified: false,
    },
    {
      name: "CRAS - Centro de Referência de Assistência Social (demonstração)",
      categorySlug: "assistencia-social",
      address: "Endereço de demonstração, 200",
      city: "Guararema",
      state: "SP",
      latitude: -23.4136,
      longitude: -46.0364,
      hours: "Segunda a sexta, 8h às 16h",
      verified: false,
    },
    {
      name: "Delegacia Especializada de Atendimento à Mulher (demonstração)",
      categorySlug: "seguranca-publica",
      address: "Endereço de demonstração, 300",
      city: "Rio de Janeiro",
      state: "RJ",
      latitude: -22.9068,
      longitude: -43.1729,
      is24h: true,
      verified: false,
    },
    {
      name: "Defensoria Pública - Núcleo de Direitos da Mulher (demonstração)",
      categorySlug: "juridico",
      address: "Endereço de demonstração, 400",
      city: "Belo Horizonte",
      state: "MG",
      latitude: -19.9167,
      longitude: -43.9345,
      hours: "Segunda a sexta, 9h às 18h",
      verified: false,
    },
    {
      name: "UBS com atendimento em saúde da mulher (demonstração)",
      categorySlug: "saude",
      address: "Endereço de demonstração, 500",
      city: "Curitiba",
      state: "PR",
      latitude: -25.4284,
      longitude: -49.2733,
      hours: "Segunda a sábado, 7h às 19h",
      verified: false,
    },
  ];

  for (const s of servicesData) {
    const { categorySlug, ...data } = s;
    const exists = await prisma.service.findFirst({ where: { name: s.name } });
    if (!exists) {
      await prisma.service.create({
        data: { ...data, categoryId: serviceCategories[categorySlug] },
      });
    }
  }
  console.log(`🗺️  ${servicesData.length} serviços de demonstração criados (dados fictícios).`);

  // ---------- SOURCE + STATISTICS (dados fictícios claramente sinalizados) ----------
  const demoSource = await prisma.source.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Dados de demonstração — Elas Sabem",
      url: undefined,
    },
  });

  const statisticsData = [
    { indicator: "Notificações de violência doméstica", category: "violência", region: "BR", period: "2023", value: 240, unit: "mil casos (fictício)" },
    { indicator: "Notificações de violência doméstica", category: "violência", region: "BR", period: "2024", value: 255, unit: "mil casos (fictício)" },
    { indicator: "Buscas por atendimento psicológico", category: "saúde", region: "BR", period: "2023", value: 18, unit: "% (fictício)" },
    { indicator: "Buscas por atendimento psicológico", category: "saúde", region: "BR", period: "2024", value: 22, unit: "% (fictício)" },
    { indicator: "Casos de exposição não consentida de imagens", category: "violência digital", region: "BR", period: "2024", value: 12, unit: "mil casos (fictício)" },
  ];

  for (const s of statisticsData) {
    const exists = await prisma.statistic.findFirst({
      where: { indicator: s.indicator, period: s.period, region: s.region },
    });
    if (!exists) {
      await prisma.statistic.create({
        data: {
          ...s,
          isDemo: true,
          description: "Dado fictício de demonstração, utilizado para ilustrar o funcionamento do dashboard.",
          sourceId: demoSource.id,
        },
      });
    }
  }
  console.log(`📊 ${statisticsData.length} indicadores de demonstração criados (marcados como fictícios).`);

  // ---------- HISTÓRIAS ----------
  const storiesData = [
    {
      authorName: "Marina, 34 anos",
      title: "Reconstruí minha vida financeira sozinha",
      excerpt: "Depois de anos sem autonomia financeira, aprendi a organizar minhas finanças e recomeçar.",
      body: "Depois de anos sem acesso às minhas próprias finanças, decidi buscar ajuda em um centro de referência e, aos poucos, reconstruí minha independência...",
      theme: "superação",
      status: "APROVADO" as const,
      featured: true,
    },
    {
      authorName: "Juliana, 28 anos",
      title: "Voltei a estudar depois dos 25",
      excerpt: "O acesso à informação me deu coragem para retomar meus estudos e mudar de carreira.",
      body: "Retomar os estudos parecia impossível, mas encontrei apoio e informações que me ajudaram a planejar o retorno...",
      theme: "educação",
      status: "APROVADO" as const,
      featured: true,
    },
    {
      authorName: "Camila, 41 anos",
      title: "Abri meu primeiro pequeno negócio",
      excerpt: "Com apoio de uma rede de mulheres empreendedoras, comecei do zero.",
      body: "Sempre tive vontade de empreender, mas faltava rede de apoio e informação. Encontrei os dois...",
      theme: "empreendedorismo",
      status: "APROVADO" as const,
      featured: false,
    },
  ];

  for (const s of storiesData) {
    const exists = await prisma.story.findFirst({ where: { title: s.title } });
    if (!exists) await prisma.story.create({ data: s });
  }
  console.log(`💬 ${storiesData.length} histórias de demonstração criadas.`);

  // ---------- MATERIAIS EDUCATIVOS ----------
  const materialsData = [
    { title: "Cartilha: Relacionamentos saudáveis na adolescência", description: "Material para uso em sala de aula com adolescentes.", type: "cartilha", audience: "adolescentes", order: 1 },
    { title: "Atividade: Identificando sinais de controle", description: "Dinâmica em grupo para debate sobre controle em relacionamentos.", type: "atividade", audience: "professores", order: 2 },
    { title: "Apresentação: Segurança digital para jovens", description: "Slides prontos para uso em oficinas escolares.", type: "apresentação", audience: "professores", order: 3 },
  ];
  for (const m of materialsData) {
    const exists = await prisma.educationalMaterial.findFirst({ where: { title: m.title } });
    if (!exists) await prisma.educationalMaterial.create({ data: m });
  }
  console.log(`🎓 ${materialsData.length} materiais educativos criados.`);

  console.log("✅ Seed concluído com sucesso.");
  console.log(`\nCredenciais de administrador (desenvolvimento):`);
  console.log(`  E-mail: ${adminEmail}`);
  console.log(`  Senha:  ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
