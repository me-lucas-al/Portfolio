# Documentos — política de curadoria (leia antes de colocar qualquer arquivo aqui)

## Regra de ouro: fatos estruturados vivem no Postgres, não em documento nenhum

Cargo, empresa, período, tecnologias de cada experiência; curso, instituição e período de cada
formação; título, descrição e stack de cada projeto — tudo isso já é editado pelo painel admin
(`/control-painel`) e lido pela fonte `db:`. Um PDF ou DOCX que repete esses fatos (currículo,
export do LinkedIn) **não deve ser indexado**: no dia em que um fato mudar no painel, o documento
continua com a versão antiga, e o modelo recebe dois chunks contraditórios.

Documentos aqui servem para o que `db:` **não modela**: emissor de um certificado, data de
certificação, ID de credencial, carga horária, ementa de uma disciplina, conteúdo de uma
planilha. Se o conteúdo é 100% redundante com o painel admin ou com os `.md` de
`dados-pessoais/`, ele pertence a `_nao-indexar/`, não a uma subpasta indexada.

Currículo em PDF e export do LinkedIn são o exemplo canônico de "não indexar": são os piores
extratos possíveis (duas colunas, ordem de leitura embaralhada), envelhecem sem aviso e
carregam PII pessoal. Coloque-os em `_nao-indexar/`. Se quiser esse conteúdo pesquisável, escreva
um `.md` curado em `dados-pessoais/` com o que o banco não cobre — não indexe o PDF bruto.

## Layout de pastas

```
dados-pessoais/documentos/
  README.md          (este arquivo — o único item commitado)
  certificados/       certificados de curso, ementas, cargas horárias
  formacoes/          históricos escolares, diplomas
  planilhas/           CSVs com dados tabulares que o schema não modela
  _nao-indexar/        qualquer coisa que NÃO deve virar chunk (currículo, LinkedIn, rascunhos)
```

Qualquer subpasta (existente ou nova) cujo nome comece com `_` é ignorada pelo indexador —
mover um arquivo para dentro de `_nao-indexar/` é o único passo necessário para removê-lo do
índice. Não é preciso editar código.

## Allowlist de formato

Apenas `.pdf`, `.docx` e `.csv` são lidos. `.doc` (formato legado) é rejeitado com uma mensagem
dedicada pedindo para salvar como `.docx` — nunca falha em silêncio. Qualquer outra extensão é
ignorada.

## Nomes de arquivo

O identificador de fonte (`doc:...`) é derivado do caminho normalizado e sem acentos/maiúsculas
do arquivo. Evite dois arquivos na mesma pasta cujo nome só difira por acentuação ou caixa (ex.:
`Título.pdf` e `titulo.pdf`) — eles colidiriam no mesmo identificador e um sobrescreveria o outro
silenciosamente no índice.

## Sidecar de anotação manual

Para descrever à mão o que a extração automática não alcança (ex.: um certificado escaneado sem
camada de texto), crie um arquivo `<nome-do-arquivo>.<ext>.md` ao lado do documento — por exemplo,
`aws-cloud-practitioner.pdf.md` ao lado de `aws-cloud-practitioner.pdf`. O sidecar nunca é
indexado como fonte própria (o indexador só coleta `.pdf`/`.docx`/`.csv`); ele é só uma anotação de
apoio para quem estiver calibrando a extração. Mantenha a extensão do sidecar com a MESMA caixa do
arquivo original (`Certificado.PDF` precisa de `Certificado.PDF.md`, não `certificado.pdf.md`) —
a busca funciona por acidente em Windows/macOS (case-insensitive) mas não em Linux.

## Limites

- 5 MB por arquivo.
- 400.000 caracteres extraídos por documento.
- 60 chunks por documento.
- 5.000 linhas por CSV.

Arquivos fora desses limites são reportados e pulados, não truncados em silêncio.

## Semântica de remoção

Apagar ou mover um arquivo para fora das pastas indexadas remove os chunks correspondentes do
índice no próximo `pnpm --filter @portfolio/assistant run ingest -- --source=docs` (via
`deleteStale`). Não é preciso limpar nada manualmente no banco.

## O que pode dar errado na extração (e por quê isso não trava o ingest)

- **PDF escaneado (sem camada de texto):** a extração devolve vazio. O relatório do ingest marca
  "SEM TEXTO" para o arquivo, mas nenhum chunk vazio é gravado e o ingest continua normalmente.
- **PDF de duas colunas** (ex.: export do LinkedIn): o texto pode sair com as colunas intercaladas.
  O relatório sinaliza "possível multi-coluna" para revisão manual.
- **Um arquivo que já estava indexado passa a falhar no parse** (corrompido, protegido por senha):
  os chunks antigos dele são removidos pelo `deleteStale` no próximo run, porque `lastSeenAt` não é
  tocado. Isso aparece em destaque no relatório do ingest — não é um erro silencioso, mas é
  importante saber que a falha de parse tem esse efeito colateral.

Nenhum desses casos marca a run inteira como `hadErrors`: tratar "PDF escaneado" como erro
bloquearia a limpeza do índice (`deleteStale`) e deixaria chunks órfãos para sempre.

## Quando promover os parsers para `dependencies`

`unpdf`, `mammoth` e `papaparse` vivem em `devDependencies` do workspace `assistant` porque só são
usados pelo CLI de ingestão (`tsx`), que nunca entra no bundle serverless do MCP
(`assistant/tsup.config.ts`, entry `src/mcp/search-context/index.ts`). Se algum dia um desses
extractors for importado diretamente por esse entry point, promova a dependência para
`dependencies` **e** adicione o pacote em `external` no `tsup.config.ts` — do contrário o build do
MCP tenta empacotar um parser binário/pesado que não precisa estar ali.

## Comandos de verificação

```bash
pnpm --filter @portfolio/assistant run inspect:docs   # extração a custo zero, sem DB nem embeddings
pnpm --filter @portfolio/assistant run ingest -- --source=docs
pnpm --filter @portfolio/assistant run search "pergunta sobre um certificado"
```
