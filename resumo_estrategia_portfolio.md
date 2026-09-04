# Resumo: Estratégia de Storytelling para o Portfólio

Este documento resume a nossa discussão sobre como integrar a história e a evolução do portfólio de forma criativa, unindo dicas de UX ao seu histórico real de desenvolvimento.

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

* **Janeiro e Fevereiro (A Fundação e o CMS):** O portfólio não nasceu como um template simples. Você estruturou uma arquitetura robusta com PostgreSQL, NextAuth, Zod, e transformou o projeto em um monorepo (Turborepo) com um painel de controle próprio (RBAC).
* **Março e Abril (A Batalha das Mídias e Deploy):** Transição de infraestrutura, remoção do Docker em produção para otimizar com Vercel/Server Actions, e a substituição do Firebase pelo Cloudinary após lidar com "imagens fantasmas" no carrossel. Aplicação do princípio SOLID (Inversão de Dependências).
* **Agosto (A Era da IA e o Pivô do Avatar):** O mês mais intenso. Implementação de SEO avançado e internacionalização real (banco bilíngue). Criação do motor de busca semântica (RAG com `pgvector`). O grande destaque de UX: a **decisão corajosa de deletar um motor 3D WebGL pesado** para adotar a leveza, rapidez e carisma dos sprites 2D (Visual Novel).
* **Setembro (Refinamento):** Polimento da interface imersiva do diálogo, testes automatizados (E2E) e organização de módulos (Cursos vs. Formação).

## 4. A Decisão de Interface: Divulgação Progressiva (Sheet / Drawer)
Para atender tanto o recrutador que tem pressa (escaneamento rápido) quanto o Tech Lead que quer profundidade (avaliação técnica), escolhemos o padrão de **Progressive Disclosure** através da **Opção 2**.

### Como será implementado:
1. **Na Home (Visão Rápida):** A linha do tempo será enxuta e elegante. Cada marco terá apenas a Data, o Título, 1 frase de impacto e as tags das tecnologias. O objetivo é não poluir a tela principal ou estragar o *scroll*.
2. **Na Gaveta Lateral / Sheet (Bastidores Técnicos):** Ao clicar em um card da timeline, um painel lateral desliza pela tela (Sheet do `shadcn/ui`). É um espaço focado e imersivo contendo:
   * O relato do problema, o que quebrou e a solução arquitetural.
   * Prints de "antes e depois".
3. **O Toque de Mestre (Integração IA):** Dentro do painel lateral de detalhes, haverá um botão para perguntar diretamente ao Avatar (Lucas Virtual) sobre aquela fase específica, unindo a navegação do portfólio ao seu sistema RAG de forma orgânica.
