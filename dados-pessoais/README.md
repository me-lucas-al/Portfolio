# Dados pessoais — fonte de conhecimento do assistente

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

## Formato esperado pelo indexador

`MarkdownSource` (`assistant/src/sources/markdown-source.ts`) quebra cada
arquivo por headings `#`, `##` e `###`, incluindo o caminho de headings
("breadcrumb") no texto de cada chunk para dar contexto à busca semântica.
Use headings de verdade para dividir assuntos — cada seção vira uma unidade
de busca independente.
