import { extractText, getDocumentProxy } from "unpdf";

export interface PdfExtractionResult {
  pages: string[];
  totalPages: number;
  charsPerPage: number;
  emptyPageCount: number;
  possibleMultiColumn: boolean;
}

const HEADER_FOOTER_MIN_PAGES = 3;
const HEADER_FOOTER_MIN_RATIO = 0.6;

const LOW_MEDIAN_LINE_LENGTH = 25;
const MIN_LINES_FOR_COLUMN_HEURISTIC = 10;

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n").normalize("NFC");
}

function dehyphenate(text: string): string {
  return text.replace(/(\p{Ll})-\n(\p{Ll})/gu, "$1$2");
}

const LIST_MARKER = /^\s*([-*•‣▪]|\d+[.)])\s+/;
const SENTENCE_END = /[.:!?]["')\]]?\s*$/;

// PDF text extraction hard-wraps every visual line break, so a paragraph of
// prose arrives as one \n per line. Without recombining those into real
// paragraphs, the windower (which splits on blank lines) sees one giant
// "paragraph" per page and falls back to raw slicing instead of natural
// breaks.
function collapseLayoutBreaks(text: string): string {
  const lines = text.split("\n");
  const paragraphs: string[] = [];
  let current = "";

  for (const line of lines) {
    if (line.trim().length === 0) {
      if (current) paragraphs.push(current);
      current = "";
      continue;
    }

    if (current.length === 0) {
      current = line.trim();
      continue;
    }

    if (SENTENCE_END.test(current) || LIST_MARKER.test(line)) {
      paragraphs.push(current);
      current = line.trim();
    } else {
      current = `${current} ${line.trim()}`;
    }
  }
  if (current) paragraphs.push(current);

  return paragraphs.join("\n\n");
}

function paragraphKey(paragraph: string): string {
  return paragraph.trim().replace(/\d+/g, "#");
}

// A repeated header/footer (contact block, "Page N of M") steals signal from
// the embedding by making every chunk of the document look alike. Digits are
// normalized to "#" so "Page 1 of 12" still matches "Page 2 of 12".
function stripRepeatedHeaderFooter(pages: string[]): string[] {
  if (pages.length < HEADER_FOOTER_MIN_PAGES) return pages;

  const pageParagraphs = pages.map((page) => page.split("\n\n"));
  const frequency = new Map<string, number>();

  for (const paragraphs of pageParagraphs) {
    const uniqueKeysOnPage = new Set(paragraphs.map((p) => paragraphKey(p)).filter((key) => key.length > 0));
    for (const key of uniqueKeysOnPage) {
      frequency.set(key, (frequency.get(key) ?? 0) + 1);
    }
  }

  const threshold = Math.ceil(pages.length * HEADER_FOOTER_MIN_RATIO);
  const repeatedKeys = new Set([...frequency.entries()].filter(([, count]) => count >= threshold).map(([key]) => key));
  if (repeatedKeys.size === 0) return pages;

  return pageParagraphs.map((paragraphs) => paragraphs.filter((p) => !repeatedKeys.has(paragraphKey(p))).join("\n\n"));
}

export async function extractPdf(bytes: Uint8Array): Promise<PdfExtractionResult> {
  const pdf = await getDocumentProxy(bytes);
  const { totalPages, text } = await extractText(pdf, { mergePages: false });

  const emptyPageCount = text.filter((page) => page.trim().length === 0).length;

  const allLineLengths = text
    .flatMap((page) => page.split(/\r?\n/))
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.length)
    .sort((a, b) => a - b);
  const medianLineLength = allLineLengths.length > 0 ? (allLineLengths[Math.floor(allLineLengths.length / 2)] ?? 0) : 0;
  const possibleMultiColumn = allLineLengths.length >= MIN_LINES_FOR_COLUMN_HEURISTIC && medianLineLength < LOW_MEDIAN_LINE_LENGTH;

  const normalizedPages = text.map((page) => collapseLayoutBreaks(dehyphenate(normalizeLineEndings(page))));
  const pages = stripRepeatedHeaderFooter(normalizedPages);

  const totalChars = pages.reduce((sum, page) => sum + page.length, 0);
  const charsPerPage = totalPages > 0 ? totalChars / totalPages : 0;

  return { pages, totalPages, charsPerPage, emptyPageCount, possibleMultiColumn };
}
