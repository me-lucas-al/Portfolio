export interface ToneData {
  emotion: "neutral" | "happy" | "sad" | "surprised" | "relaxed";
  styleTag: string | null; // e.g. [casual], [rindo], [pensativo]
}

export function detectTone(text: string): ToneData {
  const lower = text.toLowerCase();

  if (lower.includes("!") || lower.includes("haha") || lower.includes("surpresa")) {
    return { emotion: "happy", styleTag: "[rindo]" };
  }

  if (lower.includes("?") && (lower.includes("como") || lower.includes("por que") || lower.includes("qual"))) {
    return { emotion: "surprised", styleTag: "[pensativo]" };
  }

  if (lower.includes("triste") || lower.includes("infelizmente") || lower.includes("desculpe")) {
    return { emotion: "sad", styleTag: null };
  }

  if (lower.includes("claro") || lower.includes("bem-vindo") || lower.includes("ótimo") || lower.includes("legal")) {
    return { emotion: "relaxed", styleTag: "[casual]" };
  }

  return { emotion: "neutral", styleTag: null };
}
