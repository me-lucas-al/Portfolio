import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chunkCode } from "../ingest/code-chunker";
import { hashContent } from "../ingest/hash";
import { ChunkSource, RawChunk } from "./chunk-source.interface";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const CACHE_DIR = path.join(REPO_ROOT, ".cache", "repos");

const MAX_FILE_BYTES = 100 * 1024;

const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".prisma", ".sql", ".css", ".md", ".yaml", ".yml"]);
const ALLOWED_FILENAMES = new Set(["package.json", "turbo.json", "next.config.ts"]);

// Filenames that are known-safe boilerplate and simply carry no useful signal for
// retrieval. Skipped silently, before the .env guard below, so a legitimate
// ".env.example" template never trips it.
const SKIP_FILENAMES = new Set(["pnpm-lock.yaml", "package-lock.json", "yarn.lock", ".env.example"]);

const DENYLIST_DIR_NAMES = new Set(["node_modules", ".next", "dist", ".git", ".turbo", "public", ".cache", "dados-pessoais"]);

// Defense in depth: never trust the extension allowlist alone to keep secrets out.
// Any remaining path segment matching ".env" aborts the whole ingest run loudly.
const ENV_PATH_GUARD = /\.env/i;

interface RepoRef {
  owner: string;
  repo: string;
  fullName: string;
}

const REPO_REF_PATTERN = /^[\w.-]+\/[\w.-]+$/;

function parseRepos(): RepoRef[] {
  const raw = process.env.REPOS_TO_INDEX;
  if (!raw?.trim()) return [];

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((fullName) => {
      if (!REPO_REF_PATTERN.test(fullName)) {
        throw new Error(`Invalid REPOS_TO_INDEX entry "${fullName}". Expected "owner/repo".`);
      }
      const [owner, repo] = fullName.split("/");
      if (!owner || !repo) {
        throw new Error(`Invalid REPOS_TO_INDEX entry "${fullName}".`);
      }
      return { owner, repo, fullName };
    });
}

async function assertPublicRepo(ref: RepoRef): Promise<void> {
  const response = await fetch(`https://api.github.com/repos/${ref.owner}/${ref.repo}`, {
    headers: { "User-Agent": "portfolio-assistant-ingest", Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`Could not verify repository ${ref.fullName} on GitHub (status ${response.status}). Refusing to index.`);
  }

  const data = (await response.json()) as { private?: boolean };
  if (data.private) {
    throw new Error(`Repository ${ref.fullName} is private. The public chat cannot index private code (see decision D5).`);
  }
}

async function ensureCloned(ref: RepoRef, targetDir: string): Promise<void> {
  const exists = await stat(targetDir)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    await execFileAsync("git", ["-C", targetDir, "pull", "--ff-only"]);
    return;
  }

  await mkdir(path.dirname(targetDir), { recursive: true });
  await execFileAsync("git", ["clone", "--depth", "1", `https://github.com/${ref.owner}/${ref.repo}.git`, targetDir]);
}

function isDenylistedDir(posixRelPath: string): boolean {
  const segments = posixRelPath.split("/");
  const dirName = segments[segments.length - 1] ?? "";
  if (DENYLIST_DIR_NAMES.has(dirName)) return true;
  if (posixRelPath === "database/prisma/generated" || posixRelPath.startsWith("database/prisma/generated/")) return true;
  return false;
}

interface WalkedFile {
  absPath: string;
  relPath: string;
}

async function* walk(absDir: string, relDir: string): AsyncIterable<WalkedFile> {
  const entries = await readdir(absDir, { withFileTypes: true });

  for (const entry of entries) {
    const posixRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;

    if (entry.isFile() && SKIP_FILENAMES.has(entry.name)) continue;

    if (ENV_PATH_GUARD.test(posixRelPath)) {
      throw new Error(`Refusing to index a path matching /\\.env/: "${posixRelPath}"`);
    }

    const absPath = path.join(absDir, entry.name);

    if (entry.isDirectory()) {
      if (isDenylistedDir(posixRelPath)) continue;
      yield* walk(absPath, posixRelPath);
      continue;
    }

    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name);
    const allowed = ALLOWED_EXTENSIONS.has(ext) || ALLOWED_FILENAMES.has(entry.name);
    if (!allowed) continue;

    yield { absPath, relPath: posixRelPath };
  }
}

export class CodeSource implements ChunkSource {
  namespace = "code:";

  async *collect(): AsyncIterable<RawChunk> {
    const repos = parseRepos();

    for (const ref of repos) {
      await assertPublicRepo(ref);

      const targetDir = path.join(CACHE_DIR, ref.repo);
      await ensureCloned(ref, targetDir);

      for await (const file of walk(targetDir, "")) {
        const info = await stat(file.absPath);
        if (info.size > MAX_FILE_BYTES) {
          console.warn(`[code-source] skipping oversized file (${info.size}B): ${ref.repo}/${file.relPath}`);
          continue;
        }

        const raw = await readFile(file.absPath, "utf-8");
        const header = `// arquivo: ${file.relPath} | repo: ${ref.repo}`;
        const pieces = chunkCode(header, raw);
        const source = `code:${ref.repo}/${file.relPath}`;

        for (let index = 0; index < pieces.length; index += 1) {
          const content = pieces[index];
          if (!content) continue;
          yield {
            source,
            sourceType: "code",
            chunkIndex: index,
            locale: null,
            title: file.relPath,
            content,
            contentHash: hashContent(content),
          };
        }
      }
    }
  }
}
