import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { makeKnowledgeService } from "@portfolio/core/src/factories/_index";

const SERVER_NAME = "portfolio-search-context";
const SERVER_VERSION = "1.0.0";
const DEFAULT_LIMIT = 8;

function createServer() {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  server.registerTool(
    "search_context",
    {
      description:
        "Semantic search over Lucas Almeida's portfolio knowledge base: database records (experience, education, projects, links), personal notes, and indexed source code from his public repositories.",
      inputSchema: z.object({
        query: z.string().describe("Natural language search query."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(DEFAULT_LIMIT)
          .optional()
          .describe(`Maximum number of results (default ${DEFAULT_LIMIT}).`),
      }),
    },
    async ({ query, limit }) => {
      const results = await makeKnowledgeService().search(query, limit ?? DEFAULT_LIMIT);

      const text =
        results.length === 0
          ? "No results found."
          : results
              .map((result, index) => `${index + 1}. [${result.similarity.toFixed(4)}] ${result.source}\n${result.content}`)
              .join("\n\n---\n\n");

      return { content: [{ type: "text", text }] };
    },
  );

  return server;
}

void serveStdio(createServer);
console.error(`${SERVER_NAME} MCP server running on stdio`);
