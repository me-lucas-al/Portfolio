// `gemini-flash-latest` is deliberately NOT a fallback option here: it's an
// alias for the newest release, so it would resolve to the same overloaded
// pool as `gemini-3.7-flash` instead of a stable, less-contended model.
const DEFAULT_MODEL_CHAIN = ["gemini-3.6-flash", "gemini-3.5-flash"];

export function resolveModelChain(): string[] {
  const raw = process.env.ASSISTANT_MODEL_CHAIN;
  if (!raw) return DEFAULT_MODEL_CHAIN;

  const models = raw
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return models.length > 0 ? models : DEFAULT_MODEL_CHAIN;
}
