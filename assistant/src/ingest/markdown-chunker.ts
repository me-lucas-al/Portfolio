import { windowText } from "./text-windower";

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

export function chunkMarkdown(fileTitle: string, content: string): MarkdownChunk[] {
  const sections = splitIntoSections(content);
  const chunks: MarkdownChunk[] = [];

  for (const section of sections) {
    const breadcrumb = section.breadcrumb.length > 0 ? section.breadcrumb : [fileTitle];
    const breadcrumbLine = breadcrumb.join(" > ");
    const title = breadcrumb[breadcrumb.length - 1] ?? fileTitle;

    for (const window of windowText(breadcrumbLine, section.body)) {
      chunks.push({ title, content: window });
    }
  }

  return chunks;
}
