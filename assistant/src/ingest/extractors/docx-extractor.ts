import mammoth from "mammoth";

export interface DocxExtractionResult {
  markdown: string;
  warnings: string[];
}

const STYLE_MAP = [
  "p[style-name='Título 1'] => h1:fresh",
  "p[style-name='Título 2'] => h2:fresh",
  "p[style-name='Título 3'] => h3:fresh",
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
];

const convertToMarkdown = (mammoth as unknown as {
  convertToMarkdown: (input: { buffer: Buffer }, options?: { styleMap?: string[] }) => Promise<{ value: string; messages: { type: string; message: string }[] }>;
}).convertToMarkdown;

const DATA_URI_IMAGE = /!\[[^\]]*\]\(data:[^)]*\)/g;

export async function extractDocx(buffer: Buffer): Promise<DocxExtractionResult> {
  const result = await convertToMarkdown({ buffer }, { styleMap: STYLE_MAP });
  const markdown = result.value.replace(DATA_URI_IMAGE, "").trim();
  const warnings = result.messages.filter((message) => message.type === "warning").map((message) => message.message);

  return { markdown, warnings };
}
