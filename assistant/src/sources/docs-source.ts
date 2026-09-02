import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractPdf } from "../ingest/extractors/pdf-extractor";
import { extractDocx } from "../ingest/extractors/docx-extractor";
import { extractCsv } from "../ingest/extractors/csv-extractor";
import { DocumentIssue, formatDocumentReport } from "../ingest/extractors/document-issue";
import { chunkPdfPages, chunkCsvRows } from "../ingest/document-chunker";
import { chunkMarkdown, MarkdownChunk } from "../ingest/markdown-chunker";
import { hashContent } from "../ingest/hash";
import { ChunkSource, RawChunk } from "./chunk-source.interface";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCUMENTS_DIR = path.resolve(__dirname, "../../../ai-knowledge-base/documentos");

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_EXTRACTED_CHARS = 400_000;
const MAX_CHUNKS_PER_DOC = 60;
const MAX_CSV_ROWS = 5_000;

const MIN_CHARS_PER_PAGE_DENSITY = 100;

const ALLOWED_EXTENSIONS: Record<string, "pdf" | "docx" | "csv"> = { ".pdf": "pdf", ".docx": "docx", ".csv": "csv" };

const PII_PATTERNS: { name: string; pattern: RegExp; mask: string }[] = [
  { name: "email", pattern: /[\w.+-]+@[\w-]+\.[\w.-]+/g, mask: "[EMAIL REDACTED]" },
  { name: "cpf", pattern: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, mask: "[CPF REDACTED]" },
  { name: "cep", pattern: /\b\d{5}-\d{3}\b/g, mask: "[CEP REDACTED]" },
  { name: "telefone", pattern: /\(\d{2}\)\s?9?\d{4}[\s.-]?\d{4}\b/g, mask: "[TELEFONE REDACTED]" },
  { name: "rg", pattern: /\b\d{1,2}\.\d{3}\.\d{3}-[0-9xX]\b/g, mask: "[RG REDACTED]" },
];

function sanitizePii(text: string): string {
  let result = text;
  for (const { pattern, mask } of PII_PATTERNS) {
    result = result.replace(pattern, mask);
  }
  return result;
}

function slugify(posixRelPath: string): string {

  return posixRelPath
    .normalize("NFD")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9/._-]/g, "");
}

interface WalkedFile {
  absPath: string;
  relPath: string;
}

async function* walk(absDir: string, relDir: string): AsyncIterable<WalkedFile> {
  const entries = await readdir(absDir, { withFileTypes: true });
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sorted) {
    if (entry.isSymbolicLink()) continue;
    if (entry.name.startsWith(".")) continue;
    if (entry.name.startsWith("~$")) continue;
    if (entry.name === "Thumbs.db") continue;

    const posixRelPath = relDir ? `${relDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      if (entry.name.startsWith("_")) continue;
      yield* walk(path.join(absDir, entry.name), posixRelPath);
      continue;
    }

    if (!entry.isFile()) continue;

    yield { absPath: path.join(absDir, entry.name), relPath: posixRelPath };
  }
}

function truncateIfNeeded(text: string, issues: DocumentIssue[], displayName: string): string {
  if (text.length <= MAX_EXTRACTED_CHARS) return text;
  issues.push({ kind: "truncated", file: displayName, extractedChars: MAX_EXTRACTED_CHARS });
  return text.slice(0, MAX_EXTRACTED_CHARS);
}

async function hasSidecar(absPath: string): Promise<boolean> {
  return stat(`${absPath}.md`)
    .then(() => true)
    .catch(() => false);
}

export class DocsSource implements ChunkSource {
  namespace = "doc:";

  async *collect(): AsyncIterable<RawChunk> {
    const dirExists = await stat(DOCUMENTS_DIR)
      .then((info) => info.isDirectory())
      .catch(() => false);
    if (!dirExists) {
      throw new Error(
        `[docs-source] expected directory not found: ${DOCUMENTS_DIR}. This looks like a broken checkout, not "zero documents" — create the folder (see ai-knowledge-base/documentos/README.md) before running --source=docs.`,
      );
    }

    const issues: DocumentIssue[] = [];

    for await (const file of walk(DOCUMENTS_DIR, "")) {
      const displayName = file.relPath.normalize("NFC");
      const ext = path.extname(displayName).toLowerCase();

      if (ext === ".doc") {
        issues.push({ kind: "unsupported_legacy_doc", file: displayName });
        continue;
      }

      const kind = ALLOWED_EXTENSIONS[ext];
      if (!kind) continue;

      const source = `doc:${slugify(displayName)}`;
      const sidecarPresent = await hasSidecar(file.absPath);

      let chunks: MarkdownChunk[] = [];

      try {
        const info = await stat(file.absPath);
        if (info.size > MAX_FILE_BYTES) {
          issues.push({ kind: "too_large", file: displayName, bytes: info.size });
          continue;
        }

        const raw = await readFile(file.absPath);

        if (kind === "pdf") {
          const extracted = await extractPdf(new Uint8Array(raw));
          const sanitizedPages = extracted.pages.map((page) => sanitizePii(page));
          const fullText = sanitizedPages.join("\n\n");

          if (extracted.emptyPageCount === extracted.totalPages || fullText.trim().length === 0) {
            issues.push(
              sidecarPresent ? { kind: "covered_by_sidecar", file: displayName } : { kind: "no_text_layer", file: displayName },
            );
            continue;
          }
          if (extracted.possibleMultiColumn) {
            issues.push({ kind: "possible_multi_column", file: displayName });
          }
          if (extracted.charsPerPage < MIN_CHARS_PER_PAGE_DENSITY) {
            issues.push({ kind: "low_text_layer", file: displayName, charsPerPage: extracted.charsPerPage });
          }

          let remainingBudget = MAX_EXTRACTED_CHARS;
          let didTruncate = false;
          const boundedPages = sanitizedPages.map((page) => {
            if (remainingBudget <= 0) {
              didTruncate = didTruncate || page.length > 0;
              return "";
            }
            if (page.length > remainingBudget) {
              const bounded = page.slice(0, remainingBudget);
              remainingBudget = 0;
              didTruncate = true;
              return bounded;
            }
            remainingBudget -= page.length;
            return page;
          });
          if (didTruncate) issues.push({ kind: "truncated", file: displayName, extractedChars: MAX_EXTRACTED_CHARS });
          chunks = chunkPdfPages(displayName, boundedPages);
        } else if (kind === "docx") {
          const extracted = await extractDocx(raw);
          const sanitizedMarkdown = sanitizePii(extracted.markdown);

          if (sanitizedMarkdown.trim().length === 0) {
            issues.push(
              sidecarPresent ? { kind: "covered_by_sidecar", file: displayName } : { kind: "no_text_layer", file: displayName },
            );
            continue;
          }

          const markdown = truncateIfNeeded(sanitizedMarkdown, issues, displayName);
          chunks = chunkMarkdown(displayName, markdown);
        } else {
          const extracted = extractCsv(raw);

          if (extracted.fields.length === 0) {
            issues.push({ kind: "parse_failed", file: displayName, reason: extracted.errors.join("; ") || "cabeçalho não reconhecido" });
            continue;
          }

          let rows = extracted.rows;
          if (rows.length > MAX_CSV_ROWS) {
            issues.push({ kind: "rows_truncated", file: displayName, keptRows: MAX_CSV_ROWS, totalRows: rows.length });
            rows = rows.slice(0, MAX_CSV_ROWS);
          }

          const sanitizedRows = rows.map((row) =>
            Object.fromEntries(Object.entries(row).map(([key, val]) => [key, sanitizePii(String(val))])),
          );

          chunks = chunkCsvRows(displayName, extracted.fields, sanitizedRows);
        }

        if (chunks.length > MAX_CHUNKS_PER_DOC) {
          issues.push({ kind: "chunks_truncated", file: displayName, keptChunks: MAX_CHUNKS_PER_DOC, totalChunks: chunks.length });
          chunks = chunks.slice(0, MAX_CHUNKS_PER_DOC);
        }
      } catch (error) {
        issues.push({ kind: "parse_failed", file: displayName, reason: error instanceof Error ? error.message : String(error) });
        continue;
      }

      for (let index = 0; index < chunks.length; index += 1) {
        const chunk = chunks[index];
        if (!chunk) continue;
        yield {
          source,
          sourceType: kind,
          chunkIndex: index,
          locale: null,
          title: chunk.title,
          content: chunk.content,
          contentHash: hashContent(chunk.content),
        };
      }
    }

    console.log(formatDocumentReport(issues));
  }
}
