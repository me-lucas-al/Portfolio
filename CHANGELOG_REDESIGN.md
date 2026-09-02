# Changelog: Da versão estática ao portfólio com IA (17/08 – 02/09/2026)

Este documento registra, em detalhes, tudo o que mudou no portfólio entre o
commit [`22a3b3a`](../../commit/22a3b3a) (`refactor: remove lucas almeida dev
from visible page text`, 17/08/2026) e o estado atual da `main`
([`e9b7b34`](../../commit/e9b7b34)). Nesse intervalo — **154 commits** e
**262 arquivos alterados** — o projeto deixou de ser um portfólio estático
em azul/preto, sem internacionalização e sem IA, para se tornar a versão
atual: bilíngue, com um assistente de IA conversacional em formato de
avatar de visual novel, e uma nova identidade visual em tons quentes.

> Como identificar o "antes": rode `git show 22a3b3a:web/src/app/globals.css`
> ou faça checkout do commit `22a3b3a` para ver o estado do projeto antes de
> todas as mudanças descritas abaixo.

---

## 1. Internacionalização (i18n) — PT-BR / EN-US

O portfólio era 100% em português, sem nenhuma estrutura de tradução. Foi
adicionado suporte bilíngue completo:

- Campos de tradução (`titlePt`/`titleEn`, `descriptionPt`/`descriptionEn`,
  etc.) no schema do Prisma para Projetos, Experiências e Formação.
- Schemas Zod atualizados para validar os pares PT/EN em cada entidade.
- Criação de dicionários de tradução, utilitário de locale e persistência
  do idioma escolhido via cookie (sem exigir login).
- Server Actions passaram a aceitar e salvar os campos bilíngues, com
  parsing seguro de datas.
- Todas as seções públicas do portfólio (Sobre, Projetos, Skills, Contato,
  Formação, Experiências) passaram a renderizar o conteúdo no idioma ativo.
- O Painel de Controle ganhou abas PT-BR / EN-US em todos os formulários
  (Projetos, Experiências, Formação), permitindo cadastrar o conteúdo nos
  dois idiomas na mesma tela — é essa aba que aparece nos prints
  `add_new_control_panel.png` e `control-painel.png` deste README.
- Correções de UI decorrentes (quebra de layout no header mobile, textos
  de data compartilhados entre experiência/formação, etc.).

## 2. Assistente de IA (RAG) — do zero ao chat em produção

Antes não existia nenhuma forma de IA no projeto. Foi construído um
assistente conversacional completo, hoje documentado na seção
"🤖 Assistente de IA (RAG)" do README:

- **Infraestrutura vetorial**: modelo `Chunk` no Postgres com embeddings via
  `pgvector` e índice HNSW; abstração de provedor de embeddings no pacote
  `core`.
- **Pipeline de ingestão** (`@portfolio/assistant`): indexa três fontes —
  banco de dados (fatos estruturados), notas Markdown da base de
  conhecimento e código-fonte de repositórios públicos — com denylist de
  segredos e allowlist de extensões. Também ganhou extratores de PDF, DOCX
  e CSV, com diagnóstico de qualidade e sanitização de PII.
- **Endpoint público** `/api/chat`, protegido por rate limit (5 msg/min e
  30 msg/dia por IP, com hash com salt), kill-switch (`ASSISTANT_ENABLED`)
  e teto diário global de mensagens (`ASSISTANT_DAILY_BUDGET`).
- **Confiabilidade do modelo**: retry com backoff nativo do SDK do Gemini,
  classificação de erros, cadeia de fallback de modelo (só escala em erro
  de capacidade), prazo de requisição compartilhado e erros tipados.
- **Cache de respostas**: tabela `assistant_answers` com similaridade por
  embedding para servir respostas repetidas sem chamar o Gemini de novo.
- **CLI de inspeção de retrieval** (`pnpm --filter @portfolio/assistant run
  search`) e uma fachada MCP (`search_context`) para uso local no Claude
  Desktop/Cursor.
- **Automação**: GitHub Action que reindexa a base de conhecimento
  automaticamente a cada commit relevante.
- Base de conhecimento (`ai-knowledge-base/`, antes `dados-pessoais/`)
  passou a incluir narrativa de carreira, desafios técnicos, metodologia de
  testes, preferências de arquitetura, FAQ, cursos concluídos e biografia
  pessoal — usada apenas para contexto de estilo/narrativa, nunca como
  fonte de fatos tabulares (esses vêm do banco).

## 3. Avatar / Assistente em Visual Novel

A UI do assistente passou por três gerações até chegar ao formato atual:

1. **Chat widget bilíngue** simples (painel modal) — primeira versão do
   assistente.
2. **Painel lateral não-modal** com bolha de call-to-action, foco
   gerenciado e conversa persistida em `localStorage` por 24h.
3. **Avatar 3D (three.js/VRM)** com engine WebGL, TTS, lip-sync por
   viseme, análise de amplitude de áudio, camadas de emoção e classificação
   de tom da resposta — implementação experimental que foi **removida** em
   seguida por complexidade.
4. **Avatar 2D com sprites reais**, gerados com Gemini image generation,
   com fala em efeito de máquina de escrever (typewriter) e blips sonoros.
5. **Estágio final**: um "visual novel avatar stage" completo, com barra de
   diálogo, avatar overlay no header, morphing entre estado mini/expandido,
   e a bolha de CTA com destaque visual da marca.

Também nesse eixo:
- Endpoint `/api/tts` dedicado, com rate limit por tipo de uso e tokens de
  fala assinados.
- Cache de áudio sintetizado no Cloudinary, com pré-aquecimento a partir do
  `/api/chat`.
- Diversos ajustes de robustez de renderização (flash de sprite quebrado no
  primeiro paint, travamento da boca ao trocar de aba, tearing visual na
  transição do diálogo, balão de fala com altura limitada por reticências).

## 4. Identidade visual — de azul/preto para tons quentes com destaque âmbar

O tema anterior usava uma paleta escura genérica com tons de azul/`slate`
(visível em `header.tsx`, cards de projeto, formulários do painel, etc.).
Essa paleta foi completamente substituída:

- Nova paleta de neutros quentes com um único acento âmbar, centralizada em
  tokens de tema (renomeados de `accent` para `brand` para não colidir com
  o token `--accent` do shadcn).
- Header/nav redesenhado, abandonando o padrão de marcadores numerados de
  seção.
- Hero com título display-serif, cursor piscante estilo assinatura e nova
  hierarquia de CTAs.
- Remoção dos marcadores numerados e das tag-pills com tom de acento nas
  seções de conteúdo.
- Correções de contraste e vazamentos do tema claro do shadcn no modo
  escuro.
- Painel de Controle inteiro restilizado para a nova paleta: shell,
  layout, abas, formulários de projeto/upload, experiência, formação,
  perfil, configurações do sistema, links e currículo.
- Foto de perfil atualizada com enquadramento circular otimizado.

## 5. Painel de Controle — novas funcionalidades

Além da restilização (seção 4) e das abas PT/EN (seção 1), o painel
ganhou:

- **Reordenação por drag-and-drop** das imagens de um projeto.
- Renomeações internas para clareza de intenção (ex.: handler de input de
  arquivo renomeado para `appendSelectedProjectImages`).

## 6. CI/CD e infraestrutura

- GitHub Action dedicada para reindexar a base de conhecimento em Markdown
  a cada commit, com correções sucessivas (Node 24, `prisma generate`
  antes da ingestão, `packageManager` do `pnpm` lido automaticamente,
  `process.env` no lugar do helper `env()` do Prisma para permitir
  `generate` sem `DATABASE_URL`, verificação de segredos antes da
  ingestão).
- Variáveis de ambiente do assistente/Cloudinary registradas no
  `turbo.json`.
- Testes unitários e E2E adicionados para TTS, UI do assistente e para o
  parser de descrição de experiência.

## 7. Qualidade de código

- Extração de hooks e helpers dedicados (estado do chat do assistente,
  guards HTTP compartilhados, parser de descrição de experiência com
  cobertura de testes).
- Renomeação de funções genéricas para nomes descritivos e reveladores de
  intenção em todo o código.
- Remoção de comentários redundantes e tipagem mais estrita para ícones de
  link.
- Adoção do Radix Dialog para os wrappers de diálogo do assistente/avatar.

---

## Resumo em números

| Métrica | Valor |
|---|---|
| Commits no período | 154 |
| Arquivos alterados | 262 |
| Linhas adicionadas | +12.114 |
| Linhas removidas | -1.325 |
| Período | 17/08/2026 → 02/09/2026 |

## Linha do tempo resumida

- **17–19/08**: i18n completo (PT-BR/EN-US) + primeira versão do
  assistente de IA (RAG) com endpoint de chat, ingestão e cache de
  respostas.
- **20–21/08**: ajustes de precisão do assistente e automação de ingestão
  via GitHub Actions.
- **24–25/08**: TTS, avatar 3D experimental (removido), migração para
  avatar 2D com sprites, sistema de tom/emoção e cache de fala.
- **26/08**: reformulação completa da identidade visual (azul/preto →
  neutros quentes + âmbar) e restilização de todo o Painel de Controle.
- **01/09**: avatar evolui para o "visual novel stage" final, geração de
  sprites com IA, sanitização de PII na ingestão, drag-and-drop de imagens
  no painel.
- **02/09**: refino de nomenclatura, testes e organização da base de
  conhecimento de IA.
