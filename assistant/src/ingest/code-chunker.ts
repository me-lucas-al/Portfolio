const HARD_CAP_CHARS = 8192;

const EXPORT_BOUNDARY = /^export\s+(default\s+)?(async\s+)?(function|class|const|interface|type|enum)\b/;

function sliceToChunks(header: string, text: string): string[] {
  const budget = Math.max(HARD_CAP_CHARS - header.length - 1, 256);
  const pieces: string[] = [];
  for (let i = 0; i < text.length; i += budget) {
    pieces.push(`${header}\n${text.slice(i, i + budget)}`);
  }
  return pieces;
}

export function chunkCode(header: string, content: string): string[] {
  const full = `${header}\n${content}`;
  if (full.length <= HARD_CAP_CHARS) {
    return [full];
  }

  const lines = content.split(/\r?\n/);
  const blocks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (EXPORT_BOUNDARY.test(line) && current.length > 0) {
      blocks.push(current.join("\n"));
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) {
    blocks.push(current.join("\n"));
  }

  const chunks: string[] = [];
  let buffer: string[] = [];
  let bufferLength = header.length;

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    chunks.push(`${header}\n${buffer.join("\n")}`);
    buffer = [];
    bufferLength = header.length;
  };

  for (const block of blocks) {
    if (header.length + block.length + 1 > HARD_CAP_CHARS) {
      flushBuffer();
      chunks.push(...sliceToChunks(header, block));
      continue;
    }

    if (buffer.length > 0 && bufferLength + block.length + 1 > HARD_CAP_CHARS) {
      flushBuffer();
    }

    buffer.push(block);
    bufferLength += block.length + 1;
  }

  flushBuffer();

  return chunks;
}
