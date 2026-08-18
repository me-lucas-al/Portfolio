const SOFT_SPLIT_CHARS = 6000;
const HARD_CAP_CHARS = 8192; // ~2048 tokens at ~4 chars/token
const OVERLAP_RATIO = 0.15;

export interface MarkdownChunk {
  title: string;
  content: string;
}

interface HeadingFrame {
  level: number;
  text: string;
}

interface RawSection {
  breadcrumb: string[];
  body: string;
}

function splitIntoSections(content: string): RawSection[] {
  const lines = content.split(/\r?\n/);
  const sections: RawSection[] = [];
  const stack: HeadingFrame[] = [];
  let currentBody: string[] = [];

  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (body.length > 0) {
      sections.push({ breadcrumb: stack.map((frame) => frame.text), body });
    }
    currentBody = [];
  };

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+?)\s*$/);
    if (!match) {
      currentBody.push(line);
      continue;
    }

    flush();

    const level = match[1]?.length ?? 1;
    const text = match[2] ?? "";

    while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 0) >= level) {
      stack.pop();
    }
    stack.push({ level, text });
  }

  flush();

  return sections;
}

function windowSection(breadcrumbLine: string, body: string): string[] {
  const full = `${breadcrumbLine}\n\n${body}`;
  if (full.length <= SOFT_SPLIT_CHARS) {
    return [full];
  }

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const overlapChars = Math.floor(SOFT_SPLIT_CHARS * OVERLAP_RATIO);
  const windows: string[] = [];
  let current: string[] = [];
  let currentLength = breadcrumbLine.length;

  const pushWindow = () => {
    if (current.length === 0) return;
    windows.push(`${breadcrumbLine}\n\n${current.join("\n\n")}`);
  };

  for (const paragraph of paragraphs) {
    if (current.length > 0 && currentLength + paragraph.length > SOFT_SPLIT_CHARS) {
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

  return windows.map((window) => (window.length > HARD_CAP_CHARS ? window.slice(0, HARD_CAP_CHARS) : window));
}

export function chunkMarkdown(fileTitle: string, content: string): MarkdownChunk[] {
  const sections = splitIntoSections(content);
  const chunks: MarkdownChunk[] = [];

  for (const section of sections) {
    const breadcrumb = section.breadcrumb.length > 0 ? section.breadcrumb : [fileTitle];
    const breadcrumbLine = breadcrumb.join(" > ");
    const title = breadcrumb[breadcrumb.length - 1] ?? fileTitle;

    for (const windowText of windowSection(breadcrumbLine, section.body)) {
      chunks.push({ title, content: windowText });
    }
  }

  return chunks;
}
