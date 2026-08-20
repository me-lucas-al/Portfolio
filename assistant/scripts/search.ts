import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Loaded via dynamic import below so this runs before @portfolio/database
// (imported transitively) reads process.env.DATABASE_URL at module load time.
config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const { makeKnowledgeService } = await import("@portfolio/core/src/factories/_index");

const query = process.argv.slice(2).join(" ").trim();
if (!query) {
  console.error('Usage: tsx scripts/search.ts "<query>"');
  process.exit(1);
}

const results = await makeKnowledgeService().search(query, 8);

if (results.length === 0) {
  console.log("No results.");
} else {
  console.log(`Top ${results.length} results for: "${query}"\n`);
  results.forEach((result, index) => {
    console.log(
      `${index + 1}. [${result.similarity.toFixed(4)}] ${result.source} (locale=${result.locale ?? "any"})`,
    );
  });
}
