import { GeminiSpeechProvider } from "../providers/gemini-speech-provider";
import { GeminiRequestBudget } from "../providers/gemini-request-options";

export function makeSpeechProvider(budget?: GeminiRequestBudget) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  return new GeminiSpeechProvider(apiKey, budget);
}
