# AI knowledge base — fonte de conhecimento do assistente

Esta pasta é indexada pelo assistente de IA do portfólio (`@portfolio/assistant`,
fonte `md:`) junto com o banco de dados e o código-fonte dos repositórios.

## Divisão de fonte de verdade

**Fatos estruturados vivem no Postgres, não aqui.** Cargo, empresa, período,
tecnologias de cada experiência; curso, instituição e período de cada formação;
título, descrição e stack de cada projeto — tudo isso é editado pelo painel
admin (`/control-painel`) e lido pelo assistente diretamente da tabela
`Experience`, `Education`, `Project`, `SystemSetting` e `Link` via
`db-source.ts`. Não duplique esses dados aqui: se um dado está no painel
admin, ele NÃO deve ser repetido em Markdown, ou o assistente vai responder
uma versão desatualizada quando o Lucas editar só um dos dois lugares.

Os arquivos `.md` desta pasta existem para o que o banco não modela:
narrativa de carreira, preferências de arquitetura, forma de trabalhar e
respostas prontas para perguntas comuns de recrutador. Ou seja: opinião,
contexto e estilo — não fatos tabulares.

## Arquivos

- `01-narrativa-carreira.md` — a história em prosa, não a lista de cargos.
- `02-preferencias-arquitetura.md` — como o Lucas gosta de estruturar projetos.
- `03-como-trabalho.md` — processo, ritmo, forma de colaborar.
- `04-faq-recrutadores.md` — respostas diretas para perguntas frequentes.
- `05-biografia.md` — dados pessoais, trajetória acadêmica e profissional.
- `06-cursos.md` — cursos concluídos e o que foi aprendido em cada um.

## Formato esperado pelo indexador

`MarkdownSource` (`assistant/src/sources/markdown-source.ts`) quebra cada
arquivo por headings `#`, `##` e `###`, incluindo o caminho de headings
("breadcrumb") no texto de cada chunk para dar contexto à busca semântica.
Use headings de verdade para dividir assuntos — cada seção vira uma unidade
de busca independente.

## Reindexação automática

Um hook `post-commit` (`.githooks/post-commit`, ativado via `core.hooksPath`
no `postinstall` do `package.json`) detecta commits que alteram algum `.md`
direto nesta pasta e roda `pnpm --filter @portfolio/assistant run ingest
--source=md` em background, sem travar o `git commit`. Saída em
`.git/ingest-md.log`. Só dispara com o padrão exato lido por
`MarkdownSource` (arquivos direto em `ai-knowledge-base/`, não recursivo), então
mudanças em `documentos/` não acionam esse hook.

## A subpasta `documentos/` se comporta diferente

`documentos/` guarda PDF, DOCX e CSV indexados pela fonte `doc:` — ver a política completa em
`ai-knowledge-base/documentos/README.md`. Duas coisas deliberadas que vale saber de antemão:

- `.md` dentro de `documentos/` **não** é indexado como `md:`, porque `MarkdownSource` faz
  `readdir` não recursivo apenas nesta pasta (`ai-knowledge-base/`). Isso é intencional: o único uso de
  `.md` dentro de `documentos/` é o sidecar de anotação manual, que não deve virar chunk.
- `documentos/**` está no `.gitignore` (menos o `README.md`): os binários originais (currículo,
  certificados, planilhas) nunca são commitados, porque conteriam PII num repositório público. O
  parse roda localmente, uma vez, no CLI de ingest; só os embeddings resultantes vão para o banco.
