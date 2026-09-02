import { FunctionDeclaration } from "@google/genai";
import { makeKnowledgeService } from "@portfolio/core/src/factories/_index";
import { isAbortError, isUpstreamOverloaded, isUpstreamQuotaExceeded } from "@portfolio/core/src/providers/gemini-error";

const SEARCH_CONTEXT_DECLARATION: FunctionDeclaration = {
  name: "search_context",
  description:
    "Busca semântica sobre a base de conhecimento indexada (banco de dados, notas pessoais, documentos como certificados/históricos/planilhas e código-fonte dos repositórios). Use para QUALQUER pergunta técnica, de arquitetura, biográfica ou sobre certificações e formação.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Pergunta ou termos de busca em linguagem natural." },
      limit: { type: "integer", description: "Quantidade máxima de resultados (padrão 8, máximo 8)." },
    },
    required: ["query"],
  },
};

const LIST_INDEXED_SOURCES_DECLARATION: FunctionDeclaration = {
  name: "list_indexed_sources",
  description: "Lista as fontes indexadas (arquivos, registros do banco) que casam com um prefixo, por exemplo 'code:portfolio/web/'.",
  parametersJsonSchema: {
    type: "object",
    properties: {
      prefix: { type: "string", description: "Prefixo do identificador de fonte a filtrar." },
    },
  },
};

const GET_SOURCE_DECLARATION: FunctionDeclaration = {
  name: "get_source",
  description: "Retorna o conteúdo completo de uma fonte indexada específica, pelo seu identificador exato (retornado por search_context ou list_indexed_sources).",
  parametersJsonSchema: {
    type: "object",
    properties: {
      source: { type: "string", description: "Identificador exato da fonte, por exemplo 'code:portfolio/database/prisma/schema.prisma'." },
    },
    required: ["source"],
  },
};

export const ASSISTANT_FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  SEARCH_CONTEXT_DECLARATION,
  LIST_INDEXED_SOURCES_DECLARATION,
  GET_SOURCE_DECLARATION,
];

const MAX_SEARCH_LIMIT = 8;

let knowledgeServiceInstance: ReturnType<typeof makeKnowledgeService> | undefined;
function getKnowledgeService() {
  knowledgeServiceInstance ??= makeKnowledgeService();
  return knowledgeServiceInstance;
}

function wrapInContextGuard(content: string): string {
  return `<contexto>\n${content.replaceAll("</contexto>", "")}\n</contexto>`;
}

async function runTool(
  name: string,
  args: Record<string, unknown>,
  locale: "pt" | "en",
  abortSignal?: AbortSignal,
): Promise<Record<string, unknown>> {
  const knowledgeService = getKnowledgeService();

  switch (name) {
    case "search_context": {
      const query = typeof args.query === "string" ? args.query : "";
      const limit = typeof args.limit === "number" ? Math.min(Math.max(1, args.limit), MAX_SEARCH_LIMIT) : MAX_SEARCH_LIMIT;
      if (!query.trim()) return { error: "Missing query" };

      const results = await knowledgeService.search(query, limit, locale, abortSignal);
      return {
        results: results.map((result) => ({
          source: result.source,
          title: result.title,
          content: wrapInContextGuard(result.content),
          similarity: result.similarity,
        })),
      };
    }

    case "list_indexed_sources": {
      const prefix = typeof args.prefix === "string" ? args.prefix : undefined;
      const sources = await knowledgeService.listIndexedSources(prefix);
      return { sources };
    }

    case "get_source": {
      const source = typeof args.source === "string" ? args.source : "";
      if (!source.trim()) return { error: "Missing source" };

      const content = await knowledgeService.getSource(source);
      return { content: wrapInContextGuard(content) };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

export async function dispatchAssistantTool(
  name: string,
  args: Record<string, unknown>,
  locale: "pt" | "en",
  abortSignal?: AbortSignal,
): Promise<Record<string, unknown>> {
  try {
    return await runTool(name, args, locale, abortSignal);
  } catch (error) {

    if (isAbortError(error)) throw error;

    const capacityIssue = isUpstreamOverloaded(error) ? "overloaded" : isUpstreamQuotaExceeded(error) ? "quota_exceeded" : "other";
    console.error(`[assistant] tool "${name}" failed (${capacityIssue}):`, error);
    return { error: `The "${name}" tool is temporarily unavailable. Answer without it if you can, or say you couldn't retrieve that information.` };
  }
}
