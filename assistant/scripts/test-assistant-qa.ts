import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, "../../.env") });

const { default: prisma } = await import("@portfolio/database");
const agentPath = pathToFileURL(path.resolve(__dirname, "../../web/src/lib/assistant/agent.ts")).href;
const deadlinePath = pathToFileURL(path.resolve(__dirname, "../../web/src/lib/assistant/deadline.ts")).href;

const { runAssistant } = await import(agentPath);
const { createDeadline } = await import(deadlinePath);

async function main() {
  console.log("=== 1. VERIFICANDO CHUNKS NO BANCO NEONDB ===");
  const docChunks = await prisma.chunk.findMany({
    where: { source: { startsWith: "doc:" } },
    select: { source: true, chunkIndex: true, title: true, createdAt: true },
    orderBy: [{ source: "asc" }, { chunkIndex: "asc" }]
  });

  console.log(`Total de chunks de documentos no banco: ${docChunks.length}`);
  docChunks.forEach(c => {
    console.log(`  - [${c.source} #${c.chunkIndex}] ${c.title} (criado em ${c.createdAt.toISOString()})`);
  });

  console.log("\n=== 2. TESTANDO PERGUNTAS DIRETAS NA IA (AGENT END-TO-END) ===");
  const apiKey = process.env.GEMINI_API_KEY!;
  
  const testQuestions = [
    "O que o Lucas fez no projeto BNR System e qual era a stack?",
    "Qual foi a participação do Lucas no MedSea Connect e qual reconhecimento o projeto teve?",
    "Quais certificações o Lucas possui segundo o LinkedIn dele?"
  ];

  for (const q of testQuestions) {
    console.log(`\n--------------------------------------------------`);
    console.log(`💬 PERGUNTA: "${q}"`);
    console.log(`Aguardando resposta do assistente...`);
    const deadline = createDeadline(40_000);
    const result = await runAssistant({
      apiKey,
      message: q,
      history: [],
      locale: "pt",
      deadline
    });
    console.log(`\n🤖 RESPOSTA DA IA:\n${result.text}`);
    console.log(`(Rodadas de ferramentas utilizadas: ${result.toolCallRounds})`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Erro no teste:", err);
  process.exit(1);
});
