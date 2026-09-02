
export type DocumentIssue =
  | { kind: "no_text_layer"; file: string }
  | { kind: "low_text_layer"; file: string; charsPerPage: number }
  | { kind: "possible_multi_column"; file: string }
  | { kind: "parse_failed"; file: string; reason: string }
  | { kind: "too_large"; file: string; bytes: number }
  | { kind: "truncated"; file: string; extractedChars: number }
  | { kind: "rows_truncated"; file: string; keptRows: number; totalRows: number }
  | { kind: "chunks_truncated"; file: string; keptChunks: number; totalChunks: number }
  | { kind: "covered_by_sidecar"; file: string }
  | { kind: "unsupported_legacy_doc"; file: string };

function describe(issue: DocumentIssue): string {
  switch (issue.kind) {
    case "no_text_layer":
      return `${issue.file}: SEM TEXTO — provável PDF escaneado sem camada de texto. Nenhum chunk emitido.`;
    case "low_text_layer":
      return `${issue.file}: densidade de texto baixa (${issue.charsPerPage.toFixed(0)} chars/página) — revisar extração manualmente.`;
    case "possible_multi_column":
      return `${issue.file}: possível layout multi-coluna — o texto extraído pode intercalar colunas fora de ordem.`;
    case "parse_failed":
      return `${issue.file}: FALHA ao processar (${issue.reason}). Chunks antigos (se existirem) serão removidos no próximo deleteStale.`;
    case "too_large":
      return `${issue.file}: arquivo muito grande (${issue.bytes} bytes) — pulado.`;
    case "truncated":
      return `${issue.file}: conteúdo truncado em ${issue.extractedChars} caracteres pelo limite por documento.`;
    case "rows_truncated":
      return `${issue.file}: ${issue.totalRows} linhas excedem o limite de ${issue.keptRows} — apenas as primeiras ${issue.keptRows} foram indexadas.`;
    case "chunks_truncated":
      return `${issue.file}: ${issue.totalChunks} chunks excedem o limite de ${issue.keptChunks} — apenas os primeiros ${issue.keptChunks} foram indexados.`;
    case "covered_by_sidecar":
      return `${issue.file}: descrito por um sidecar manual (.md); extração automática ignorada.`;
    case "unsupported_legacy_doc":
      return `${issue.file}: formato legado .doc fora de escopo — salve como .docx.`;
  }
}

export function formatDocumentReport(issues: DocumentIssue[]): string {
  if (issues.length === 0) return "[docs-source] nenhum problema de qualidade reportado.";
  return ["[docs-source] relatório de qualidade:", ...issues.map((issue) => `  - ${describe(issue)}`)].join("\n");
}
