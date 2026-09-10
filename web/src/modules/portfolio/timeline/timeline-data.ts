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
  narrationPt: string
  narrationEn: string
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
    impactPt: "Imaginei a cena: terminar um curso, mexer no código e publicar o site inteiro de novo só pra acrescentar um item numa lista. Foi aí que decidi que esse portfólio precisava se atualizar sozinho, sem eu ter que abrir o código toda vez.",
    impactEn: "I pictured the scene: finish a course, tweak the code, and publish the whole site again just to add one item to a list. That's when I decided this portfolio needed to update itself, without me having to open the code every time.",
    tags: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Zod", "Turborepo"],
    narrationPt:
      "No começo eu só queria ter um portfólio online. Mas pensei bem: eu ia estar atualizando esse site toda semana, com projeto novo, certificado novo, e não queria ter que mexer no código toda vez só pra isso. Então, antes de qualquer coisa, construí um jeito de eu mesmo entrar no site e editar tudo sozinho, sem precisar programar de novo cada vez. Foi aí que esse portfólio deixou de ser só uma página parada e virou algo vivo, que eu podia atualizar na hora que quisesse.",
    narrationEn:
      "In the beginning, I just wanted an online portfolio. But I thought about it: I'd be updating this site every week, a new project here, a new certificate there, and I didn't want to touch the code every single time just for that. So, before anything else, I built a way to log in myself and edit everything on my own, without having to code it again each time. That's when this portfolio stopped being just a static page and became something alive, something I could update whenever I wanted.",
    problemPt:
      "No começo cheguei a cogitar um portfólio simples, só umas páginas estáticas: era a solução óbvia, a que qualquer tutorial recomendaria pra quem só quer algo no ar rápido. Mas bastou imaginar a rotina real pra essa ideia perder a graça: terminar um curso, abrir o código, editar um array à mão, redeployar o site inteiro só para acrescentar uma linha numa lista de certificações. Eu sabia, antes mesmo de escrever a primeira linha, que ia estar atualizando esse portfólio toda semana, um projeto novo aqui, uma certificação ali, e não queria que cada atualização virasse uma pequena via-crúcis de código só para exibir uma conquista.",
    problemEn:
      "At first I considered a simple portfolio, just a few static pages: the obvious choice, the one any tutorial would recommend to someone who just wants something live fast. But it took only imagining the actual routine for that idea to lose its appeal: finish a course, open the code, hand-edit an array, redeploy the whole site just to add one line to a list of certifications. I knew, before writing a single line, that I'd be updating this portfolio every week, a new project here, a certification there, and I didn't want every update to turn into a small code ordeal just to show off an achievement.",
    inflectionPt:
      "Não fui atrás de tecnologia nova só para parecer moderno no currículo, por mais tentador que fosse listar mais uma stack chamativa. Fui atrás do que eu já dominava no dia a dia (Next.js, PostgreSQL, Prisma) porque a prioridade ali era clara: sair do papel rápido e com confiança, não aprender uma ferramenta nova correndo o risco de travar o projeto antes mesmo dele decolar. Um portfólio parado na metade, por causa de uma tecnologia que eu ainda estava aprendendo, seria pior do que um portfólio simples e funcionando.",
    inflectionEn:
      "I didn't chase new technology just to look modern on a resume, tempting as it was to list one more flashy stack. I went with what I already knew well day to day (Next.js, PostgreSQL, Prisma) because the priority was clear: move fast with confidence, not learn a new tool and risk stalling the project before it even took off. A portfolio stuck halfway, because of a technology I was still learning, would be worse than a simple portfolio that actually worked.",
    solutionPt:
      "Construí uma base de monorepo com autenticação própria e um painel de controle simples, com permissões por papel, para eu mesmo entrar e editar tudo (projetos, cursos, certificações, links) sem mexer em uma linha de código nem depender de um deploy manual. Levou mais tempo do que simplesmente escrever HTML estático, mas foi tempo bem gasto: desde o primeiro dia, esse portfólio nunca foi um site estático publicado uma vez e esquecido. Ele nasceu como um sistema vivo, com banco de dados próprio e regras de acesso, pensado para crescer comigo, e crescer sem dor cada vez que eu tivesse algo novo para mostrar.",
    solutionEn:
      "I built a monorepo foundation with my own authentication and a simple control panel with role-based permissions, so I could log in myself and edit everything (projects, courses, certifications, links) without touching a line of code or depending on a manual deploy. It took longer than just writing static HTML, but it was time well spent: from day one, this portfolio was never a static site published once and forgotten. It was born as a living system, with its own database and access rules, meant to grow alongside me, and grow without pain every time I had something new to show.",
  },
  {
    slug: "batalha-midias",
    kind: "milestone",
    dateLabelPt: "Mar – Abr 2026",
    dateLabelEn: "Mar – Apr 2026",
    titlePt: "A Batalha das Mídias e do Deploy",
    titleEn: "The Media and Deploy Battle",
    impactPt: "A imagem simplesmente não aparecia, do nada, sem um padrão que desse pra entender, como se o serviço que guardava as fotos esquecesse delas no meio do caminho. E, por baixo do capô, a estrutura toda que hospedava o site já pesava mais do que devia.",
    impactEn: "The image would simply vanish, out of nowhere, with no pattern I could pin down, as if the service storing the photos forgot about them halfway through. And under the hood, the whole structure hosting the site already weighed more than it should.",
    tags: ["Vercel", "Server Actions", "Cloudinary", "SOLID"],
    narrationPt:
      "Depois de um tempo, comecei a notar um problema estranho: as fotos dos meus projetos, às vezes, simplesmente não apareciam no site, sem motivo nenhum. Tentei entender o que estava acontecendo, mas o erro ia e voltava sem explicação. Ao mesmo tempo, percebi que toda a estrutura por trás do site estava mais pesada e complicada do que precisava ser, só pra hospedar um portfólio pessoal. Decidi então trocar de vez o jeito como as imagens eram guardadas e simplificar toda essa estrutura. Deu certo: o site ficou mais leve, mais estável, e o problema nunca mais voltou.",
    narrationEn:
      "After a while, I started noticing a strange problem: the photos of my projects would sometimes just not show up on the site, with no clear reason. I tried to figure out what was going on, but the error kept coming and going without an explanation. At the same time, I realized the whole structure behind the site had gotten heavier and more complicated than it needed to be, just to host a personal portfolio. So I decided to change the way images were stored for good, and simplify that whole structure. It worked: the site got lighter, more stable, and the problem never came back.",
    problemPt:
      "Comecei a notar imagens do carrossel de projetos que simplesmente não carregavam: a página pedia a imagem, o link existia, o arquivo devia estar lá, mas às vezes ele não vinha, como se o Firebase esquecesse dele no meio do caminho. Tentei investigar de várias formas (recarregando, trocando de rede, olhando os logs), mas o problema ia e voltava sem um padrão claro, o que é o pior tipo de bug: intermitente e sem uma causa óbvia para apontar. Enquanto isso, em paralelo, o Docker rodando em produção só para hospedar um portfólio pessoal já parecia peso morto: uma camada inteira de complexidade e custo de manutenção para um projeto que não precisava de nada daquilo.",
    problemEn:
      "I started noticing project carousel images that simply wouldn't load: the page requested the image, the link existed, the file was supposed to be there, but sometimes it just wouldn't show up, as if Firebase forgot about it halfway through. I tried investigating in several ways (reloading, switching networks, digging through logs), but the problem came and went with no clear pattern, which is the worst kind of bug: intermittent, with no obvious cause to point at. Meanwhile, in parallel, Docker running in production just to host a personal portfolio already felt like dead weight: a whole layer of complexity and maintenance cost for a project that didn't need any of it.",
    inflectionPt:
      "Cheguei a um ponto em que continuar caçando esse bug fantasma, log por log, provedor por provedor, não fazia mais sentido: eu ia gastar mais tempo remendando um sintoma do que efetivamente resolvendo a causa. Foi aí que decidi mudar de estratégia por completo: a solução não era depurar mais, era trocar de provedor de vez, por um pensado especificamente para servir mídia de forma confiável, e aproveitar o momento para simplificar de uma vez a infraestrutura que sustentava tudo isso, já que o Docker em produção era outro problema esperando para acontecer.",
    inflectionEn:
      "I reached a point where chasing that ghost bug log by log, provider by provider, no longer made sense: I'd spend more time patching a symptom than actually fixing the cause. That's when I decided to change strategy entirely: the solution wasn't more debugging, it was switching providers for good, to one built specifically to serve media reliably, and using the moment to simplify the infrastructure holding everything up once and for all, since Docker in production was another problem waiting to happen.",
    solutionPt:
      "Tirei o Docker de produção de vez e passei a rodar direto na Vercel com Server Actions, e troquei o Firebase pelo Cloudinary, um serviço pensado especificamente para hospedar e otimizar mídia. A migração em si foi tranquila, planejada com calma, sem o site sair do ar em nenhum momento e sem os visitantes notarem qualquer coisa quebrada no meio do processo. E, mais importante do que resolver o bug daquela vez, para essa dor nunca mais se repetir do mesmo jeito, isolei todo o provedor de mídia atrás de uma interface própria (Inversão de Dependência, um dos princípios SOLID): da próxima vez que eu precisar trocar de provedor, é questão de horas reescrevendo uma implementação, não semanas de depuração caçando fantasmas de novo.",
    solutionEn:
      "I removed Docker from production for good and started running straight on Vercel with Server Actions, and replaced Firebase with Cloudinary, a service built specifically to host and optimize media. The migration itself was smooth, carefully planned, with no downtime at any point and nothing visibly broken for visitors during the process. And, more important than fixing that one bug, so this kind of pain would never repeat the same way, I isolated the media provider behind its own interface (Dependency Inversion, one of the SOLID principles): next time I need to switch providers, it's a matter of hours rewriting one implementation, not weeks of debugging chasing ghosts all over again.",
  },
  {
    slug: "hiato",
    kind: "gap",
    dateLabelPt: "Mai – Jul 2026",
    dateLabelEn: "May – Jul 2026",
    titlePt: "O Hiato",
    titleEn: "The Gap",
    impactPt: "Passei semanas sem tocar em uma linha de código, convencido de que o portfólio estava pronto. Só que, toda vez que eu revisitava o site, notava mais alguma coisa que não parecia \"minha\".",
    impactEn: "I went weeks without touching a line of code, convinced the portfolio was done. But every time I revisited the site, I noticed one more thing that didn't feel like \"me\".",
    tags: [],
    narrationPt:
      "Depois de resolver aquilo, cheguei a achar que o portfólio estava pronto. Fiquei um bom tempo sem mexer em nada. Só que, toda vez que eu voltava pra olhar o site, alguma coisa me incomodava: parecia bonito, mas não era a minha cara. Essa sensação foi crescendo aos poucos, até virar uma vontade forte de voltar e mudar tudo de novo.",
    narrationEn:
      "After fixing that, I actually thought the portfolio was done. I went a good while without touching anything. But every time I came back to look at the site, something bothered me: it looked nice, but it wasn't my style. That feeling grew little by little, until it became a strong urge to come back and change everything again.",
    problemPt:
      "Depois da correria pra resolver mídia e infraestrutura, cheguei a acreditar de verdade que o portfólio estava pronto: no ar, funcionando, sem bugs visíveis, cumprindo o que um portfólio precisa cumprir. Passei um bom tempo sem tocar em uma linha de código, achando que essa fase tinha se encerrado. Mas, aos poucos, esse silêncio começou a incomodar mais do que eu esperava: cada vez que eu revisitava o site, mesmo só de passagem, notava mais alguma coisa que parecia datada, genérica, ou que simplesmente não parecia \"minha\", como se o site estivesse tecnicamente correto, mas emocionalmente vazio. A insatisfação foi crescendo bem devagar, quase sem eu perceber, até virar uma vontade real e concreta de mudar tudo de novo.",
    problemEn:
      "After the rush to fix media and infrastructure, I truly believed the portfolio was done: live, working, no visible bugs, doing everything a portfolio is supposed to do. I went a good while without touching a line of code, thinking that phase was closed. But little by little, that silence started to bother me more than I expected: every time I revisited the site, even just in passing, I noticed one more thing that felt dated, generic, or simply didn't feel like \"me\", as if the site was technically correct but emotionally empty. The dissatisfaction grew very slowly, almost without me noticing, until it became a real, concrete urge to change everything again.",
    inflectionPt:
      "Não teve um estalo único, um bug que quebrou algo ou um evento específico que me fez voltar de uma vez. Foi mais uma inquietação acumulada, semana após semana, um incômodo baixo e constante que eu ia empurrando pra depois, até que em algum momento a balança virou: ficou mais fácil abrir o editor de novo e mexer no que estava me incomodando do que continuar ignorando e carregando aquela sensação de projeto inacabado.",
    inflectionEn:
      "There wasn't a single spark, a bug that broke something, or one specific event that brought me back all at once. It was more of a restlessness that built up, week after week, a low, constant discomfort I kept pushing off, until at some point the scale tipped: it became easier to open the editor again and fix what was bothering me than to keep ignoring it and carrying that feeling of an unfinished project.",
    solutionPt:
      "A retomada veio em agosto, e não foi um retorno morno de quem só queria fechar umas pontas soltas: foi, de longe, o mês mais intenso de todo o projeto, com mais mudanças em quatro semanas do que nos sete meses anteriores somados. Foi como se toda aquela insatisfação que vinha se acumulando silenciosamente durante o hiato tivesse virado combustível de uma vez só, e eu tivesse decidido não deixar mais nada \"quase certo\": ou resolvia de verdade, ou não fazia.",
    solutionEn:
      "Work resumed in August, and it wasn't a lukewarm comeback from someone just wanting to tie up a few loose ends: it was, by far, the most intense month of the entire project, with more changes in four weeks than in the previous seven months combined. It felt like all that dissatisfaction that had been quietly piling up during the gap turned into fuel all at once, and I decided nothing would stay \"almost right\" anymore: either I fixed it for real, or I didn't touch it.",
  },
  {
    slug: "a-ideia",
    kind: "milestone",
    dateLabelPt: "Ago 2026",
    dateLabelEn: "Aug 2026",
    titlePt: "A Ideia",
    titleEn: "The Idea",
    impactPt: "Voltando do hiato, olhei pro site e pensei: isso ainda não parece meu. E se desse pra perguntar alguma coisa sobre mim e uma IA respondesse na hora?",
    impactEn: "Coming back from the gap, I looked at the site and thought: this still doesn't feel like me. What if someone could ask a question about me and an AI answered right away?",
    tags: ["Product Thinking", "IA", "Identidade Visual"],
    narrationPt:
      "Voltando depois desse tempo parado, olhei pro site e pensei: isso ainda não parece com quem eu sou. E se alguém pudesse me perguntar alguma coisa e recebesse uma resposta na hora, como se estivesse conversando comigo mesmo? Juntei então duas ideias na minha cabeça: tive a ideia de deixar o design mais vivo e mais a minha cara, e criar um assistente inteligente que soubesse falar sobre mim, minha trajetória e meus projetos. Decidi tocar as duas coisas ao mesmo tempo, e essa decisão abriu a fase mais intensa de todo o projeto.",
    narrationEn:
      "Coming back after that quiet stretch, I looked at the site and thought: this still doesn't feel like me. What if someone could ask me a question and get an answer right away, like they were talking to me? So I combined two ideas in my head: I had the idea of making the design more alive and more like me, and building a smart assistant that could talk about me, my journey and my projects. I decided to work on both at once, and that decision kicked off the most intense phase of the whole project.",
    problemPt:
      "O portfólio funcionava, mas continuava com a cara de qualquer outro portfólio: preto e azul, sem nada que dissesse quem eu sou de verdade. E quem visitava só podia ler o que eu escrevi, sem nenhuma forma de perguntar algo além do que já estava na tela.",
    problemEn:
      "The portfolio worked, but it still looked like any other portfolio: black and blue, nothing that really said who I am. And whoever visited could only read what I had written, with no way to ask anything beyond what was already on the screen.",
    inflectionPt:
      "Foi então que juntei duas ideias que vinham rondando minha cabeça separadas. Uma era mudar a cara do site pra algo que realmente parecesse meu. A outra era criar uma inteligência artificial capaz de responder perguntas sobre mim, minha trajetória e meus projetos, como se fosse uma versão virtual minha conversando com quem visitasse o site.",
    inflectionEn:
      "That's when I connected two ideas that had been circling separately in my head. One was changing the site's look into something that actually felt like me. The other was building an artificial intelligence able to answer questions about me, my background and my projects, like a virtual version of myself talking to whoever visited the site.",
    solutionPt:
      "Decidi tocar as duas coisas juntas. Nas semanas seguintes entrei de cabeça em SEO avançado, domínio próprio e, principalmente, no motor de busca semântica que viraria a base do assistente virtual. Foi essa decisão que abriu a fase mais intensa do projeto inteiro.",
    solutionEn:
      "I decided to work on both at the same time. In the weeks that followed I dove into advanced SEO, my own domain and, most importantly, the semantic search engine that would become the foundation of the virtual assistant. That decision opened the most intense phase of the entire project.",
  },
  {
    slug: "era-ia-avatar",
    kind: "milestone",
    dateLabelPt: "Ago 2026",
    dateLabelEn: "Aug 2026",
    titlePt: "A Era da IA e o Pivô do Avatar",
    titleEn: "The AI Era and the Avatar Pivot",
    impactPt: "Testei o 3D, mas além de pesado, era complexo demais pra um portfólio pessoal. O 2D inspirado no Xbox 360 acabou ficando mais simples, mais leve e, pra minha surpresa, até mais bonito.",
    impactEn: "I tried 3D, but besides being heavy, it was too complex for a personal portfolio. The 2D look inspired by Xbox 360 ended up simpler, lighter, and, to my surprise, even prettier.",
    tags: ["RAG", "pgvector", "Gemini", "Three.js", "SEO", "i18n"],
    narrationPt:
      "O assistente que eu tinha criado funcionava bem, mas parecia genérico, como o chat de suporte de qualquer empresa. E o site continuava sem uma cara própria. Resolvi dar um rosto a esse assistente. Testei um jeito bem elaborado e realista de fazer isso, mas achei pesado e complicado demais pra o que eu precisava. No mesmo dia, tentei outro caminho, ainda mais trabalhoso, e também não ficou bom. Foi então que percebi que a resposta certa era bem mais simples. Criei um desenho bem mais leve pro assistente, inspirado em jogos antigos, e, pra minha surpresa, ficou muito mais bonito e com muito mais personalidade do que as tentativas complicadas. No dia seguinte, aproveitei o embalo e troquei as cores frias do site por tons quentes, e finalmente o portfólio ganhou uma identidade visual própria.",
    narrationEn:
      "The assistant I had built worked fine, but it felt generic, like the support chat of any company. And the site still didn't have a look of its own. I decided to give that assistant a face. I tried a very elaborate, realistic way of doing that, but it felt too heavy and complex for what I actually needed. That same day, I tried another path, even more work, and it didn't turn out well either. That's when I realized the right answer was much simpler. I made a much lighter drawing for the assistant, inspired by old video games, and, to my surprise, it turned out way prettier and full of much more personality than the complicated attempts. The next day, riding that momentum, I swapped the site's cold colors for warm ones, and the portfolio finally got a look of its own.",
    problemPt:
      "Voltei ao projeto com domínio próprio e SEO avançado no ar, dois passos que já ajudavam a deixar claro que aquilo era meu e não um template qualquer. Mas tinha um problema que me incomodava mais do que qualquer bug técnico: o assistente virtual que eu tinha acabado de criar funcionava, respondia bem, tecnicamente estava correto, mas era genérico. Podia ser o chat de suporte de qualquer empresa, sem nenhuma personalidade, flat e indiferente. E a cara do site, ainda em preto e azul sem graça, o visual \"seguro\" que qualquer template usaria, também não parecia ter identidade nenhuma.",
    problemEn:
      "I came back to the project with my own domain and advanced SEO live, two steps that already helped make it clear this was mine and not just another template. But there was a problem bothering me more than any technical bug: the virtual assistant I had just built worked, answered well, was technically correct, but was generic. It could've been the support chat of any company, no personality at all, flat and indifferent. And the site's look, still in a plain, \"safe\" black and blue that any template would use, didn't feel like it had any identity either.",
    inflectionPt:
      "Tentei resolver isso dando um rosto ao assistente. Ficou claro que o problema não era só ele, era a identidade visual como um todo, mas comecei pelo avatar. Primeiro, um avatar 3D em VRM, com blendshapes para expressões faciais. Funcionava tecnicamente, o modelo carregava e animava, mas o esforço para deixá-lo bom, ajustar cada expressão, cada movimento pra não parecer estranho, era desproporcional ao resultado que eu via na tela. Ainda no mesmo dia, sem desistir, tentei uma segunda saída: um motor 3D construído do zero com Three.js, WebGL e sincronização labial pela análise do áudio. De novo, a complexidade de manter aquele motor vivo, debugar WebGL, ajustar timing de lip-sync, não compensava o que ele entregava visualmente. Duas tentativas 3D, as duas descartadas no mesmo dia, 25 de agosto: um dia inteiro de trabalho que terminou com as duas soluções na lixeira.",
    inflectionEn:
      "I tried solving this by giving the assistant a face. It became clear the problem wasn't just the assistant, it was the visual identity as a whole, but I started with the avatar. First, a 3D VRM avatar with blendshapes for facial expressions. It worked technically, the model loaded and animated, but the effort to make it good, tuning every expression, every movement so it wouldn't look off, was disproportionate to what I saw on screen. That same day, without giving up, I tried a second way out: a 3D engine built from scratch with Three.js, WebGL and audio-driven lip-sync. Again, the complexity of keeping that engine alive, debugging WebGL, tuning lip-sync timing, wasn't worth what it delivered visually. Two 3D attempts, both discarded on the same day, August 25th: a full day of work that ended with both solutions in the trash.",
    solutionPt:
      "A saída mais simples acabou sendo a certa: um personagem 2D inspirado nos avatares do Xbox 360, muito mais fácil de manter, sem motor 3D, sem WebGL, sem sincronização labial complexa, e, para minha surpresa, com bem mais personalidade do que qualquer uma das tentativas 3D que eu tinha acabado de descartar. No dia seguinte, aproveitando o embalo da decisão, troquei toda a paleta preto e azul, genérica e sem graça, por tons quentes, âmbar com um toque de violeta, a identidade visual que faltava desde o início do projeto, e que só ficou óbvia depois que o avatar finalmente tinha uma cara.",
    solutionEn:
      "The simplest way out turned out to be the right one: a 2D character inspired by Xbox 360 avatars, much easier to maintain, no 3D engine, no WebGL, no complex lip-sync, and, to my surprise, with a lot more personality than any of the 3D attempts I had just discarded. The next day, riding that decision's momentum, I swapped the entire generic, dull black-and-blue palette for warm tones, amber with a touch of violet, the visual identity that had been missing since the project started, and that only became obvious once the avatar finally had a face.",
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
    impactPt: "A conversa com o avatar ainda tinha arestas cruas, e Formação Acadêmica e Cursos viviam misturados numa lista só, difícil de escanear rápido. Faltava só arrumar essas duas pontas soltas pra fechar o projeto.",
    impactEn: "The conversation with the avatar still had rough edges, and Academic Background and Courses lived mixed into a single list, hard to scan quickly. Only these two loose ends were left to close out the project.",
    tags: ["UI polish", "Cursos", "Certificações"],
    narrationPt:
      "Com o visual e o assistente resolvidos, sobraram só alguns detalhes menores. A conversa com o assistente ainda tinha algumas partes meio cruas, e o portfólio ainda não tinha nenhum espaço pra mostrar cursos e formação, então tive a ideia de criar essa parte do zero. Separei formação acadêmica de cursos livres em duas listas próprias e deixei a conversa com o assistente com a mesma qualidade visual do resto do site. Foi o último polimento antes de fechar essa fase do projeto.",
    narrationEn:
      "With the look and the assistant settled, only a few smaller details were left. The conversation with the assistant still had some rough parts, and the portfolio still didn't have any space to show courses and education, so I had the idea to create that section from scratch. I split formal education from self-driven courses into their own two lists and brought the assistant's conversation up to the same visual quality as the rest of the site. It was the last bit of polish before closing that phase of the project.",
    problemPt:
      "Com a identidade visual e o avatar resolvidos, sobraram os detalhes menores, mas ainda incômodos: a conversa com o avatar tinha umas arestas visuais meio cruas, funcional mas sem o polimento que o resto do site já tinha. E, numa parte totalmente diferente do site, Formação Acadêmica e Cursos apareciam misturados numa lista só, o que dificultava bater o olho e entender rápido o que era formação formal (faculdade, técnico) e o que era aprendizado por conta própria (cursos livres, certificações).",
    problemEn:
      "With the visual identity and the avatar settled, what was left were smaller but still nagging details: the conversation with the avatar had some rough visual edges, functional but without the polish the rest of the site already had. And, in a completely different part of the site, Academic Background and Courses appeared mixed into a single list, making it hard to scan quickly and tell what was formal education (college, technical school) apart from self-driven learning (free courses, certifications).",
    inflectionPt:
      "Separar essas duas categorias deixaria muito mais claro, num relance, o que é formação formal e o que é aprendizado contínuo por conta própria, além de abrir espaço pra mostrar os certificados de cada curso sem poluir a lista principal com informação demais de uma vez. Ao mesmo tempo, dava pra aproveitar e fechar o polimento visual que ainda faltava na interface de diálogo com o avatar.",
    inflectionEn:
      "Separating these two categories would make it much clearer, at a glance, what's formal education and what's continuous self-driven learning, and make room to show each course's certificate without cluttering the main list with too much information at once. At the same time, it was a good moment to also close out the visual polish still missing from the avatar dialogue interface.",
    solutionPt:
      "Em 01/09, refatorei a interface imersiva do diálogo pro formato visual novel completo, com arte de sprite gerada via IA e transições mais cuidadas, deixando a conversa com o avatar com a mesma qualidade visual do resto do site. Em 02/09, separei os módulos de Cursos e Formação em duas listas independentes, cada uma com sua própria identidade visual e preview de certificados direto no card, sem precisar abrir um link externo pra conferir.",
    solutionEn:
      "On 09/01, I refactored the immersive dialogue interface into the full visual novel format, with AI-generated sprite art and more careful transitions, bringing the avatar conversation up to the same visual quality as the rest of the site. On 09/02, I split the Courses and Education modules into two independent lists, each with its own visual identity and certificate previews right on the card, no need to open an external link to check them.",
  },
  {
    slug: "ideia-da-jornada",
    kind: "milestone",
    dateLabelPt: "Set 2026",
    dateLabelEn: "Sep 2026",
    titlePt: "A Ideia da Jornada",
    titleEn: "The Journey Idea",
    impactPt: "A professora chegou do meu lado numa aula de Arquitetura de Software e perguntou o que eu estava fazendo. No meio da conversa sobre o meu assistente virtual, descobri que ela trabalha com UX, e o que ela me disse mudou o rumo do projeto inteiro.",
    impactEn: "The professor walked up next to me during an Architecture of Software class and asked what I was working on. Midway through telling her about my virtual assistant, I found out she works in UX, and what she told me changed the whole direction of the project.",
    tags: ["UX Writing", "Storytelling", "shadcn/ui Sheet"],
    narrationPt:
      "Com tudo isso pronto, achei que o portfólio estava, enfim, completo. Só que, numa aula qualquer, uma professora chegou do meu lado e perguntou o que eu estava fazendo. Comecei a contar sobre o assistente e o resto do projeto, e no meio da conversa descobri que ela trabalha com design de experiência do usuário. Ela então me deu um conselho simples, mas que mudou tudo: em vez de só mostrar o resultado final, eu deveria contar a história de como cheguei até ali, com os problemas, as mudanças de rumo e as ideias que não deram certo pelo caminho. Foi esse conselho que virou exatamente esta seção que você está vendo agora.",
    narrationEn:
      "With all of that done, I thought the portfolio was finally complete. But then, during an ordinary class, a professor came over and asked what I was working on. I started telling her about the assistant and the rest of the project, and somewhere in that conversation I found out she works in user experience design. She then gave me a simple piece of advice that changed everything: instead of just showing the final result, I should tell the story of how I got there, the problems, the changes in direction, and the ideas that didn't work out along the way. That advice is exactly what turned into this very section you're looking at right now.",
    problemPt:
      "Com o Refinamento fechado, o portfólio estava tecnicamente completo: projetos, experiências, cursos, um assistente com identidade própria. Mas continuava sendo, no fundo, uma vitrine estática: mostrava o resultado final de cada seção, sem contar nada sobre o caminho pra chegar lá. Quase 300 commits de história, decisões, erros e recomeços ficavam invisíveis pra quem só via o produto pronto.",
    problemEn:
      "With Refinement closed, the portfolio was technically complete: projects, experience, courses, an assistant with its own identity. But underneath it was still, at its core, a static showcase: it displayed the final result of each section without telling anything about the path to get there. Almost 300 commits of history, decisions, mistakes and restarts stayed invisible to anyone who only saw the finished product.",
    inflectionPt:
      "Veio de um lugar totalmente despretensioso: numa aula de Arquitetura de Software, a professora chegou do meu lado e perguntou o que eu estava fazendo no notebook. Falei que estava refinando meu portfólio, e acabei contando sobre a ideia do assistente virtual e outras coisas do projeto. No meio da conversa descobri que ela, além de dar aula, trabalha com UX. Foi quando ela abriu o notebook dela pra me mostrar uns exemplos e me deu o conselho que mudou o rumo do projeto: contar a história do portfólio de forma criativa, ir além da vitrine e mostrar os problemas enfrentados, os pivôs de rota e como as ideias surgiram e foram resolvidas. Decidi então minerar o próprio histórico de commits pra reconstruir essa narrativa de verdade, em vez de escrever algo genérico. Cada fase que você vê nesta timeline veio de commits reais, com data e tudo.",
    inflectionEn:
      "It came from a completely unpretentious moment: in an Architecture of Software class, the teacher came over and asked what I was doing on my laptop. I said I was refining my portfolio, and ended up telling her about the virtual assistant idea and other parts of the project. Midway through the conversation I found out that, besides teaching, she actually works in UX. That's when she opened her own laptop to show me some examples and gave me the advice that changed the project's direction: tell the portfolio's story in a creative way, go beyond the showcase and show the problems faced, the route pivots, and how ideas came up and got resolved. I then decided to mine the actual commit history to reconstruct that narrative for real, instead of writing something generic. Every phase you see in this timeline came from real commits, dates included.",
    solutionPt:
      "Nasceu essa seção de Jornada do Projeto: uma linha do tempo com divulgação progressiva, um resumo curto na tela principal e, ao clicar, um painel lateral com o problema, o ponto de inflexão e a solução de cada fase, incluindo um \"Cemitério de Ideias\" pro que foi tentado e descartado. E, pra fechar o ciclo, o próprio assistente de IA pode narrar cada fase em voz alta, a mesma ideia da professora, contada agora pelo personagem que nasceu no meio dessa história.",
    solutionEn:
      "This Project Journey section was born: a timeline with progressive disclosure, a short summary on the main screen and, on click, a side panel with the problem, the inflection point and the solution for each phase, including a \"Graveyard of Ideas\" for what was tried and discarded. And, to close the loop, the AI assistant itself can narrate each phase out loud, the same idea from the professor, now told by the character that was born in the middle of this very story.",
  },
]
