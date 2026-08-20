import type { MarkdownChunk } from "./markdown-chunker";
import { windowText } from "./text-windower";

// A page below this length (a cover page, a single-line certificate footer)
// produces a chunk that's nearly all breadcrumb and almost no content, which
// embeds poorly and wastes a slot in the retrieval limit=8. Merged into a
// neighboring page instead of standing alone.
const MIN_PAGE_CHARS = 400;

interface PageGroup {
  pageNumbers: number[];
  text: string;
}

function mergeShortPages(pages: string[]): PageGroup[] {
  const groups: PageGroup[] = [];
  let current: PageGroup | null = null;

  for (let i = 0; i < pages.length; i += 1) {
    const pageNumber = i + 1;
    const pageText = (pages[i] ?? "").trim();

    current = current
      ? { pageNumbers: [...current.pageNumbers, pageNumber], text: `${current.text}\n\n${pageText}`.trim() }
      : { pageNumbers: [pageNumber], text: pageText };

    if (current.text.length >= MIN_PAGE_CHARS) {
      groups.push(current);
      current = null;
    }
  }

  if (current) {
    // A trailing short page never reached the threshold on its own — fold it
    // into the previous group rather than let it stand alone (the last page
    // is the common place for a short signature/footer page).
    const previous = groups.pop();
    groups.push(
      previous
        ? { pageNumbers: [...previous.pageNumbers, ...current.pageNumbers], text: `${previous.text}\n\n${current.text}`.trim() }
        : current,
    );
  }

  return groups;
}

function formatPageLabel(pageNumbers: number[]): string {
  const first = pageNumbers[0];
  const last = pageNumbers[pageNumbers.length - 1];
  return first === last ? String(first) : `${first}-${last}`;
}

export function chunkPdfPages(displayName: string, pages: string[]): MarkdownChunk[] {
  const groups = mergeShortPages(pages).filter((group) => group.text.length > 0);
  const chunks: MarkdownChunk[] = [];

  for (const group of groups) {
    const pageLabel = formatPageLabel(group.pageNumbers);
    const breadcrumbLine = `Documento: ${displayName} > página ${pageLabel}`;
    const title = `${displayName} — p. ${pageLabel}`;

    for (const window of windowText(breadcrumbLine, group.text)) {
      chunks.push({ title, content: window });
    }
  }

  return chunks;
}

const CSV_ROWS_PER_CHUNK = 20;
// Tabular text (digits, punctuation-heavy) tokenizes far worse than prose —
// close to 1 token per 1-3 chars instead of ~4 — so a chunk near the prose
// hard cap can exceed gemini-embedding-001's 2048-token limit and fail the
// whole embedding batch. A dedicated, smaller cap keeps CSV chunks safely
// under that regardless of row count.
const CSV_HARD_CAP_CHARS = 4096;
const CSV_SOFT_SPLIT_CHARS = 3200;

function renderRow(fields: string[], row: Record<string, string>): string {
  return fields.map((field) => `${field}: ${row[field] ?? ""}`).join("\n");
}

export function chunkCsvRows(displayName: string, fields: string[], rows: Record<string, string>[]): MarkdownChunk[] {
  const chunks: MarkdownChunk[] = [];

  for (let start = 0; start < rows.length; start += CSV_ROWS_PER_CHUNK) {
    const slice = rows.slice(start, start + CSV_ROWS_PER_CHUNK);
    const firstRow = start + 1;
    const lastRow = start + slice.length;
    const rowLabel = firstRow === lastRow ? String(firstRow) : `${firstRow}-${lastRow}`;
    const breadcrumbLine = `Planilha: ${displayName} > linhas ${rowLabel}`;
    const title = `${displayName} — linhas ${rowLabel}`;
    const body = slice.map((row) => renderRow(fields, row)).join("\n\n");

    for (const window of windowText(breadcrumbLine, body, {
      hardCapChars: CSV_HARD_CAP_CHARS,
      softSplitChars: CSV_SOFT_SPLIT_CHARS,
    })) {
      chunks.push({ title, content: window });
    }
  }

  return chunks;
}
