// Shared by markdown, docx and pdf chunking: takes a breadcrumb line plus a
// body of arbitrary length and produces overlapping windows under the hard
// cap. Content is never discarded — a paragraph too long for one window is
// split by line, and a line still too long is sliced with overlap, but every
// character of input ends up in some window.
export const SOFT_SPLIT_CHARS = 6000;
export const HARD_CAP_CHARS = 8192; // ~2048 tokens at ~4 chars/token
export const OVERLAP_RATIO = 0.15;

function sliceWithOverlap(text: string, hardCap: number, overlapRatio: number): string[] {
  const overlap = Math.floor(hardCap * overlapRatio);
  const step = hardCap - overlap;
  const pieces: string[] = [];

  for (let start = 0; start < text.length; start += step) {
    pieces.push(text.slice(start, start + hardCap));
    if (start + hardCap >= text.length) break;
  }

  return pieces;
}

// A single "paragraph" (no blank line inside it) that still exceeds the hard
// cap is split by line, then any line still too long is sliced with overlap.
// This is the cascade that replaces the old slice-and-discard behavior.
function splitOverlongParagraph(paragraph: string, hardCap: number, overlapRatio: number): string[] {
  if (paragraph.length <= hardCap) return [paragraph];

  const lines = paragraph.split("\n");
  const pieces: string[] = [];

  for (const line of lines) {
    if (line.length <= hardCap) {
      pieces.push(line);
    } else {
      pieces.push(...sliceWithOverlap(line, hardCap, overlapRatio));
    }
  }

  return pieces;
}

export function windowText(
  breadcrumbLine: string,
  body: string,
  options: { softSplitChars?: number; hardCapChars?: number; overlapRatio?: number } = {},
): string[] {
  const softSplitChars = options.softSplitChars ?? SOFT_SPLIT_CHARS;
  const hardCapChars = options.hardCapChars ?? HARD_CAP_CHARS;
  const overlapRatio = options.overlapRatio ?? OVERLAP_RATIO;

  const full = `${breadcrumbLine}\n\n${body}`;
  if (full.length <= softSplitChars) {
    return [full];
  }

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .flatMap((paragraph) => splitOverlongParagraph(paragraph, hardCapChars, overlapRatio));

  const overlapChars = Math.floor(softSplitChars * overlapRatio);
  const windows: string[] = [];
  let current: string[] = [];
  let currentLength = breadcrumbLine.length;

  const pushWindow = () => {
    if (current.length === 0) return;
    windows.push(`${breadcrumbLine}\n\n${current.join("\n\n")}`);
  };

  for (const paragraph of paragraphs) {
    if (current.length > 0 && currentLength + paragraph.length > softSplitChars) {
      pushWindow();

      const carry: string[] = [];
      let carryLength = 0;
      for (let i = current.length - 1; i >= 0 && carryLength < overlapChars; i -= 1) {
        const previous = current[i];
        if (!previous) continue;
        carry.unshift(previous);
        carryLength += previous.length;
      }
      current = carry;
      currentLength = breadcrumbLine.length + carryLength;
    }

    current.push(paragraph);
    currentLength += paragraph.length;
  }

  pushWindow();

  // A single overlong paragraph/line can still leave a window above the hard
  // cap even after the cascade above (e.g. one already-sliced piece plus
  // carried-over overlap); re-slice defensively instead of ever truncating.
  return windows.flatMap((window) =>
    window.length > hardCapChars ? sliceWithOverlap(window, hardCapChars, overlapRatio) : [window],
  );
}
