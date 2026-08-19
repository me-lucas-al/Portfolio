import mammoth from "mammoth";

export interface DocxExtractionResult {
  markdown: string;
  warnings: string[];
}

// mammoth.js's default style map already recognizes the English "Heading 1..3"
// paragraph styles, but it matches style NAMES, not semantic levels — a Word
// document authored in Portuguese names its heading styles "Título 1..3", so
// without this the entire heading structure (and with it, chunkMarkdown's
// heading-aware splitting) would silently disappear for a pt-BR .docx.
const STYLE_MAP = [
  "p[style-name='Título 1'] => h1:fresh",
  "p[style-name='Título 2'] => h2:fresh",
  "p[style-name='Título 3'] => h3:fresh",
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
];

// mammoth.js exports convertToMarkdown at runtime, but its .d.ts (as of 1.x)
// only declares convertToHtml/extractRawText/embedStyleMap — an upstream gap,
// not a typo here. Escape route if this ever breaks: fall back to
// convertToHtml + a turndown pass, isolated to this one function.
const convertToMarkdown = (mammoth as unknown as {
  convertToMarkdown: (input: { buffer: Buffer }, options?: { styleMap?: string[] }) => Promise<{ value: string; messages: { type: string; message: string }[] }>;
}).convertToMarkdown;

// Without a convertImage option, embedded images become base64 data URIs
// inline in the markdown — pure noise for retrieval and a waste of chunk
// budget, so they're stripped rather than configured away upstream.
const DATA_URI_IMAGE = /!\[[^\]]*\]\(data:[^)]*\)/g;

export async function extractDocx(buffer: Buffer): Promise<DocxExtractionResult> {
  const result = await convertToMarkdown({ buffer }, { styleMap: STYLE_MAP });
  const markdown = result.value.replace(DATA_URI_IMAGE, "").trim();
  const warnings = result.messages.filter((message) => message.type === "warning").map((message) => message.message);

  return { markdown, warnings };
}
