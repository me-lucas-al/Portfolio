export interface TimelineImage {
  src: string
  alt: string
}

export interface TimelineGraveyardIdea {
  titlePt: string
  titleEn: string
  descriptionPt: string
  descriptionEn: string
}

export interface TimelineSequenceStep {
  datePt: string
  dateEn: string
  labelPt: string
  labelEn: string
}

export interface TimelineMilestone {
  slug: string
  kind: "milestone" | "gap"
  dateLabelPt: string
  dateLabelEn: string
  titlePt: string
  titleEn: string
  impactPt: string
  impactEn: string
  tags: string[]
  problemPt: string
  problemEn: string
  inflectionPt: string
  inflectionEn: string
  solutionPt: string
  solutionEn: string
  beforeImage?: TimelineImage
  afterImage?: TimelineImage
  sequence?: TimelineSequenceStep[]
  graveyard?: TimelineGraveyardIdea[]
}

export const timelineMilestones: TimelineMilestone[] = [
  {
    slug: "fundacao-cms",
    kind: "milestone",
    dateLabelPt: "Jan – Fev 2026",
    dateLabelEn: "Jan – Feb 2026",
    titlePt: "A Fundação e o CMS",
    titleEn: "The Foundation and the CMS",
    impactPt: "Antes de qualquer coisa, eu precisava de um portfólio que eu mesmo pudesse atualizar sem tocar em código.",
    impactEn: "Before anything else, I needed a portfolio I could update myself without touching code.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Zod", "Turborepo"],
    problemPt:
      "No começo cheguei a cogitar um portfólio simples, só umas páginas estáticas. Mas bastou imaginar a rotina: terminar um curso, editar código à mão, redeployar o site inteiro só para acrescentar uma linha numa lista. Eu sabia que ia atualizar esse portfólio toda semana, e não queria que cada atualização virasse uma pequena via-crúcis de código.",
    problemEn:
      "At first I considered a simple portfolio, just a few static pages. But it took only imagining the routine to change my mind: finish a course, hand-edit code, redeploy the whole site just to add one line to a list. I knew I'd be updating this portfolio every week, and I didn't want every update to turn into a small code ordeal.",
    inflectionPt:
      "Não fui atrás de tecnologia nova só para parecer moderno no currículo. Fui atrás do que eu já dominava no dia a dia — Next.js, PostgreSQL, Prisma — porque a prioridade ali era sair do papel rápido e com confiança, não aprender ferramenta nova arriscando travar o projeto antes mesmo dele começar.",
    inflectionEn:
      "I didn't chase new technology just to look modern on a resume. I went with what I already knew well day to day — Next.js, PostgreSQL, Prisma — because the priority was moving fast with confidence, not learning a new tool and risking stalling the project before it even started.",
    solutionPt:
      "Construí uma base de monorepo com autenticação própria e um painel de controle simples, com permissões por papel, para eu mesmo entrar e editar tudo — projetos, cursos, certificações — sem mexer em uma linha de código. Desde o primeiro dia, esse portfólio nunca foi um site estático: nasceu como um sistema vivo, pensado para crescer comigo.",
    solutionEn:
      "I built a monorepo foundation with my own authentication and a simple control panel with role-based permissions, so I could log in myself and edit everything — projects, courses, certifications — without touching a line of code. From day one, this portfolio was never a static site: it was born as a living system, meant to grow alongside me.",
  },
  {
    slug: "batalha-midias",
    kind: "milestone",
    dateLabelPt: "Mar – Abr 2026",
    dateLabelEn: "Mar – Apr 2026",
    titlePt: "A Batalha das Mídias e do Deploy",
    titleEn: "The Media and Deploy Battle",
    impactPt: "Um carrossel cheio de buracos, com imagens que sumiam sem motivo aparente, me obrigou a repensar toda a camada de mídia e a infraestrutura por trás do site.",
    impactEn: "A carousel full of holes, with images vanishing for no apparent reason, forced me to rethink the entire media layer and the infrastructure behind the site.",
    tags: ["Vercel", "Server Actions", "Cloudinary", "SOLID"],
    problemPt:
      "Comecei a notar imagens do carrossel de projetos que simplesmente não carregavam: a página pedia a imagem, o link existia, mas às vezes o arquivo não vinha, como se o Firebase esquecesse dele no meio do caminho. Tentei investigar de várias formas, mas o problema ia e voltava sem um padrão claro. Enquanto isso, o Docker rodando em produção, só para hospedar um portfólio pessoal, já parecia peso morto.",
    problemEn:
      "I started noticing project carousel images that simply wouldn't load: the page requested the image, the link existed, but sometimes the file just wouldn't show up, as if Firebase forgot about it halfway through. I tried investigating in several ways, but the problem came and went with no clear pattern. Meanwhile, Docker running in production, just to host a personal portfolio, already felt like dead weight.",
    inflectionPt:
      "Cheguei a um ponto em que continuar caçando esse bug fantasma, provedor por provedor, não fazia mais sentido: eu ia gastar mais tempo remendando um sintoma do que resolvendo a causa. Decidi que a solução não era depurar mais, era trocar de provedor de vez, por um pensado especificamente para servir mídia, e ao mesmo tempo simplificar a infraestrutura que sustentava tudo isso.",
    inflectionEn:
      "I reached a point where chasing that ghost bug provider by provider no longer made sense: I'd spend more time patching a symptom than fixing the cause. I decided the solution wasn't more debugging, it was switching providers for good, to one built specifically to serve media, while also simplifying the infrastructure holding everything up.",
    solutionPt:
      "Tirei o Docker de produção e passei a rodar direto na Vercel com Server Actions, e troquei o Firebase pelo Cloudinary. A migração em si foi tranquila, sem o site sair do ar ou os visitantes notarem qualquer coisa quebrada. E para essa dor nunca mais se repetir do mesmo jeito, isolei todo o provedor de mídia atrás de uma interface própria (Inversão de Dependência): da próxima vez que eu precisar trocar de provedor, é questão de horas, não de semanas de depuração.",
    solutionEn:
      "I removed Docker from production and started running straight on Vercel with Server Actions, and replaced Firebase with Cloudinary. The migration itself was smooth, with no downtime or anything visibly broken for visitors. And so this kind of pain would never repeat the same way, I isolated the media provider behind its own interface (Dependency Inversion): next time I need to switch providers, it's a matter of hours, not weeks of debugging.",
  },
  {
    slug: "hiato",
    kind: "gap",
    dateLabelPt: "Mai – Jul 2026",
    dateLabelEn: "May – Jul 2026",
    titlePt: "O Hiato",
    titleEn: "The Gap",
    impactPt: "Achei que tinha terminado. Levei semanas para perceber que não tinha.",
    impactEn: "I thought I was done. It took weeks to realize I wasn't.",
    tags: [],
    problemPt:
      "Depois da correria pra resolver mídia e infraestrutura, cheguei a acreditar que o portfólio estava pronto: no ar, funcionando, sem bugs visíveis. Passei um bom tempo sem tocar em uma linha de código. Mas, aos poucos, esse silêncio começou a incomodar, cada vez que eu revisitava o site, notava mais alguma coisa que parecia datada, genérica, ou que simplesmente não parecia \"minha\". A insatisfação foi crescendo devagar, até virar vontade real de mudar tudo de novo.",
    problemEn:
      "After the rush to fix media and infrastructure, I actually believed the portfolio was done: live, working, no visible bugs. I went a good while without touching a line of code. But little by little, that silence started to bother me, every time I revisited the site, I noticed one more thing that felt dated, generic, or simply didn't feel like \"me\". The dissatisfaction grew slowly, until it became a real urge to change everything again.",
    inflectionPt:
      "Não teve um estalo único, um bug ou um evento que me fez voltar, foi mais uma inquietação acumulada, semana após semana, até que ficou mais fácil abrir o editor de novo do que continuar ignorando.",
    inflectionEn:
      "There wasn't a single spark, a bug or an event that brought me back, it was more of a restlessness that built up, week after week, until it became easier to open the editor again than to keep ignoring it.",
    solutionPt:
      "A retomada veio em agosto, e não foi um retorno morno: foi o mês mais intenso de todo o projeto, com mais mudanças em quatro semanas do que nos sete meses anteriores somados, como se toda aquela insatisfação acumulada tivesse virado combustível de uma vez.",
    solutionEn:
      "Work resumed in August, and it wasn't a lukewarm comeback: it was the most intense month of the entire project, with more changes in four weeks than in the previous seven months combined, as if all that pent-up dissatisfaction had turned into fuel all at once.",
  },
  {
    slug: "era-ia-avatar",
    kind: "milestone",
    dateLabelPt: "Ago 2026",
    dateLabelEn: "Aug 2026",
    titlePt: "A Era da IA e o Pivô do Avatar",
    titleEn: "The AI Era and the Avatar Pivot",
    impactPt: "Num único dia, dois motores 3D foram testados e descartados antes de eu encontrar a cara certa para o assistente: um avatar 2D inspirado no Xbox 360.",
    impactEn: "In a single day, two 3D engines were tested and discarded before I found the right face for the assistant: a 2D avatar inspired by Xbox 360.",
    tags: ["RAG", "pgvector", "Gemini", "Three.js", "SEO", "i18n"],
    problemPt:
      "Voltei ao projeto com domínio próprio e SEO no ar, mas tinha um problema que me incomodava mais do que qualquer bug técnico: o assistente virtual que eu tinha acabado de criar funcionava, respondia bem, mas era genérico. Podia ser o chat de suporte de qualquer empresa. E a cara do site, ainda em preto e azul sem graça, também não parecia ter identidade nenhuma.",
    problemEn:
      "I came back to the project with my own domain and SEO live, but there was a problem bothering me more than any technical bug: the virtual assistant I had just built worked, answered well, but was generic. It could've been the support chat of any company. And the site's look, still in a plain black and blue, didn't feel like it had any identity either.",
    inflectionPt:
      "Tentei resolver isso dando um rosto ao assistente. Primeiro, um avatar 3D em VRM, com blendshapes para expressões faciais. Funcionava tecnicamente, mas o esforço para deixá-lo bom, ajustar cada expressão, cada movimento, era desproporcional ao resultado. Ainda no mesmo dia, tentei uma segunda saída: um motor 3D construído do zero com Three.js, WebGL e sincronização labial pela análise do áudio. De novo, a complexidade de manter aquilo vivo não compensava o que ele entregava visualmente. Duas tentativas 3D, descartadas as duas no mesmo dia, 25 de agosto.",
    inflectionEn:
      "I tried solving this by giving the assistant a face. First, a 3D VRM avatar with blendshapes for facial expressions. It worked technically, but the effort to make it good, tuning every expression, every movement, was disproportionate to the result. That same day, I tried a second way out: a 3D engine built from scratch with Three.js, WebGL and audio-driven lip-sync. Again, the complexity of keeping that alive wasn't worth what it delivered visually. Two 3D attempts, both discarded on the same day, August 25th.",
    solutionPt:
      "A saída mais simples acabou sendo a certa: um personagem 2D inspirado nos avatares do Xbox 360, muito mais fácil de manter e, para minha surpresa, com bem mais personalidade do que qualquer uma das tentativas 3D. No dia seguinte, aproveitei o embalo e troquei toda a paleta preto e azul por tons quentes, âmbar com um toque de violeta, a identidade visual que faltava desde o início.",
    solutionEn:
      "The simplest way out turned out to be the right one: a 2D character inspired by Xbox 360 avatars, much easier to maintain and, to my surprise, with a lot more personality than any of the 3D attempts. The next day, riding that momentum, I swapped the entire black-and-blue palette for warm tones, amber with a touch of violet, the visual identity that had been missing from the start.",
    sequence: [
      {
        datePt: "11–13/08",
        dateEn: "Aug 11–13",
        labelPt: "Domínio próprio no ar e SEO avançado: JSON-LD, sitemap e Google Search Console.",
        labelEn: "Own domain goes live and advanced SEO ships: JSON-LD, sitemap and Google Search Console.",
      },
      {
        datePt: "17/08",
        dateEn: "Aug 17",
        labelPt: "Motor de busca semântica (RAG com pgvector) no ar, usando o Gemini, modelo que eu já conhecia de outros projetos; primeira versão do assistente, ainda em formato de chat comum.",
        labelEn: "Semantic search engine (RAG with pgvector) goes live, using Gemini, a model I already knew from other projects; first assistant version, still a regular chat.",
      },
      {
        datePt: "18–21/08",
        dateEn: "Aug 18–21",
        labelPt: "Blindagem do assistente: rate limiting, cache de respostas, fallback de modelo e ingestão de PDFs, DOCX e CSV.",
        labelEn: "Assistant hardening: rate limiting, answer caching, model fallback, and PDF/DOCX/CSV ingestion.",
      },
      {
        datePt: "24/08",
        dateEn: "Aug 24",
        labelPt: "Voz (TTS) implementada; primeiros testes automatizados (unitários e E2E); início da tentativa de avatar 3D em VRM.",
        labelEn: "Voice (TTS) implemented; first automated tests (unit and E2E); start of the 3D VRM avatar attempt.",
      },
      {
        datePt: "25/08",
        dateEn: "Aug 25",
        labelPt: "VRM descartado → Three.js tentado e também descartado → pouso no sprite 2D, tudo no mesmo dia.",
        labelEn: "VRM discarded → Three.js tried and also discarded → landed on the 2D sprite, all in the same day.",
      },
      {
        datePt: "26/08",
        dateEn: "Aug 26",
        labelPt: "Nova paleta (âmbar + violeta) substitui o preto e azul genéricos em todo o site.",
        labelEn: "New palette (amber + violet) replaces the generic black and blue across the entire site.",
      },
    ],
    graveyard: [
      {
        titlePt: "Avatar 3D (VRM)",
        titleEn: "3D Avatar (VRM)",
        descriptionPt:
          "Primeira tentativa de dar um rosto ao assistente: um modelo 3D baseado em VRM, com blendshapes para expressões faciais. Funcionava, mas o trabalho para deixar cada expressão convincente pesava mais do que o resultado justificava.",
        descriptionEn:
          "First attempt to give the assistant a face: a 3D VRM-based model with blendshapes for facial expressions. It worked, but the work to make each expression convincing outweighed what the result justified.",
      },
      {
        titlePt: "Motor Three.js",
        titleEn: "Three.js Engine",
        descriptionPt:
          "No mesmo dia, uma segunda tentativa: um motor 3D construído do zero com Three.js, WebGL e sincronização labial por análise de áudio. Também descartado, manter aquele motor vivo custaria caro demais para o ganho visual que trazia.",
        descriptionEn:
          "On that same day, a second attempt: a 3D engine built from scratch with Three.js, WebGL and audio-driven lip-sync. Also discarded, keeping that engine alive would cost too much for the visual gain it brought.",
      },
    ],
  },
  {
    slug: "refinamento",
    kind: "milestone",
    dateLabelPt: "Set 2026",
    dateLabelEn: "Sep 2026",
    titlePt: "Refinamento",
    titleEn: "Refinement",
    impactPt: "Com a identidade visual e o assistente resolvidos, era hora de polir os detalhes e fechar o catálogo de conquistas.",
    impactEn: "With the visual identity and the assistant settled, it was time to polish the details and close out the achievements catalog.",
    tags: ["UI polish", "Cursos", "Certificações"],
    problemPt:
      "A conversa com o avatar ainda tinha umas arestas visuais, meio cruas. E Formação Acadêmica e Cursos apareciam misturados numa lista só, o que dificultava bater o olho e entender rápido o que era formação formal e o que era aprendizado por conta própria.",
    problemEn:
      "The conversation with the avatar still had some rough visual edges. And Academic Background and Courses appeared mixed into a single list, making it hard to scan quickly and tell what was formal education apart from self-driven learning.",
    inflectionPt:
      "Separar essas duas categorias deixaria mais claro o que é formação formal e o que é aprendizado contínuo, além de abrir espaço pra mostrar certificados sem poluir a lista.",
    inflectionEn:
      "Separating these two categories would make it clearer what's formal education and what's continuous learning, and make room to show certificates without cluttering the list.",
    solutionPt:
      "Em 01/09, refatorei a interface imersiva do diálogo pro formato visual novel completo, com arte de sprite gerada via IA. Em 02/09, separei os módulos de Cursos e Formação, com preview de certificados direto no card.",
    solutionEn:
      "On 09/01, I refactored the immersive dialogue interface into the full visual novel format, with sprite art generated via AI. On 09/02, I split the Courses and Education modules apart, with certificate previews right on the card.",
  },
]
