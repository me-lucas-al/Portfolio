# @portfolio/assistant

Workspace de conhecimento e IA do portfólio: pipeline de ingestão RAG (banco de
dados, notas em `/ai-knowledge-base` e código-fonte indexado via pgvector) e uma
fachada MCP local sobre a mesma base, para uso em Claude Desktop / Cursor.

## Ingestão

```bash
pnpm --filter @portfolio/assistant run ingest --source=db|md|code|all
```

Idempotente: uma segunda execução sem mudanças reporta ~100% de `skipped` e
zero chamadas à API de embeddings. Ver `scripts/ingest.ts`.

## Inspeção de retrieval

```bash
pnpm --filter @portfolio/assistant run search "sua pergunta aqui"
```

## Servidor MCP `search-context` (uso local)

Expõe a mesma busca semântica usada pelo `/api/chat` como um tool MCP
`search_context(query, limit?)`, para uso no Claude Desktop, Cursor ou
qualquer cliente MCP local. É só uma segunda fachada sobre o
`KnowledgeService` — não roda em produção, não é exposta na web.

### Build

```bash
pnpm --filter @portfolio/assistant run mcp:build
```

Gera `assistant/dist/mcp/search-context/index.js`, um bundle ESM único
(via `tsup`) que inlina o `@portfolio/core`, o `@portfolio/database` e o
Prisma Client gerado — necessário porque o `main` de `@portfolio/database`
é TypeScript cru, que um `node` puro (fora do Next/tsx) não resolve.
`pg`, `@prisma/client`, `@prisma/adapter-pg`, `dotenv` e `@google/genai`
ficam como dependências externas (não são bundladas): todos têm bindings
nativos, `require()` de módulos internos do Node, ou já são resolvíveis
localmente — bundlá-los quebra sob ESM puro.

Para iterar sem rebuildar a cada mudança:

```bash
pnpm --filter @portfolio/assistant run mcp:dev
```

### Configuração no Claude Desktop / Cursor

O `main` de `@portfolio/database` (`prisma.ts`) faz `import 'dotenv/config'`,
que resolve o `.env` **relativo ao `cwd` do processo** — por isso a
configuração do cliente MCP deve informar `cwd` e as env vars explicitamente,
em vez de depender de um `.env` sendo encontrado sozinho:

```json
{
  "mcpServers": {
    "portfolio-search-context": {
      "command": "node",
      "args": ["dist/mcp/search-context/index.js"],
      "cwd": "/caminho/absoluto/para/portfolio/assistant",
      "env": {
        "DATABASE_URL": "postgresql://...",
        "GEMINI_API_KEY": "..."
      }
    }
  }
}
```

Rode `pnpm --filter @portfolio/assistant run mcp:build` antes de configurar o
cliente (o arquivo referenciado em `args` precisa existir).

### Verificação manual (MCP Inspector)

```bash
npx @modelcontextprotocol/inspector node assistant/dist/mcp/search-context/index.js
```

O Inspector deve listar o tool `search_context` e uma chamada de teste deve
retornar os chunks mais similares com `source` e `similarity`.
