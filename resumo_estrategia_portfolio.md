# Resumo: Estratégia de Storytelling para o Portfólio

Este documento resume a nossa discussão sobre como integrar a história e a evolução do portfólio de forma criativa, unindo dicas de UX ao seu histórico real de desenvolvimento.

## 0. Por Que Esse Portfólio Existe
A ideia inicial era simples: ter um portfólio pessoal. Mas desde o início ficou claro que ele precisava ser fácil de atualizar sempre que uma nova conquista, projeto ou certificação surgisse — foi essa necessidade, e não modismo técnico, que motivou construir um **painel de controle próprio** em vez de um site estático de portfólio comum.

A escolha de stack (Next.js, PostgreSQL, Prisma, e o restante) também não foi por hype: foram as tecnologias com que já se tinha mais domínio e prática, priorizando velocidade de execução e confiança no que já se conhecia bem sobre experimentar algo novo sem necessidade.

## 1. A Ideia Original
Tudo começou com um conselho valioso de uma professora de UX: **contar a história do portfólio de forma criativa**. A proposta é ir além de uma vitrine estática e mostrar os problemas enfrentados, as mudanças de rota (pivôs), como as ideias surgiram e resolvê-los por meio de uma linha do tempo. Isso humaniza o projeto e demonstra grande maturidade técnica e de produto.

## 2. Abordagens Criativas Discutidas
Para fugir do padrão, levantamos cinco estratégias de design e interatividade:
* **"Comentários do Diretor" com Avatar:** O seu assistente em estilo Visual Novel contando curiosidades e perrengues de desenvolvimento.
* **Timeline de "Pivôs e Decisões":** Foco em Desafios, Hipóteses, Ponto de Inflexão (o que deu errado) e Solução.
* **Componente "Antes vs. Depois":** Slider interativo para mostrar visualmente a evolução das interfaces.
* **O "Cemitério de Ideias" (Post-Mortem):** Uma seção valorizada por seniores, mostrando o que foi descartado e o porquê.
* **"Modo Raio-X de UX":** Um toggle que liga anotações e bastidores diretamente sobre a interface do site.

## 3. A História Extraída dos Commits (Jan - Set 2026)
A análise de quase 300 commits revelou 4 grandes momentos que formam a espinha dorsal da sua narrativa:

* **Janeiro e Fevereiro (A Fundação e o CMS):** O portfólio não nasceu como um template simples. Você estruturou uma arquitetura robusta com PostgreSQL, NextAuth, Zod, e transformou o projeto em um monorepo (Turborepo) com um painel de controle próprio e sistema de papéis (RBAC simplificado).
* **Março e Abril (A Batalha das Mídias e Deploy):** Transição de infraestrutura, remoção do Docker em produção para otimizar com Vercel/Server Actions, e a substituição do Firebase pelo Cloudinary após lidar com "imagens fantasmas" no carrossel. Aplicação do princípio SOLID (Inversão de Dependências).
* **Maio a Julho (O Hiato):** Um período de quase 10 semanas sem commits (última atividade em 15/05, retomada só em agosto). Vale nomear esse intervalo explicitamente na timeline — com um marco curto explicando o motivo real da pausa — em vez de deixar um buraco silencioso que pode passar a impressão de projeto abandonado para quem for direto ao histórico do GitHub.
* **Agosto (A Era da IA e o Pivô do Avatar):** O mês mais intenso. Implementação de SEO avançado e internacionalização real (banco bilíngue). Criação do motor de busca semântica (RAG com `pgvector`). O grande destaque de UX: no dia 25/08, **duas implementações 3D foram descartadas no mesmo dia** — primeiro o avatar antigo baseado em VRM, depois um motor three.js recém-criado como substituto — antes de pousar na solução final com sprites 2D (Visual Novel). Esse duplo descarte no mesmo dia é um exemplo ainda mais forte para a seção "Cemitério de Ideias" do que uma única decisão de deletar um motor 3D. Também é nesse mês (24/08) que entram os primeiros testes automatizados (unitários e E2E) do assistente/TTS.
* **Setembro (Refinamento):** Polimento da interface imersiva do diálogo e organização de módulos (Cursos vs. Formação).

## 3.1 A Evolução Contada em Primeira Pessoa (o porquê por trás do changelog)
A reconstrução por commits (seção 3) mostra o *o quê* e o *quando*. Falta o *porquê* — a sequência de sensações e decisões de produto que motivou cada pivô:

1. **"Está pronto, mas está muito padrão."** Com o portfólio funcional, veio a sensação de que o design ainda era genérico demais, sem identidade. Essa insatisfação motivou tirar o domínio gratuito da Vercel, comprar um domínio próprio e adicionar SEO à página — o primeiro passo de "isso é meu, não um template".
2. **O assistente nasce, mas parece um SAC.** A ideia de criar uma assistente virtual surgiu depois — e funcionou tecnicamente, mas a primeira versão era, na prática, um chat de suporte comum: funcional, porém "flat" e indiferente, sem personalidade.
3. **A guinada de cor e o pivô do avatar, quase ao mesmo tempo.** Ficou claro que o problema não era só a assistente — era a identidade visual como um todo. Duas decisões nasceram juntas nessa virada de agosto: abandonar o preto e azul (visual seguro, mas genérico) por âmbar e roxo, e dar um rosto à assistente, um boneco próprio. A primeira tentativa do boneco foi 3D, mas o resultado não tinha a qualidade desejada — a solução foi migrar para um personagem 2D inspirado nos avatares do Xbox 360, mais viável e, ainda assim, com personalidade própria. Os commits mostram o pivô do avatar (3D descartado, 2D adotado) fechado em 25/08 e a troca de paleta entrando no dia seguinte, 26/08 — ou seja, não foi "cor primeiro, depois boneco" de forma estritamente sequencial, e sim duas resoluções da mesma insatisfação, tomadas em sequência quase imediata (esse é o mesmo pivô já registrado tecnicamente em "Agosto" na seção 3, mas aqui com o raciocínio de produto por trás da decisão).
5. **Cursos e certificações.** Só depois de a identidade visual e a assistente estarem resolvidas é que entrou a seção de cursos e certificações — consolidando o portfólio como vitrine completa.

Essa camada de "porquê" é o material bruto ideal para os cards da timeline (seção 4): cada marco técnico já mapeado pelos commits ganha aqui a motivação emocional/de produto que o Tech Lead avaliando maturidade quer ver, e que o "Modo Raio-X" ou o painel lateral podem expor.

## 4. A Decisão de Interface: Divulgação Progressiva (Sheet / Drawer)
Para atender tanto o recrutador que tem pressa (escaneamento rápido) quanto o Tech Lead que quer profundidade (avaliação técnica), escolhemos o padrão de **Progressive Disclosure** através da **Opção 2**.

### Como será implementado:
1. **Na Home (Visão Rápida):** A linha do tempo será enxuta e elegante. Cada marco terá apenas a Data, o Título, 1 frase de impacto e as tags das tecnologias. O objetivo é não poluir a tela principal ou estragar o *scroll*.
2. **Na Gaveta Lateral / Sheet (Bastidores Técnicos):** Ao clicar em um card da timeline, um painel lateral desliza pela tela (Sheet do `shadcn/ui`). É um espaço focado e imersivo contendo:
   * O relato do problema, o que quebrou e a solução arquitetural.
   * Prints de "antes e depois".
3. **O Toque de Mestre (Integração IA):** Dentro do painel lateral de detalhes, haverá um botão para perguntar diretamente ao Avatar (Lucas Virtual) sobre aquela fase específica, unindo a navegação do portfólio ao seu sistema RAG de forma orgânica.

### Sugestões de refinamento
* **Sheet linkável:** abrir o painel via query param (ex.: `?timeline=agosto-avatar`) para que cada marco tenha uma URL própria e compartilhável — sem isso, um recrutador não consegue mandar o link direto de um card específico para o Tech Lead.
* **Preview no card da home:** além da 1 frase de impacto, um thumbnail pequeno do "antes/depois" no próprio card aumenta a taxa de clique de quem só está escaneando.
* **Contexto do RAG por fase:** garantir que a base indexada (`chunk` + pgvector) tenha conteúdo segmentado por marco/fase, não só texto solto — senão o botão "pergunte ao Avatar sobre essa fase" tende a responder de forma genérica e quebra a promessa de contexto específico.
