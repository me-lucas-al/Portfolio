import Papa from "papaparse";

export interface CsvExtractionResult {
  fields: string[];
  rows: Record<string, string>[];
  errors: string[];
}

function decodeBuffer(buffer: Buffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function sniffDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) ?? []).length;
  const commas = (headerLine.match(/,/g) ?? []).length;
  return semicolons > commas ? ";" : ",";
}

export function extractCsv(buffer: Buffer): CsvExtractionResult {
  const decoded = stripBom(decodeBuffer(buffer));
  const headerLine = decoded.split(/\r?\n/)[0] ?? "";
  const delimiter = sniffDelimiter(headerLine);

  const parsed = Papa.parse<Record<string, string>>(decoded, {
    header: true,
    skipEmptyLines: "greedy",
    delimiter,
  });

  const errors = parsed.errors.map((error) => `linha ${error.row}: ${error.message}`);
  const fields = parsed.meta.fields ?? [];

  if (fields.length === 0) {
    return { fields: [], rows: [], errors: [...errors, "cabeçalho não reconhecido (nenhum campo detectado)"] };
  }

  return { fields, rows: parsed.data, errors };
}
