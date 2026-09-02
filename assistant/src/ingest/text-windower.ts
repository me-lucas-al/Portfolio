
export const SOFT_SPLIT_CHARS = 6000;
export const HARD_CAP_CHARS = 8192;
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

  return windows.flatMap((window) =>
    window.length > hardCapChars ? sliceWithOverlap(window, hardCapChars, overlapRatio) : [window],
  );
}
